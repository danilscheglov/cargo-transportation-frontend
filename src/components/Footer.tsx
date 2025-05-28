const Footer = () => {
  return (
    <footer className="py-2 mt-auto" style={{ backgroundColor: '#1a237e' }}>
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-md-4 mb-2">
            <h6 className="text-white mb-2">Контакты</h6>
            <p className="text-white-50 mb-1 small">
              <i className="bi bi-envelope me-2"></i>
              info@cargo.com
            </p>
            <p className="text-white-50 mb-1 small">
              <i className="bi bi-telephone me-2"></i>
              +7 (999) 999-99-99
            </p>
          </div>
          <div className="col-md-4 mb-2">
            <h6 className="text-white mb-2">Адрес</h6>
            <p className="text-white-50 small">г. Липецк, ул. Московская, д. 30</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
