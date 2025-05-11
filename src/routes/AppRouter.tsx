import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Login from '../features/auth/Login';
import Dashboard from '../pages/Dashboard';
import PrivateRoute from './PrivateRoute';
import AppDetailPage from "../pages/AppDetailPage.tsx";
// import AppDetailPage from "../pages/AppDetailPage.tsx";
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

                {/* 2. ADD THIS ROUTE for the App Detail Page */}
                <Route
                    path="/app/:id" // Matches URLs like /app/123, /app/abc-def
                    // The ':id' part is a URL parameter
                    element={
                        <PrivateRoute> {/* Assuming app details also need to be private */}
                            <AppDetailPage/>
                        </PrivateRoute>
                    }
                />

                {/* This catch-all route should generally be last */}
                <Route path="*" element={<Navigate to="/login" replace/>}/>
            </Routes>
        </BrowserRouter>
    );
}