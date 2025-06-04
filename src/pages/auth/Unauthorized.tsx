import 'bootstrap-icons/font/bootstrap-icons.css';

const Unauthorized = () => (
  <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div className="text-center p-4 bg-white shadow rounded">
      <i className="bi bi-shield-lock-fill display-1 text-primary mb-4"></i>
      <h1 className="h3 mb-3">Доступ запрещён</h1>
      <p className="lead mb-0">У вас нет прав для просмотра этой страницы.</p>
    </div>
  </div>
);

export default Unauthorized;
