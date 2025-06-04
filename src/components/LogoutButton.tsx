type Props = {
  onLogout: () => void;
};

const LogoutButton = ({ onLogout }: Props) => (
  <li className="nav-item">
  <button
    className="nav-link text-white"
onClick={onLogout}
style={{ background: 'none', border: 'none', cursor: 'pointer' }}
>
<i className="bi bi-box-arrow-right me-1"></i>
Выйти
</button>
</li>
);

export default LogoutButton;
