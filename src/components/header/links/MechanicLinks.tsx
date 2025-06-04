import { Link } from 'react-router-dom';

const MechanicLinks = () => (
  <>
    <li className="nav-item">
      <Link className="nav-link text-white" to="/create-maintenance-request">
        <i className="bi bi-wrench-adjustable-circle me-1"></i>
        Создать заявку ТО
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link text-white" to="/add-vehicle">
        <i className="bi bi-truck-front me-1"></i>
        Добавить автомобиль
      </Link>
    </li>
  </>
);

export default MechanicLinks;
