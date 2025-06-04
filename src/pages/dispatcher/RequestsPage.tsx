import { useEffect, useState } from 'react';

import { carService } from '../../services/car.service.ts';
import { driverService } from '../../services/driverService.ts';
import { orderService } from '../../services/order.service.ts';
import type { User } from '../../types/auth.types.ts';
import type { Car } from '../../types/car.types.ts';
import type { Order } from '../../types/order.types.ts';

const RequestsPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, driversData, vehiclesData] = await Promise.all([
          orderService.getAllOrders(),
          driverService.getAllDrivers(),
          carService.getAllCars(),
        ]);
        setOrders(ordersData);
        setDrivers(driversData);
        setVehicles(vehiclesData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await orderService.updateOrderStatus(id, status);
      setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)));
    } catch (err) {
      alert('Ошибка при обновлении статуса');
    }
  };

  const handleDriverAssign = async (orderId: number, driverId: number) => {
    try {
      await orderService.updateOrderDriver(orderId, driverId);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId && order.car
            ? { ...order, car: { ...order.car, driverId } }
            : order
        )
      );
    } catch {
      alert('Не удалось назначить водителя');
    }
  };

  const handleVehicleAssign = async (orderId: number, carId: number) => {
    try {
      await orderService.updateOrderVehicle(orderId, carId);
      const assignedCar = vehicles.find((car) => car.id === carId);
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, car: assignedCar }
            : order
        )
      );
    } catch {
      alert('Не удалось назначить автомобиль');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Заявки</h2>
      {loading ? (
        <p>Загрузка...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>Клиент (email)</th>
              {/*<th>Клиент (ФИО)</th>*/}
              <th>Маршрут</th>
              <th>Груз</th>
              <th>Автомобиль</th>
              <th>Водитель</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.email}</td>
                {/*<td></td>*/}
                <td>
                  {order.startpoint} → {order.endpoint}
                </td>
                <td>
                  {order.cargo?.type
                    ? `${order.cargo.type} (${order.cargo.weight} кг / ${order.cargo.volume} м³)`
                    : '—'}
                </td>

                {/* Автомобиль */}
                <td>
                  <select
                    value={order.car?.id || ''}
                    onChange={(e) => handleVehicleAssign(order.id, Number(e.target.value))}
                    className="form-select"
                  >
                    <option value="">—</option>
                    {vehicles.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.number} ({car.model})
                      </option>
                    ))}
                  </select>
                </td>

                {/* Водитель */}
                <td>
                  <select
                    value={order.car?.driverId || ''}
                    onChange={(e) => handleDriverAssign(order.id, Number(e.target.value))}
                    className="form-select"
                  >
                    <option value="">—</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} {driver.surname}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Статус */}
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="form-select"
                  >
                    {['Новый', 'Назначен', 'В процессе', 'Доставлен', 'Отменён'].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RequestsPage;
