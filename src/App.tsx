import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import JoinQueue from "./pages/JoinQueue";

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
        element: <h1>CreateQueue</h1>
      },
      {
        path: "/my-queues",
        element: <h1>HostQueues</h1>
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
        element: <h1>Login</h1>
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
