import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorPage from "./components/ErrorPage";
import { HostQueueLoader } from "./pages/host-queues/loader";
import Layout from "./components/Layout";
import CustomerLayout from "./components/CustomerLayout";
import CreateQueue from "./pages/CreateQueue";
import HostQueues from "./pages/host-queues/HostQueues";
import Home from "./pages/Home";
import JoinQueue from "./pages/join-queue/JoinQueue";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { JoinQueueLoader } from "./pages/join-queue/loader";
import CustomerView from "./pages/CustomerView";
import HostQueueDetails from "./pages/HostQueueDetails";
import Analytics from "./pages/Analytics";
import QR from "./pages/QR";


const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      // Host Views
      {
        element: <CustomerLayout />,
        children: [
          {
            path: "/queue/:queueId/customer/:customerId",
            element: (
              <CustomerView />
            ),
          },
          {
            path: "/join/:queueId",
            element: (
              <JoinQueue />
            ),
            loader: JoinQueueLoader
          },
          {
            path: "/create",
            element: (
              <ProtectedRoute>
                <CreateQueue />
              </ProtectedRoute>
            )
          }
        ]

      },
      {
        path: "/my-queues",
        element: (
          <ProtectedRoute>
            <HostQueues />
          </ProtectedRoute>
        ),
        loader: HostQueueLoader
      },
      {
        path: "/my-queues/:queueId",
        element: (
          <ProtectedRoute>
            <HostQueueDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/qr/:queueId",
        element: (
          <ProtectedRoute>
            <QR />
          </ProtectedRoute>
        ),
      },
      {
        path: "/analytics",
        element: (
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        ),
      },


      // Auth Views
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element:
          <Signup />
      },
    ]
  }
]);
function App() {


  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
