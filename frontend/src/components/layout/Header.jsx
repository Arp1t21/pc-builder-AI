import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';

export default function Header() {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PC</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Builder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/builder"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Конфигуратор
            </Link>
            <Link
              to="/public-builds"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Публичные сборки
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
                >
                  <User size={20} />
                  <span className="font-medium">Профиль</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Выйти</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="btn-primary"
              >
                Войти
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              to="/builder"
              className="block text-gray-700 hover:text-primary font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Конфигуратор
            </Link>
            <Link
              to="/public-builds"
              className="block text-gray-700 hover:text-primary font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Публичные сборки
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-primary font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Профиль
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-red-600 font-medium"
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="block btn-primary text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Войти
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}