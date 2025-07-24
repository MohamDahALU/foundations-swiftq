import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail } from '../firebase/auth';
import logoFull from "../assets/logoFull.png"

// Login component handles user authentication through email and password
const Login = () => {
  // State variables to store user input and component state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Stores authentication errors
  const [isLoading, setIsLoading] = useState(false); // Tracks login request status
  const navigate = useNavigate();

  // Handle form submission for email/password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Show loading state
    setError(''); // Clear any previous errors
    
    try {
      // Attempt to log in with provided credentials
      await loginWithEmail(email, password);
      // Redirect to my-queues page upon successful login
      navigate('/my-queues');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Display error message if login fails
      setError(err.message || 'Failed to log in');
    } finally {
      // Reset loading state regardless of outcome
      setIsLoading(false);
    }
  };
  return (
    // Main container with flex layout
    <div className=" flex flex-col justify-center py-4 px-4">
      {/* Logo section */}
      <div>
        <img src={logoFull} alt="Logo" className='mx-auto' />
      </div>
      {/* Page title */}
      <div className="mx-auto w-full max-w-md bg-primary rounded-full">
        <h2 className="my-2 text-center text-2xl font-semibold text-gray-900">Sign in to your account</h2>
      </div>

      {/* Login form container */}
      <div className="mt-8 sm:mx-auto w-full max-w-md ">
        <div className="bg-white py-8 px-4 sm:px-10 border-8 border-primary rounded-3xl shadow-md shadow-black/25">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleEmailLogin}>
            <div>
              <label htmlFor="email" className="block text-base font-semibold">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-base font-semibold">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md shadow-black/25 text-base font-semibold bg-primary hover:bg-primary-sat ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="font-medium text-blue-400 hover:text-blue-500"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;