import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { orderService } from '../services/order.service';
import type { CreateOrderRequest } from '../types/order.types';

const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateOrderRequest>({
    fromAddress: '',
    toAddress: '',
    cargoType: '',
    weight: 0,
    volume: 0,
    departureDate: '',
    deliveryDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'weight' || name === 'volume' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await orderService.createOrder(formData);
      navigate('/my-orders');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при создании заказа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Создание заказа</h2>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="fromAddress"
                      name="fromAddress"
                      placeholder="Адрес отправления"
                      value={formData.fromAddress}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="fromAddress">Адрес отправления</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="toAddress"
                      name="toAddress"
                      placeholder="Адрес доставки"
                      value={formData.toAddress}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="toAddress">Адрес доставки</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="cargoType"
                      name="cargoType"
                      placeholder="Тип груза"
                      value={formData.cargoType}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="cargoType">Тип груза</label>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="number"
                          className="form-control"
                          id="weight"
                          name="weight"
                          placeholder="Вес"
                          value={formData.weight || ''}
                          onChange={handleChange}
                          min="0"
                          step="0.1"
                          required
                        />
                        <label htmlFor="weight">Вес (кг)</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="number"
                          className="form-control"
                          id="volume"
                          name="volume"
                          placeholder="Объем"
                          value={formData.volume || ''}
                          onChange={handleChange}
                          min="0"
                          step="0.1"
                          required
                        />
                        <label htmlFor="volume">Объем (м³)</label>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="date"
                          className="form-control"
                          id="departureDate"
                          name="departureDate"
                          value={formData.departureDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                        <label htmlFor="departureDate">Дата отправки</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="date"
                          className="form-control"
                          id="deliveryDate"
                          name="deliveryDate"
                          value={formData.deliveryDate}
                          onChange={handleChange}
                          min={formData.departureDate || new Date().toISOString().split('T')[0]}
                          required
                        />
                        <label htmlFor="deliveryDate">Дата доставки</label>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Создание...
                      </>
                    ) : (
                      'Создать заказ'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
