import { Link } from 'react-router-dom';

const DispatcherLinks = () => (
  <>
    <li className="nav-item">
      <Link className="nav-link text-white" to="/requests">
        <i className="bi bi-list-task me-1"></i>
        Заявки
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link text-white" to="/reports">
        <i className="bi bi-bar-chart me-1"></i>
        Отчёты
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link text-white" to="/references">
        <i className="bi bi-journal-text me-1"></i>
        Справочники
      </Link>
    </li>
  </>
);

export default DispatcherLinks;
