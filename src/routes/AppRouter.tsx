import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Login from '../features/auth/Login';
import Dashboard from '../pages/Dashboard';
import PrivateRoute from './PrivateRoute';
import AppDetailPage from "../pages/AppDetailPage.tsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Dashboard/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/app/:id" // The :id part is a URL parameter
                    element={
                        <PrivateRoute>
                            <AppDetailPage/>
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/login" replace/>}/>

            </Routes>
        </BrowserRouter>
    );
}
