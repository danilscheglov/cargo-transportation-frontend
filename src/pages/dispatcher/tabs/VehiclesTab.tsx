import { useEffect, useState } from 'react';
import type { Car } from '../../../types/car.types.ts';
import { carService } from '../../../services/car.service.ts';
import { getConditionColor } from '../../mechanic/AddVehicle.tsx';

const VehiclesTab = () => {
  const [vehicles, setVehicles] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await carService.getAllCars();
        setVehicles(data);
      } catch (err) {
        setError('Ошибка при загрузке автомобилей');
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  if (loading) return <p>Загрузка автомобилей...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <>
      <h4>Автомобили</h4>
      <table className="table table-hover">
        <thead>
        <tr>
          <th>Номер</th>
          <th>Модель</th>
          <th>Марка</th>
          <th>Пробег</th>
          <th>Состояние</th>
          <th>Последнее ТО</th>
        </tr>
        </thead>
        <tbody>
        {vehicles.map(vehicle => (
          <tr key={vehicle.id}>
            <td>{vehicle.number}</td>
            <td>{vehicle.model}</td>
            <td>{vehicle.brand}</td>
            <td>{vehicle.mileage} км</td>
            <td>
              <span className={`badge bg-${getConditionColor(vehicle.condition)}`}>
                {conditionTranslations[vehicle.condition]}
              </span>
            </td>
            <td>{vehicle.lastMaintenanceDate ? new Date(vehicle.lastMaintenanceDate).toLocaleDateString() : '—'}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </>
  );
};

const conditionTranslations = {
  OPERATIONAL: 'Исправно',
  IN_SERVICE: 'На обслуживании',
  UNDER_REPAIR: 'На ремонте',
};

export default VehiclesTab;
