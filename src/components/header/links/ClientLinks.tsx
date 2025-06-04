import { Link } from 'react-router-dom';

const ClientLinks = () => (
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
);

export default ClientLinks;
