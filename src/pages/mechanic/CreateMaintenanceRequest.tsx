import React, { useEffect, useState } from 'react';
import { maintenanceRequestService } from '../../services/maintenanceRequestService.ts';
import type { MaintenanceRequest } from '../../types/maintenance.types.ts';
import { carService } from '../../services/car.service.ts';
import { mechanicService } from '../../services/mechanicService.ts';
import type { Car } from '../../types/car.types.ts';
import type { User } from '../../types/auth.types.ts';

const CreateMaintenanceRequest = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    carId: '',
    userId: '',
    fillingDate: '',
    serviceType: '',
    status: '',
    note: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await maintenanceRequestService.getAllRequests();
      setRequests(data);
    } catch (err) {
      setError('Ошибка при загрузке заявок.');
    }
  };

  const [cars, setCars] = useState<Car[]>([]);
  const [mechanics, setMechanics] = useState<User[]>([]);

  useEffect(() => {
    fetchRequests();
    fetchCars();
    fetchMechanics();
  }, []);

  const fetchCars = async () => {
    try {
      const data = await carService.getAllCars();
      setCars(data);
    } catch (err) {
      setError('Ошибка при загрузке машин.');
    }
  };

  const fetchMechanics = async () => {
    try {
      const data = await mechanicService.getAllClients();
      setMechanics(data);
    } catch (err) {
      setError('Ошибка при загрузке механиков.');
    }
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await maintenanceRequestService.createRequest({
        car: { id: Number(formData.carId) },
        mechanic: { id: Number(formData.userId) },
        fillingDate: formData.fillingDate,
        serviceType: formData.serviceType,
        status: formData.status,
        note: formData.note || '',
      });
      setSuccess(true);
      setFormData({
        carId: '',
        userId: '',
        fillingDate: '',
        serviceType: '',
        status: '',
        note: '',
      });
      setShowForm(false);
      fetchRequests(); // Обновить список
    } catch (err) {
      setError('Не удалось создать заявку.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (
    id: number,
    field: 'serviceType' | 'status',
    value: string
  ) => {
    try {
      // Найти существующую заявку из состояния
      const currentRequest = requests.find((req) => req.id === id);
      if (!currentRequest) return;

      // Сформировать DTO в полном виде, как требует бэкенд
      const fullUpdateDto = {
        car: { id: currentRequest.car.id },
        mechanic: { id: currentRequest.mechanic.id },
        fillingDate: currentRequest.fillingDate,
        serviceType: field === 'serviceType' ? value : currentRequest.serviceType,
        status: field === 'status' ? value : currentRequest.status,
        note: currentRequest.note || '',
      };

      await maintenanceRequestService.updateRequest(id, fullUpdateDto);

      // Обновить локальное состояние
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, [field]: value } : req
        )
      );
    } catch (err) {
      setError('Ошибка при обновлении данных.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Заявки на ТО</h1>
        <button className="btn btn-primary mb-3" onClick={() => setShowForm(true)}>
          <i className="bi bi-plus-lg me-2"></i>
          Добавить заявку
        </button>
      </div>


      {requests.length > 0 ? (
        <table className="table table-hover">
          <thead>
          <tr>
            <th>Машина</th>
            <th>Механик</th>
            <th>Дата</th>
            <th>Тип</th>
            <th>Статус</th>
            <th>Примечание</th>
          </tr>
          </thead>
          <tbody>
          {[...requests]
            .sort((a, b) => a.id - b.id)
            .map((req) => (
            <tr key={req.id}>
              <td>{req.car.brand} {req.car.model} {req.car.number}</td>
              <td>{req.mechanic.name} {req.mechanic.surname}</td>
              <td>{req.fillingDate}</td>
              <td>
                <select
                  className="form-select form-select-sm"
                  value={req.serviceType}
                  onChange={(e) => handleUpdate(req.id, 'serviceType', e.target.value)}
                >
                  <option value="Ремонт">Ремонт</option>
                  <option value="Техническое обслуживание">Техническое обслуживание</option>
                </select>
              </td>

              <td>
                <select
                  className="form-select form-select-sm"
                  value={req.status}
                  onChange={(e) => handleUpdate(req.id, 'status', e.target.value)}
                >
                  <option value="В ожидании">В ожидании</option>
                  <option value="В процессе">В процессе</option>
                  <option value="Завершена">Завершена</option>
                </select>
              </td>
              <td>{req.note}</td>
            </tr>
          ))}
          </tbody>
        </table>
      ) : (
        <p>Нет заявок на обслуживание.</p>
      )}

      {showForm && (
        <div className="modal d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Создание заявки</h5>
                  <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Автомобиль</label>
                    <select
                      name="carId"
                      className="form-select"
                      value={formData.carId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Выберите автомобиль --</option>
                      {cars.map((car) => (
                        <option key={car.id} value={car.id}>
                          {car.brand} {car.model}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Механик</label>
                    <select
                      name="userId"
                      className="form-select"
                      value={formData.userId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Выберите механика --</option>
                      {mechanics.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} {user.surname}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Дата</label>
                    <input type="date" name="fillingDate" className="form-control" value={formData.fillingDate}
                           onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Тип обслуживания</label>
                    <select
                      name="serviceType"
                      className="form-select"
                      value={formData.serviceType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Выберите тип обслуживания --</option>
                      <option value="Ремонт">Ремонт</option>
                      <option value="Техническое обслуживание">Техническое обслуживание</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Статус</label>
                    <select
                      name="status"
                      className="form-select"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Выберите статус --</option>
                      <option value="В ожидании">В ожидании</option>
                      <option value="В процессе">В процессе</option>
                      <option value="Завершена">Завершена</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Примечание</label>
                    <textarea name="note" className="form-control" value={formData.note} onChange={handleChange}
                              maxLength={1000}></textarea>
                  </div>
                  {error && <div className="alert alert-danger">{error}</div>}
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Сохранение...' : 'Создать'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {success && <div className="alert alert-success mt-3">Заявка успешно создана!</div>}
    </div>
  );
};

export default CreateMaintenanceRequest;
