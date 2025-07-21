// import { useState } from 'react';
// import { Link } from 'react-router-dom';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Handle login logic here
//     console.log({ email, password });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white p-4">
//       <div className="max-w-md w-full">
//         <div className="text-center mb-10">
//           <h1 className="text-3xl font-bold text-gray-900">SwiftQ</h1>
//           <h2 className="mt-2 text-2xl font-semibold text-gray-800">Sign In</h2>
//           <p className="mt-2 text-gray-600">Please sign in to continue</p>
//         </div>

//         <form className="space-y-6" onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                 Email
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="current-password"
//                 required
//                 className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 name="remember-me"
//                 type="checkbox"
//                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//               />
//               <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                 Remember me
//               </label>
//             </div>

//             <div className="text-sm">
//               <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
//                 Forgot Password?
//               </a>
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Sign In
//             </button>
//           </div>
//         </form>

//         <div className="mt-6 text-center">
//           <p className="text-sm text-gray-600">
//             Don't have an account?{' '}
//             <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
//               Sign Up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoFull from "../../src/assets/logoFull.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const error = false;
  const isLoading = false;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <div className=" flex flex-col justify-center py-4 px-4">
      <div>
        <img src={logoFull} alt="Logo" className="mx-auto" />
      </div>
      <div className="mx-auto w-full max-w-md bg-primary rounded-full">
        <h2 className="my-2 text-center text-2xl font-semibold text-gray-900">
          Sign in to your account
        </h2>
      </div>

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
              <label
                htmlFor="password"
                className="block text-base font-semibold"
              >
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
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
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
