import { useState } from 'react';
import ClientsTab from './tabs/ClientsTab';
import VehiclesTab from './tabs/VehiclesTab';

const ReferencesPage = () => {
  const [activeTab, setActiveTab] = useState<'clients' | 'vehicles'>('clients');

  return (
    <div className="container mt-4">
      <h2>Справочники</h2>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            Клиенты
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'vehicles' ? 'active' : ''}`}
            onClick={() => setActiveTab('vehicles')}
          >
            Автомобили
          </button>
        </li>
      </ul>

      <div className="mt-3">
        {activeTab === 'clients' ? <ClientsTab /> : <VehiclesTab />}
      </div>
    </div>
  );
};

export default ReferencesPage;
