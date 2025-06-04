import { Link } from 'react-router-dom';
import GuestLinks from './header/links/GuestLinks.tsx';
import ClientLinks from './header/links/ClientLinks.tsx';
import UserInfo from './UserInfo';
import LogoutButton from './LogoutButton';
import { useAuth } from '../contexts/AuthContext.tsx';
import MechanicLinks from './header/links/MechanicLinks.tsx';
import DriverLinks from './header/links/DriverLinks.tsx';
import DispatcherLinks from './header/links/DispatcherLinks.tsx';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();

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
            {!isAuthenticated && <GuestLinks />}
            {isAuthenticated && (
              <>
                {user?.role === 'CLIENT' && <ClientLinks />}
                {user?.role === 'MECHANIC' && <MechanicLinks />}
                {user?.role === 'DRIVER' && <DriverLinks />}
                {user?.role === 'DISPATCHER' && <DispatcherLinks />}
                <UserInfo user={user} />
                <LogoutButton onLogout={logout} />
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
