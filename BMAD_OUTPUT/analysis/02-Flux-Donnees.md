# Flux de Données et User Journeys (Supabase Edition)

## 1. User Journeys (Frontend)

Diagramme des interactions utilisateurs avec le système via l'application Front.

```mermaid
sequenceDiagram
    participant Anon as Anonymous
    participant User as Auth User
    participant Admin as Admin
    participant Front as Frontend App
    participant DB as Supabase DB

    %% Journey 1: Lecture Publique
    Anon->>Front: View Scholarship List
    Front->>DB: GET /scholarships_public (RLS: Public)
    DB-->>Front: JSON List
    Front-->>Anon: Display Cards

    %% Journey 2: Soumission
    User->>Front: Click "Submit Scholarship"
    Front->>DB: POST /scholarships_staging (RLS: Insert Own)
    note right of DB: Status = PENDING<br/>Owner = User.uid<br/>Source = USER_SUBMISSION
    DB-->>Front: 201 Created
    User->>Front: Check Status
    Front->>DB: GET /scholarships_staging?status=PENDING
    DB-->>Front: Status "Pending"

    %% Journey 3: Validation Admin
    Admin->>Front: Open Admin Dashboard
    Front->>DB: GET /scholarships_staging?status=PENDING (RLS: Admin)
    Admin->>Front: Click "Approve"
    Front->>DB: UPDATE scholarships_staging SET status='APPROVED'
    
    rect rgb(200, 255, 200)
    note right of DB: Trigger Database<br/>(System Role)
    DB->>DB: COPY Staged -> Public
    DB->>DB: Log Audit Event
    end
```

## 2. Flux d'Ingestion Multi-Sources

Détail de comment les 3 types de sources alimentent la file d'attente.

```mermaid
graph LR
    subgraph "Sources"
        U[User Form] -->|Payload| EF
        S[Scraper Script] -->|Payload| EF
        A[Public API Fetcher] -->|Payload| EF
    end
    
    EF[Edge Function: Ingest]
    
    subgraph "Raw Storage"
        EF -->|Save /user_submission/...| B1[Bucket: User]
        EF -->|Save /scraping/...| B2[Bucket: Scraper]
        EF -->|Save /public_api/...| B3[Bucket: API]
    end
    
    EF -->|Insert Row| Q[Table: ingestion_queue]
    
    Q -->|Metadata| M1{source_type}
    M1 -- USER --> AuthID[Link to User ID]
    M1 -- SCRAPER/API --> OriginURL[Link to URL]
```

## 3. Flux de Revalidation Annuelle (Freshness)

Processus automatique pour garantir que les données ne périment pas.

```mermaid
graph TD
    subgraph "Scheduler (Nightly)"
        Cron[pg_cron] -->|SELECT candidates| DB
        DB -->|Rows where next_due < NOW| Candidates
    end

    Candidates -->|Webhook Batch| Edge[Edge Function: verify-freshness]

    subgraph "Verification Logic"
        Edge -->|Check SourceType| CheckType{Type?}
        
        CheckType -- API/Scraping --> HTTP[HTTP GET SourceURL]
        CheckType -- User --> Email[Send Email 'Is this still valid?']
        
        HTTP -- 200 OK + Content Match --> OK[Unchanged]
        HTTP -- 404 / 500 --> Err[Broken Link]
        HTTP -- Content Differs --> Diff[Changed Info]
    end

    OK -->|Update Date| FinalDB[Table Final: next_due + 1 year]
    
    Err -->|Mark Status| FinalDB2[Table Final: verification_status = OUTDATED]
    
    Diff -->|Create Draft| Staged[Table Staged]
    Staged -->|Status| Review[Status: NEEDS_REVIEW]
    Review -->|Alert| Admin[Admin Dashboard]
```

## 4. Détail des Règles RLS (Row Level Security)

Les règles sont appliquées au niveau de la base de données, rendant l'API sûre par défaut.

### Table: `scholarships_public`
*   **Policy `public_view`**:
    *   `SELECT` using `(true)`
    *   Autorise tout le monde (même non connecté) à lire.
*   **Policy `system_write_only`**:
    *   `INSERT/UPDATE/DELETE` using `(false)`
    *   Personne ne peut écrire via l'API. Seuls les triggers internes (`security definer`) le peuvent.

### Table: `scholarships_staging` (Admin Validation)
*   **Policy `user_submit`**:
    *   `INSERT` with check `(auth.uid() = submitted_by)`
    *   `SELECT` using `(auth.uid() = submitted_by)`
    *   L'utilisateur peut créer et voir SES bourses.
*   **Policy `admin_manage`**:
    *   `ALL` using `(auth.jwt() ->> 'role' = 'admin')`
    *   L'admin peut tout voir et tout modifier.

### Table: `audit_logs`
*   **Policy `admin_view`**:
    *   `SELECT` using `(auth.jwt() ->> 'role' = 'admin')`
    *   Seuls les admins peuvent voir l'historique des actions.

## 5. Traçabilité et Logs

Chaque action critique (création, validation, publication) est enregistrée.

**Table `validation_events` (Audit) :**
*   `event_type`: (SUBMIT, APPROVE, REJECT, AUTO_REVALIDATE)
*   `scholarship_id`: UUID
*   `actor_id`: UUID (User ID, Admin ID, ou 'system' pour le cron)
*   `source_type`: (SCRAPING, USER, API)
*   `created_at`: NOW()

*Ce log est rempli automatiquement par des **Triggers Database** à chaque changement de statut dans `scholarships_staging`.*