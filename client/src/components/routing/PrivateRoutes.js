import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoutes = () => {
  const AuthData = useSelector((state) => state.Auth);
  const { isAuthenticated, loading } = AuthData;
  return (
    <>{isAuthenticated && !loading ? <Outlet /> : <Navigate to={'/login'} />}</>
  );
};
