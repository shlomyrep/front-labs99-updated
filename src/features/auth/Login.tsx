import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from './authSlice';
import { useNavigate } from 'react-router-dom';
import Axios from '../../api/axios.ts';
import type {AppDispatch} from '../../app/store';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await Axios.post('/auth/login', {
                email,
                password,
                rememberMe: false,
            });

            if (res.data.twoFactorRequired) {
                alert('2FA not supported in this version');
            } else {
                dispatch(setToken(res.data.accessToken));
                localStorage.setItem('accessToken', res.data.accessToken);
                navigate('/');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <form onSubmit={handleLogin} className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
            <h2 className="text-xl font-bold mb-4">Login</h2>
            {error && <p className="text-red-600">{error}</p>}
            <input
                type="email"
                className="w-full border p-2 mb-4 rounded"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                className="w-full border p-2 mb-4 rounded"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                Login
            </button>
        </form>
    );
}
