import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/auth/Login';
import Dashboard from '../pages/Dashboard';
import PrivateRoute from './PrivateRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
