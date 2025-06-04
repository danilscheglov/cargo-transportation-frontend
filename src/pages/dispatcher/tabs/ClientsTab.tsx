import { useEffect, useState } from 'react';
import type { User } from '../../../types/auth.types.ts';
import { clientService } from '../../../services/clientService.ts';

const ClientsTab = () => {
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await clientService.getAllClients();
        setClients(data);
      } catch (err) {
        setError('Ошибка при загрузке клиентов');
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  if (loading) return <p>Загрузка клиентов...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <>
      <h4>Клиенты</h4>
      <table className="table table-hover">
        <thead>
        <tr>
          <th>ФИО</th>
          <th>Email</th>
          <th>Телефон</th>
        </tr>
        </thead>
        <tbody>
        {clients.map(client => (
          <tr key={client.id}>
            <td>{client.surname} {client.name} {client.patronymic}</td>
            <td>{client.email}</td>
            <td>{client.phone}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </>
  );
};

export default ClientsTab;
