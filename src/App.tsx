import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import JoinQueue from "./pages/JoinQueue";
import Login from "./pages/Login";
import CreateQueue from "./pages/CreateQueue";
import HostQueues from "./pages/HostQueues";

const router = createBrowserRouter([
  {
    errorElement: <h1>Error</h1>,
    children: [
      {
        path: "/",
        element: <Home />
      },
      // Host Views
      {
        path: "/create",
        element: <CreateQueue />
      },
      {
        path: "/my-queues",
        element: <HostQueues />
      },
      {
        path: "/my-queues/:queueId",
        element: <h1>HostQueueDetails</h1>
      },
      {
        path: "/qr/:queueId",
        element: <h1>QR</h1>
      },
      
      
      // Customer Views
      {
        path: "/join/:queueId",
        element: <JoinQueue />
      },
      {
        path: "/queue/:queueId/customer/:customerId",
        element: <h1>CustomerView</h1>
      },



      // Auth Views
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <h1>Signup</h1>
      },
    ]
  }
]);
function App() {


  return (
      <RouterProvider router={router} />
  );
}

export default App;
