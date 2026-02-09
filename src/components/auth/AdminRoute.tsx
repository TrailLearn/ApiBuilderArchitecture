import { Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../features/auth/AuthContext';

const AdminRoute = () => {
  const { t } = useTranslation("navbar");
  const { user, loading } = useAuth();

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  // Vérification du rôle dans les app_metadata
  const isAdmin = user?.app_metadata?.role === 'admin';

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
