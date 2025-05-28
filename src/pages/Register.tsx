import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { RegisterRequest } from '../types/auth.types';

const Register: React.FC = () => {
  const { register } = useAuth();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    name: '',
    surname: '',
    patronymic: '',
    phone: '',
    role: 'CLIENT'
  });
  const [showPassword, setShowPassword] = useState(false);

  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    
    if (numbers.length <= 1) return '+7';
    if (numbers.length <= 4) return `+7 (${numbers.slice(1)}`;
    if (numbers.length <= 7) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4)}`;
    if (numbers.length <= 9) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7)}`;
    return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
  };

  const cleanPhoneNumber = (phone: string): string => {
    return '+7' + phone.replace(/\D/g, '').slice(1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      setFormData(prev => ({
        ...prev,
        [name]: formatPhoneNumber(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        phone: cleanPhoneNumber(formData.phone)
      };
      await register(dataToSend);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <div className="text-center mb-3">
                <i
                  className="bi bi-person-plus-fill text-primary"
                  style={{ fontSize: '2.5rem' }}
                ></i>
                <h2 className="mt-2 mb-3">Регистрация</h2>
              </div>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label htmlFor="surname" className="form-label">
                    <i className="bi bi-person me-2"></i>Фамилия
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    required
                    placeholder="Введите вашу фамилию"
                    minLength={2}
                    maxLength={50}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="name" className="form-label">
                    <i className="bi bi-person me-2"></i>Имя
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Введите ваше имя"
                    minLength={2}
                    maxLength={50}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="patronymic" className="form-label">
                    <i className="bi bi-person me-2"></i>Отчество
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="patronymic"
                    name="patronymic"
                    value={formData.patronymic}
                    onChange={handleChange}
                    placeholder="Введите ваше отчество"
                    maxLength={50}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="email" className="form-label">
                    <i className="bi bi-envelope me-2"></i>Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="example@email.com"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="phone" className="form-label">
                    <i className="bi bi-telephone me-2"></i>Телефон
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+7 (999) 999-99-99"
                    pattern="^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    <i className="bi bi-lock me-2"></i>Пароль
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Введите пароль"
                      minLength={6}
                      maxLength={100}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                    </button>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Регистрация...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-2"></i>
                      Зарегистрироваться
                    </>
                  )}
                </button>
                <div className="text-center">
                  <small className="text-muted">
                    Уже есть аккаунт?{' '}
                    <Link to="/login" className="text-decoration-none">
                      Войти
                    </Link>
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
