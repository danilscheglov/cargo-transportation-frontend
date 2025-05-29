import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { orderService } from '../services/order.service';
import type { Order } from '../types/order.types';

const statusTranslations = {
  NEW: 'Новый',
  IN_PROGRESS: 'В обработке',
  COMPLETED: 'Доставлен',
};

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getClientOrders();
        setOrders(data);
      } catch (err) {
        setError('Не удалось загрузить заказы');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Мои заказы</h1>
        <Link to="/create-order" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>
          Создать заказ
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center">
          <p>У вас пока нет заказов</p>
          <Link to="/create-order" className="btn btn-primary">
            Создать первый заказ
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>№</th>
                <th>Статус</th>
                <th>Откуда</th>
                <th>Куда</th>
                <th>Тип груза</th>
                <th>Вес (кг)</th>
                <th>Объем (м³)</th>
                <th>Дата отправки</th>
                <th>Дата доставки</th>
                <th>Дата создания</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <span className={`badge bg-${getBadgeColor(order.status)}`}>
                      {statusTranslations[order.status]}
                    </span>
                  </td>
                  <td>{order.fromAddress}</td>
                  <td>{order.toAddress}</td>
                  <td>{order.cargoType}</td>
                  <td>{order.weight}</td>
                  <td>{order.volume}</td>
                  <td>{new Date(order.departureDate).toLocaleDateString()}</td>
                  <td>{new Date(order.deliveryDate).toLocaleDateString()}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const getBadgeColor = (status: Order['status']): string => {
  switch (status) {
    case 'NEW':
      return 'primary';
    case 'IN_PROGRESS':
      return 'warning';
    case 'COMPLETED':
      return 'success';
    default:
      return 'secondary';
  }
};

export default MyOrders;
