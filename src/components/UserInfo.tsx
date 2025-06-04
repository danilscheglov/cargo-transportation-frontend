import roleTranslations from './roleTranslations';

type User = {
  name?: string;
  surname?: string;
  role?: string;
};

type Props = {
  user: User | null;
};

const UserInfo = ({ user }: Props) => {
  if (!user) return null;

  return (
    <li className="nav-item">
      <span className="nav-link text-white">
        <i className="bi bi-person me-1"></i>
        {user.name} {user.surname}
        {user.role && (
          <span className="badge bg-light text-primary ms-2">
            {roleTranslations[user.role as keyof typeof roleTranslations] || user.role}
          </span>
        )}
      </span>
    </li>
  );
};

export default UserInfo;
