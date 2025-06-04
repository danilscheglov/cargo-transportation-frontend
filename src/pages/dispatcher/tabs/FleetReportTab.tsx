import { useEffect, useState } from 'react';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { carService } from '../../../services/car.service.ts';
import type { Car } from '../../../types/car.types.ts';
import { registerFonts } from '../../../fonts/DejaVuSans.ts';
import { useAuth } from '../../../contexts/AuthContext.tsx';

const FleetReportTab = () => {
  const [vehicles, setVehicles] = useState<Car[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    carService.getAllCars().then(setVehicles);
  }, []);

  const generateFleetPDF = () => {
    registerFonts();
    const doc = new jsPDF();
    doc.setFont('DejaVuSans');

    doc.text('Отчёт по автопарку', 14, 15);

    const pageWidth = doc.internal.pageSize.getWidth();
    const authorText = `Автор: ${user?.surname ?? ''} ${user?.name ?? ''} ${user?.patronymic ?? ''}`;
    const textWidth = doc.getTextWidth(authorText);
    doc.text(authorText, pageWidth - textWidth - 14, 15);

    const dateRangeText = `Дата отчета: ${new Date().toLocaleDateString()}`;

    doc.text(dateRangeText, 14, 22);

    autoTable(doc, {
      startY: 26,
      styles: {
        font: 'DejaVuSans',
        fontStyle: 'normal',
      },
      head: [['Номер', 'Марка', 'Модель', 'Пробег', 'Дата последнего обслуживания', 'Состояние']],
      body: vehicles.map((v) => [
        v.number,
        v.brand,
        v.model,
        `${v.mileage} км`,
        v.lastMaintenanceDate ? new Date(v.lastMaintenanceDate).toLocaleDateString() : '—',
        conditionTranslations[v.condition],
      ]),
    });

    doc.save('fleet-report.pdf');
  };

  return (
    <>
      <h4>Отчёт по автопарку</h4>
      <div className="d-flex justify-content-end mb-2">
        <button onClick={generateFleetPDF} className="btn btn-outline-primary">
          Скачать PDF
        </button>
      </div>
      <table className="table table-hover">
        <thead>
        <tr>
          <th>Номер</th>
          <th>Модель</th>
          <th>Пробег</th>
          <th>Дата последнего обслуживания</th>
          <th>Состояние</th>
        </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id}>
              <td>{v.number}</td>
              <td>
                {v.brand} {v.model}
              </td>
              <td>{v.mileage} км</td>
              <td>
                {v.lastMaintenanceDate ? new Date(v.lastMaintenanceDate).toLocaleDateString() : '—'}
              </td>
              <td>{conditionTranslations[v.condition]}</td>
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


export default FleetReportTab;
