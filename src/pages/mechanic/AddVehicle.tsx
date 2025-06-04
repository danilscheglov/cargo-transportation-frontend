import React, { useEffect, useState } from 'react';

import { Modal } from 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

import type { CreateCarDto } from '../../services/car.service.ts';
import { carService } from '../../services/car.service.ts';
import type { Car } from '../../types/car.types.ts';

const conditionTranslations = {
  OPERATIONAL: 'Исправно',
  IN_SERVICE: 'На обслуживании',
  UNDER_REPAIR: 'На ремонте',
};

export const getConditionColor = (condition: Car['condition']) => {
  switch (condition) {
    case 'OPERATIONAL':
      return 'success';
    case 'IN_SERVICE':
      return 'warning';
    case 'UNDER_REPAIR':
      return 'danger';
    default:
      return 'secondary';
  }
};
const AddVehicle: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateCarDto>({
    brand: '',
    model: '',
    number: '',
    capacity: 0,
    mileage: 0,
    condition: 'OPERATIONAL',
    lastMaintenanceDate: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Функция преобразования латинских букв в русские
    const latinToCyrillic = (input: string): string => {
      const map: Record<string, string> = {
        A: 'А',
        B: 'В',
        E: 'Е',
        K: 'К',
        M: 'М',
        H: 'Н',
        O: 'О',
        P: 'Р',
        C: 'С',
        T: 'Т',
        Y: 'У',
        X: 'Х',
      };

      return input
        .split('')
        .map((char) => {
          const upperChar = char.toUpperCase();
          return map[upperChar] ?? char;
        })
        .join('');
    };

    let newValue: string | number = value;

    // Спецобработка для поля number (гос. номер машины)
    if (name === 'number') {
      newValue = latinToCyrillic(value);
    } else if (type === 'number') {
      newValue = value === '' ? '' : Number(value);
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newCar = await carService.createCar({
        ...form,
        capacity: Number(form.capacity),
        mileage: Number(form.mileage),
      });

      setCars((prev) => [...prev, newCar]);

      // Очистить форму
      setForm({
        brand: '',
        model: '',
        number: '',
        capacity: 0,
        mileage: 0,
        condition: 'OPERATIONAL',
        lastMaintenanceDate: '',
      });

      setTimeout(() => {
        const modalEl = document.getElementById('addCarModal');
        if (modalEl) {
          const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
          modal.hide();
        }

        // 💡 Убедимся, что backdrop точно удалён (на всякий случай)
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
      }, 100); // 100ms — достаточно для стабильной работы
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await carService.getAllCars();
        setCars(data);
      } catch (err) {
        setError('Не удалось загрузить машины');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Список автомобилей</h1>
        {cars.length != 0 && (
          <button
            className="btn btn-primary mb-3"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#addCarModal"
          >
            <i className="bi bi-plus-lg me-2"></i>
            Добавить машину
          </button>
        )}
      </div>

      {/* Таблица */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : cars.length === 0 ? (
        <div className="text-center">
          <p className="text-center">Нет зарегистрированных машин</p>
          <button
            className="btn btn-primary mb-3"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#addCarModal"
          >
            <i className="bi bi-plus-lg me-2"></i>
            Добавить машину
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Марка</th>
                <th>Модель</th>
                <th>Гос. номер</th>
                <th>Грузоподъемность (кг)</th>
                <th>Пробег (км)</th>
                <th>Состояние</th>
                <th>Последнее ТО</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <td>{car.brand}</td>
                  <td>{car.model}</td>
                  <td>{car.number}</td>
                  <td>{car.capacity}</td>
                  <td>{car.mileage}</td>
                  <td>
                    <span className={`badge bg-${getConditionColor(car.condition)}`}>
                      {conditionTranslations[car.condition]}
                    </span>
                  </td>
                  <td>
                    {car.lastMaintenanceDate
                      ? new Date(car.lastMaintenanceDate).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Offcanvas форма */}
      <div
        className="modal fade"
        id="addCarModal"
        tabIndex={-1}
        aria-labelledby="addCarModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addCarModalLabel">
                Добавить автомобиль
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddCar}>
                <div className="mb-3">
                  <label className="form-label">Марка</label>
                  <input
                    type="text"
                    className="form-control"
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Модель</label>
                  <input
                    type="text"
                    className="form-control"
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Гос. номер</label>
                  <input
                    type="text"
                    className="form-control"
                    name="number"
                    value={form.number}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      const value = e.currentTarget.value.toUpperCase();
                      const position = e.currentTarget.selectionStart || 0;
                      const key = e.key.toUpperCase();

                      const allowedLetters = 'АВЕКМНОРСТУХABEKMHOPCTYX';
                      const isLetter = allowedLetters.includes(key);
                      const isDigit = /\d/.test(key);
                      const isControl = [
                        'Backspace',
                        'ArrowLeft',
                        'ArrowRight',
                        'Tab',
                        'Delete',
                      ].includes(e.key);

                      // Разрешить навигацию и удаление
                      if (isControl) return;

                      // Запрещаем ввод, если длина превышает 9 символов
                      if (value.length >= 9) {
                        e.preventDefault();
                        return;
                      }

                      // Позиционно ограничиваем:
                      if (
                        (position === 0 && !isLetter) || // 1-я буква
                        ([1, 2, 3].includes(position) && !isDigit) || // 2–4 цифры
                        ([4, 5].includes(position) && !isLetter) || // 5–6 буквы
                        ([6, 7, 8].includes(position) && !isDigit) // 7–9 регион
                      ) {
                        e.preventDefault();
                      }
                    }}
                    maxLength={9}
                    required
                    pattern="^[АВЕКМНОРСТУХABEKMHOPCTYX]{1}\d{3}(?<!000)[АВЕКМНОРСТУХABEKMHOPCTYX]{2}\d{2,3}$"
                    title="Формат: А123ВС77 или A123BC77"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Грузоподъемность (кг)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    min={1}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Пробег (км)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="mileage"
                    value={form.mileage}
                    onChange={handleChange}
                    min={0}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Состояние</label>
                  <select
                    className="form-select"
                    name="condition"
                    value={form.condition}
                    onChange={handleChange}
                  >
                    {Object.entries(conditionTranslations).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Дата последнего ТО</label>
                  <input
                    type="date"
                    className="form-control"
                    name="lastMaintenanceDate"
                    value={form.lastMaintenanceDate ?? ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Закрыть
                  </button>
                  <button type="submit" className="btn btn-success" disabled={submitting}>
                    <i className="bi bi-check-lg me-1"></i>
                    {submitting ? 'Сохранение...' : 'Сохранить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
