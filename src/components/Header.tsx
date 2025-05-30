import { Link } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

type UserRole = 'CLIENT' | 'MECHANIC' | 'DISPATCHER' | 'DRIVER';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();

  const roleTranslations: Record<UserRole, string> = {
    CLIENT: 'Клиент',
    MECHANIC: 'Механик',
    DISPATCHER: 'Диспетчер',
    DRIVER: 'Водитель',
  };

  return (
    <header className="navbar navbar-expand-lg" style={{ backgroundColor: '#1a237e' }}>
      <div className="container">
        <Link className="navbar-brand text-white" to="/">
          <i className="bi bi-truck me-2"></i>
          Транспортная компания
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{ borderColor: 'white' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Войти
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/register">
                    <i className="bi bi-person-plus me-1"></i>
                    Регистрация
                  </Link>
                </li>
              </>
            ) : (
              <>
                {user?.role === 'CLIENT' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link text-white" to="/my-orders">
                        <i className="bi bi-list-ul me-1"></i>
                        Мои заказы
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link text-white" to="/create-order">
                        <i className="bi bi-plus-lg me-1"></i>
                        Создать заказ
                      </Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <span className="nav-link text-white">
                    <i className="bi bi-person me-1"></i>
                    {user?.name} {user?.surname}
                    {user?.role && (
                      <span className="badge bg-light text-primary ms-2">
                        {roleTranslations[user.role as UserRole] || user.role}
                      </span>
                    )}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link text-white"
                    onClick={logout}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Выйти
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
