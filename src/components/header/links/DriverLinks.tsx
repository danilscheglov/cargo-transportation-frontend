import { Link } from 'react-router-dom';

const DriverLinks = () => (
  <>
    <li className="nav-item">
      <Link className="nav-link text-white" to="/assigned-orders">
        <i className="bi bi-list-check me-1"></i>
        Назначенные заказы
      </Link>
    </li>
  </>
);

export default DriverLinks;
