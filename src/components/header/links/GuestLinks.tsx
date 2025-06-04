import { Link } from 'react-router-dom';

const GuestLinks = () => (
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
);

export default GuestLinks;
