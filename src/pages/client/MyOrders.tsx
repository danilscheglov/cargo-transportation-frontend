import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { orderService } from '../../services/order.service.ts';
import type { Order } from '../../types/order.types.ts';

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите отменить заказ?')) return;
    try {
      await orderService.updateOrderStatus(id, 'Отменён');
      await fetchOrders(); // обновляем список после отмены
    } catch (err) {
      alert('Ошибка при отмене заказа');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
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
                {/*<th>№</th>*/}
                <th>Откуда</th>
                <th>Куда</th>
                <th>Тип груза</th>
                <th>Вес (кг)</th>
                <th>Объем (м³)</th>
                <th>Дата создания</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  {/*<td>{order.id}</td>*/}
                  <td>{order.startpoint}</td>
                  <td>{order.endpoint}</td>
                  <td>{order.cargo.type}</td>
                  <td>{order.cargo.weight}</td>
                  <td>{order.cargo.volume}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge bg-${getBadgeColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {(order.status === 'Новый' || order.status === 'Назначен') && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleCancel(order.id)}
                      >
                        Отменить
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const getBadgeColor = (status: string): string => {
  switch (status) {
    case 'Новый':
      return 'primary';
    case 'Назначен':
      return 'info';
    case 'В процессе':
      return 'warning';
    case 'Доставлен':
      return 'success';
    case 'Отменён':
      return 'danger';
    default:
      return 'secondary';
  }
};

export default MyOrders;
