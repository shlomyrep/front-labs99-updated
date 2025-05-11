// src/features/auth/Login.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from './authSlice';
import { useNavigate } from 'react-router-dom';
import Axios from '../../api/axios.ts';
import type { AppDispatch } from '../../app/store';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { SparklesIcon, AdjustmentsHorizontalIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import appCompanyLogo from '../../assets/logo.png'; // <--- IMPORT YOUR LOGO

// ----------------------------------------------------------------------
const GOOGLE_CLIENT_ID = '533335327172-4p066sspjejqp0ai9rtor4gtmlg4pp61.apps.googleusercontent.com'; // YOUR ACTUAL ID
// ----------------------------------------------------------------------

// --- Google 'G' Logo SVG ---
const GoogleLogo = () => (
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-3">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    <path fill="none" d="M1 1h22v22H1z" />
  </svg>



// ... GoogleLogo component ends ...
); // <--- THIS SEMICOLON is likely the issue if it's misplaced after the GoogleLogo

// --- App Logo (Labs 99) ---
const AppLogo = () => ( // Line 29
  <div className="mx-auto mb-8 flex justify-center p-2 bg-gray-700 rounded-md"> {/* Example: Added padding, dark gray background, and rounded corners */}
    <img
      src={appCompanyLogo}
      alt="Labs 99 Logo"
      className="h-16 md:h-20 object-contain"
    />
  </div>
);

// The actual view component
function LoginView() {
    const [error, setError] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleGoogleLoginSuccess = async (tokenResponse: any) => {
        setError('');
        console.log('Google Login Success (raw response):', tokenResponse);

        const googleToken = tokenResponse?.access_token;

        if (!googleToken) {
            setError('Google login failed: No access_token received from Google.');
            console.error('No access_token in tokenResponse from Google:', tokenResponse);
            return;
        }

        console.log('Extracted Google Token for backend:', googleToken);

        try {
            const res = await Axios.post('/auth/google-signin', {
                token: googleToken,
            });

            if (res.data.accessToken) {
                dispatch(setToken(res.data.accessToken));
                localStorage.setItem('accessToken', res.data.accessToken);
                navigate('/');
            } else {
                setError(res.data.message || 'Login with Google failed after backend call.');
            }
        } catch (err: any) {
            console.error("Backend Google Signin Error:", err);
            setError(err.response?.data?.message || err.message || 'Login with Google failed due to backend error.');
        }
    };

    const handleGoogleLoginError = (errorResponse?: any) => {
        console.error('Google Login Failed (raw error response):', errorResponse);
        setError('Google login failed. Please try again or check console.');
    };

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: handleGoogleLoginError,
    });

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white shadow-xl rounded-lg w-full max-w-4xl md:flex overflow-hidden my-8">
                {/* Left Side - Login Prompt */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center text-center">
                    <AppLogo /> {/* Use the new Labs 99 Logo */}
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
                        Welcome Back!
                    </h1>
                    <p className="text-slate-600 mb-8 text-sm md:text-base">
                        Sign in with your Google account to continue.
                    </p>
                    {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
                    <button
                        onClick={() => googleLogin()}
                        className="w-full max-w-xs bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 border border-slate-300 rounded-md shadow-sm flex items-center justify-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500" // Changed focus ring to sky-500
                    >
                        <GoogleLogo />
                        <span>Continue with Google</span>
                    </button>
                </div>

                {/* Right Side - App Features/Tagline */}
                <div className="w-full md:w-1/2 bg-slate-50 p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8">
                        Just Build Stuff. {/* Or your app's tagline */}
                    </h2>
                    <ul className="space-y-5">
                        <li className="flex items-start space-x-3">
                            <SparklesIcon className="h-6 w-6 text-sky-500 flex-shrink-0 mt-0.5" /> {/* Changed text to sky-500 */}
                            <div>
                                <h3 className="font-semibold text-slate-700">AI generated apps</h3>
                                <p className="text-slate-500 text-sm">Leverage cutting-edge AI to bootstrap your projects.</p>
                            </div>
                        </li>
                        <li className="flex items-start space-x-3">
                            <AdjustmentsHorizontalIcon className="h-6 w-6 text-sky-500 flex-shrink-0 mt-0.5" /> {/* Changed text to sky-500 */}
                            <div>
                                <h3 className="font-semibold text-slate-700">Easy to customize</h3>
                                <p className="text-slate-500 text-sm">Tailor your applications to fit your exact needs.</p>
                            </div>
                        </li>
                        <li className="flex items-start space-x-3">
                            <RocketLaunchIcon className="h-6 w-6 text-sky-500 flex-shrink-0 mt-0.5" /> {/* Changed text to sky-500 */}
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

// Main Login component that provides the GoogleOAuthProvider
export default function Login() {
    if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
        return (
          <div className="min-h-screen bg-red-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h1 className="text-2xl font-bold text-red-700 mb-4">Configuration Needed</h1>
              <p className="text-red-600">
                Please replace the placeholder <code>'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'</code>
                <br />
                with your actual Google Client ID at the top of <code>src/features/auth/Login.tsx</code>.
              </p>
              <p className="mt-4 text-sm text-gray-600">
                You also need to ensure your backend has an endpoint (e.g., <code>/auth/google-signin</code>)
                to handle the Google token and issue your application's access token.
              </p>
            </div>
          </div>
        );
      }

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <LoginView />
        </GoogleOAuthProvider>
    );
}