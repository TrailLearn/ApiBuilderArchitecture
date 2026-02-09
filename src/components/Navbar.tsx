import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../features/auth/AuthContext";
import LanguageSwitchButton from "./LanguageSwitchButton";
import Sidebar from "./Sidebar";
import { Button } from "./ui/button";

const Navbar = () => {
  const { t } = useTranslation("navbar");
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const isAdmin = user?.app_metadata?.role === 'admin';

  return (
    <nav className="flex flex-row justify-between items-center p-4 border-b">
      <div className="flex items-center space-x-4">
        <Sidebar />
        <Link to="/" className="text-xl font-bold">Scholarships</Link>
      </div>

      <div className="flex flex-row items-center space-x-4">
        <ul className="flex flex-row space-x-4 hidden md:flex">
          <li><Link to="/">{t('home')}</Link></li>
          {isAdmin && (
            <li><Link to="/admin" className="text-red-600 font-semibold">Admin</Link></li>
          )}
        </ul>
        
        <LanguageSwitchButton />
        
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden sm:inline">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              {t('logout')}
            </Button>
          </div>
        ) : (
          <Link to="/login">
            <Button size="sm">{t('login')}</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;