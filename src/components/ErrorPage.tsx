// src/components/ErrorPage.tsx
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  
  let errorMessage: string;
  let errorStatus: number | null = null;
  console.log(error)
  
  // Handle different types of errors
  if (isRouteErrorResponse(error)) {
    // This is a route error response from React Router
    errorStatus = error.status;
    errorMessage = error.statusText || error.data || "Something went wrong";
  } else if (error instanceof Error) {
    // This is a standard JavaScript Error object
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    // This is a string error message
    errorMessage = error;
  } else {
    // Fallback for any other type of error
    errorMessage = "An unknown error occurred";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-2">
          {errorStatus ? `${errorStatus}` : "Error"}
        </h1>
        <h2 className="text-2xl font-semibold mb-4">Oops!</h2>
        <p className="text-gray-600 mb-6">Sorry, an unexpected error has occurred.</p>
        <p className="text-gray-800 font-medium mb-8 p-3 bg-gray-50 rounded">
          {errorMessage}
        </p>
        <Link 
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition duration-200"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}