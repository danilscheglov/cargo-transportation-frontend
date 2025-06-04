import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { orderService } from '../../services/order.service.ts';
import type { CreateOrderRequest } from '../../types/order.types.ts';

const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateOrderRequest>({
    startpoint: '',
    endpoint: '',
    status: "Новый",
    dispatchDate: '',
    deliveryDate: '',
    email: localStorage.getItem("email") ?? '',
    cargo: {
      weight: 0,
      volume: 0,
      type: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (['type', 'weight', 'volume'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        cargo: {
          ...prev.cargo,
          [name]: name === 'weight' || name === 'volume' ? parseFloat(value) || 0 : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
                      id="startpoint"
                      name="startpoint"
                      placeholder="Адрес отправления"
                      value={formData.startpoint}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="fromAddress">Адрес отправления</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="endpoint"
                      name="endpoint"
                      placeholder="Адрес доставки"
                      value={formData.endpoint}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="toAddress">Адрес доставки</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="type"
                      name="type"
                      placeholder="Тип груза"
                      value={formData.cargo.type}
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
                          value={formData.cargo.weight || ''}
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
                          value={formData.cargo.volume || ''}
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
