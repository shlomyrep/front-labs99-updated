import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from './authSlice';
import { useNavigate } from 'react-router-dom';
import Axios from '../../api/axios.ts';
import type { AppDispatch } from '../../app/store';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { SparklesIcon, AdjustmentsHorizontalIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import appCompanyLogo from '../../assets/logo_white.png';


const GOOGLE_CLIENT_ID = '533335327172-4p066sspjejqp0ai9rtor4gtmlg4pp61.apps.googleusercontent.com'; // Replace if needed

const AppLogo = () => ( // Line 29
  <div className="mx-auto mb-8 flex justify-center p-2 bg-gray-700 rounded-md"> {/* Example: Added padding, dark gray background, and rounded corners */}
    <img
      src={appCompanyLogo}
      alt="Labs 99 Logo"
      className="h-16 md:h-20 object-contain"
    />
  </div>
);

function LoginView() {
    const [error, setError] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleGoogleLoginSuccess = async (credentialResponse: any) => {
        setError('');
        const idToken = credentialResponse?.credential;

        if (!idToken) {
            setError('No ID token received from Google.');
            return;
        }

        try {
            const res = await Axios.post('/auth/google-signin', {
                idToken, // 👈 backend expects this
            });

            if (res.data.accessToken) {
                dispatch(setToken(res.data.accessToken));
                localStorage.setItem('accessToken', res.data.accessToken);
                navigate('/');
            } else {
                setError(res.data.message || 'Login with Google failed after backend call.');
            }
        } catch (err: any) {
            console.error('Google login backend error:', err);
            setError(err.response?.data?.message || err.message || 'Login with Google failed due to backend error.');
        }
    };

    const handleGoogleLoginError = () => {
        setError('Google login failed. Please try again.');
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white shadow-xl rounded-lg w-full max-w-4xl md:flex overflow-hidden my-8">
                {/* Left Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center text-center">
                    <AppLogo />
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">Welcome Back!</h1>
                    <p className="text-slate-600 mb-8 text-sm md:text-base">Sign in with your Google account to continue.</p>
                    {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
                    <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError} />
                </div>

                {/* Right Side */}
                <div className="w-full md:w-1/2 bg-slate-50 p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8">Just Build Stuff.</h2>
                    <ul className="space-y-5">
                        <li className="flex items-start space-x-3">
                            <SparklesIcon className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-slate-700">AI generated apps</h3>
                                <p className="text-slate-500 text-sm">Leverage cutting-edge AI to bootstrap your projects.</p>
                            </div>
                        </li>
                        <li className="flex items-start space-x-3">
                            <AdjustmentsHorizontalIcon className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-slate-700">Easy to customize</h3>
                                <p className="text-slate-500 text-sm">Tailor your applications to fit your exact needs.</p>
                            </div>
                        </li>
                        <li className="flex items-start space-x-3">
                            <RocketLaunchIcon className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-slate-700">Seamless deployment</h3>
                                <p className="text-slate-500 text-sm">Get your apps live with minimal hassle.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

// ✅ Wrap with GoogleOAuthProvider
export default function Login() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <LoginView />
        </GoogleOAuthProvider>
    );
}
