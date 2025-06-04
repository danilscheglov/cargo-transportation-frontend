import { useState } from 'react';
import OrdersReportTab from './tabs/OrdersReportTab';
import FleetReportTab from './tabs/FleetReportTab';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'fleet'>('orders');

  return (
    <div className="container mt-4">
      <h2>Отчёты</h2>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Заказы
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'fleet' ? 'active' : ''}`}
            onClick={() => setActiveTab('fleet')}
          >
            Автопарк
          </button>
        </li>
      </ul>

      <div className="mt-3">
        {activeTab === 'orders' ? <OrdersReportTab /> : <FleetReportTab />}
      </div>
    </div>
  );
};

export default ReportsPage;
