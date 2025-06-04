import { useEffect, useState } from 'react';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { useAuth } from '../../../contexts/AuthContext.tsx';
import { registerFonts } from '../../../fonts/DejaVuSans.ts';
import { orderService } from '../../../services/order.service.ts';
import type { Order } from '../../../types/order.types.ts';

const OrdersReportTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    orderService.getAllOrders().then(setOrders);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = orders.filter((order) => {
        const created = new Date(order.createdAt).getTime();
        return created >= new Date(startDate).getTime() && created <= new Date(endDate).getTime();
      });
      setFiltered(filtered);
    } else {
      setFiltered(orders);
    }
  }, [startDate, endDate, orders]);

  const generatePDF = () => {
    registerFonts();
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFont('DejaVuSans');

    doc.text('Отчёт по заказам', 14, 15);

    const pageWidth = doc.internal.pageSize.getWidth();
    const authorText = `Автор: ${user?.surname ?? ''} ${user?.name ?? ''} ${user?.patronymic ?? ''}`;
    const textWidth = doc.getTextWidth(authorText);
    doc.text(authorText, pageWidth - textWidth - 14, 15);

    const dateRangeText =
      startDate && endDate
        ? `Период: с ${new Date(startDate).toLocaleDateString()} по ${new Date(endDate).toLocaleDateString()}`
        : 'Период: не указан (все доставленные заказы)';

    doc.text(dateRangeText, 14, 22);

    autoTable(doc, {
      startY: 30,
      styles: {
        font: 'DejaVuSans',
        fontStyle: 'normal',
      },
      head: [['Дата', 'Клиент', 'Маршрут', 'Тип груза', 'ТС', 'Водитель', 'Статус']],
      body: filtered
        .filter((order) => order.status === 'Доставлен')
        .map((order) => [
          new Date(order.createdAt).toLocaleDateString(),
          `${order.client.surname} ${order.client.name} ${order.client.patronymic}`,
          `${order.startpoint} → ${order.endpoint}`,
          order.cargo?.type
            ? `${order.cargo.type} (${order.cargo.weight} кг / ${order.cargo.volume} м³)`
            : '—',
          `${order.car.brand} ${order.car.model} (${order.car.number})`,
          `${order.car.driver?.surname ?? ''} ${order.car.driver?.name ?? ''} ${order.car.driver?.patronymic ?? ''}`,
          order.status,
        ]),
    });

    doc.save('orders-report.pdf');
  };

  return (
    <>
      <h4>Отчёт по заказам</h4>
      <div className="row mb-3">
        <div className="col">
          <label className="form-label">С даты</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col">
          <label className="form-label">По дату</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-end mb-2 col">
          <button onClick={generatePDF} className="btn btn-outline-primary">
            Скачать PDF
          </button>
        </div>
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Клиент</th>
            <th>Маршрут</th>
            <th>Тип груза</th>
            <th>ТС</th>
            <th>Водитель</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((order) => (
            <tr key={order.id}>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                {order.client.surname} {order.client.name} {order.client.patronymic}
              </td>
              <td>
                {order.startpoint} → {order.endpoint}
              </td>
              <td>
                {order.cargo?.type
                  ? `${order.cargo.type} (${order.cargo.weight} кг / ${order.cargo.volume} м³)`
                  : '—'}
              </td>
              <td>
                {order.car.brand} {order.car.model} ({order.car.number})
              </td>
              <td>
                {order.car.driver?.surname} {order.car.driver?.name} {order.car.driver?.patronymic}
              </td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default OrdersReportTab;
