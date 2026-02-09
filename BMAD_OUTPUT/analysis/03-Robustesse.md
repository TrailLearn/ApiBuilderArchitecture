# Robustesse et Résilience (Supabase Light Edition)

## Supabase Implementation Mapping

| Besoin Robustesse | Solution Supabase Light |
| :--- | :--- |
| **Dead Letter Queue (DLQ)** | **Colonne `error_log`** dans la table `ingestion_queue` + statut `ERROR`. |
| **Retry Policy** | **pg_cron** qui relance périodiquement les lignes en `status='RETRY'` (max 3 fois). |
| **Replay Capability** | **SQL Function** qui lit le JSON depuis Storage et ré-insère en Staging. |
| **Backups** | **pg_dump** scripté (Free Tier n'a pas de PITR auto). |

## Scénarios de Panne (Adaptés MVP)

### 1. Poison Message (Fichier corrompu)
*   **Contexte :** Un utilisateur upload un fichier JSON mal formé.
*   **Mitigation :** L'Edge Function capture l'erreur et update `ingestion_queue` en `ERROR`. Admin alerté.

### 2. Source Flooding (Quota DB dépassé)
*   **Contexte :** Un bot remplit la table `ingestion_queue`.
*   **Mitigation :** Retention Policy via Cron (suppression logs > 7 jours) + Payload dans Storage (hors DB).

### 3. Schema Drift (Changement de format source)
*   **Contexte :** Les données Raw ne correspondent plus au validateur.
*   **Mitigation :** Statut `PARSE_ERROR`. Une fois le code corrigé, replay via SQL simple.

### 4. Admin Rogue (Suppression accidentelle)
*   **Contexte :** Suppression de bourses valides.
*   **Mitigation :** **Soft Deletes** (`is_archived`) et Audit Log immuable pour reconstruire l'état.

### 5. Stale Data (Données périmées)
*   **Contexte :** Une bourse expire ou change de montant sans que le système le sache.
*   **Risque :** Perte de confiance des utilisateurs.
*   **Mitigation (Freshness Loop) :**
    *   Le champ `next_verification_due` garantit qu'aucune donnée n'est "oubliée".
    *   Si le check échoue (site source down), la bourse passe en `NEEDS_REVIEW` (et non supprimée) pour vérification humaine.
    *   Le Front affiche un warning "Dernière vérification : il y a X mois" aux utilisateurs.

## Critères de Santé (MVP Free Tier)

Le système est "OK" si :
1.  **Storage Usage < 90%** (Bucket Raw).
2.  **Database Size < 450MB** (Nettoyage actif).
3.  **Freshness Lag :** Aucune bourse active n'a `last_verified_at > 13 mois`.

## MVP Free-tier Constraints (Front & Auth)

| Risque | Contournement |
| :--- | :--- |
| **Latence Frontend** | Hébergement sur Vercel/Netlify (Edge Network) pour servir le JS/HTML. Cache API via Cloudflare si besoin. |
| **Auth Rate Limits** | Supabase Auth a des limites (ex: emails/heure). Utiliser le Social Login (Google/GitHub) pour décharger l'envoi d'emails. |
| **Edge Function Timeout** | Le process de revalidation annuelle doit traiter petit à petit (Batching) pour ne pas dépasser les 5-10s d'exécution. |
