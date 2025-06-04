import { useEffect, useState } from 'react';

import { tripService } from '../../services/tripService.ts';
import type { Order } from '../../types/order.types.ts';
import { orderService } from '../../services/order.service.ts';

const AssignedTrips = () => {
  const [trips, setTrips] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const data = await tripService.getAssignedTrips();
      setTrips(data);
    } catch (err) {
      setError('Ошибка при загрузке заказов.');
    }
  };

  const handleCompleteTrip = async (tripId: number) => {
    try {
      await orderService.updateOrderStatus(tripId, "Доставлен"); // Отправка запроса на завершение
      setSuccessMessage(`Заказ ${tripId} успешно завершён.`);
      fetchTrips(); // Обновить список
    } catch (err) {
      setError(`Не удалось завершить заказ ${tripId}.`);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Назначенные заказы</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {trips.length > 0 ? (
        <table className="table table-hover">
          <thead>
            <tr>
              {/*<th>ID</th>*/}
              <th>Машина</th>
              <th>ФИО Клиента</th>
              <th>Номер клиента</th>
              <th>Маршрут</th>
              <th>Груз</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {trips
              .filter(trip => trip.status !== 'Отменён')
              .map((trip) => (
                <tr key={trip.id}>
                  {/*<td>{trip.id}</td>*/}
                  <td>{trip.car.brand} {trip.car.model} {trip.car.number}</td>
                  <td>{trip.client.surname} {trip.client.name} {trip.client.patronymic}</td>
                  <td>{trip.client.phone}</td>
                  <td>{trip.startpoint} → {trip.endpoint}</td>
                  <td>
                    {trip.cargo?.type
                      ? `${trip.cargo.type} (${trip.cargo.weight} кг / ${trip.cargo.volume} м³)`
                      : '—'}
                  </td>
                  <td>{trip.createdAt}</td>
                  <td>{trip.status}</td>
                  <td>
                    {trip.status !== 'Доставлен' ? (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleCompleteTrip(trip.id)}
                      >
                        Завершить заказ
                      </button>
                    ) : (
                      <span className="text-muted">Завершён</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>Нет назначенных заказов.</p>
      )}
    </div>
  );
};

export default AssignedTrips;
