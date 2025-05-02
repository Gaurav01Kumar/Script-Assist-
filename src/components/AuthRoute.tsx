
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/app.store';

const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" replace />;
};

export default AuthRoute;
