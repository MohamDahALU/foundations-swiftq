import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";




const router = createBrowserRouter([
  {
    errorElement: <h1>Error</h1>,
    children: [
      {
        path: "/",
        element: <Suspense fallback={<h1>Loading...</h1>}>
          <h1>Home</h1>
        </Suspense>
      },
      // Host Views
      {
        path: "/create",
        element: (
            <Suspense fallback={<h1>Loading...</h1>}>
              <h1>CreateQueue</h1>
            </Suspense>
        )
      },
      {
        path: "/my-queues",
        element: (
            <Suspense fallback={<h1>Loading...</h1>}>
              <h1>HostQueues</h1>
            </Suspense>
        ),
      },
      {
        path: "/my-queues/:queueId",
        element: (
            <Suspense fallback={<h1>Loading...</h1>}>
              <h1>HostQueueDetails</h1>
            </Suspense>
        ),
      },
      {
        path: "/qr/:queueId",
        element: (
            <Suspense fallback={<h1>Loading...</h1>}>
              <h1>QR</h1>
            </Suspense>
        ),
      },
      
      
      // Customer Views
      {
        path: "/join/:queueId",
        element: (
          <Suspense fallback={<h1>Loading...</h1>}>
            <h1>JoinQueue</h1>
          </Suspense>
        ),
      },
      {
        path: "/queue/:queueId/customer/:customerId",
        element: (
          <Suspense fallback={<h1>Loading...</h1>}>
            <h1>CustomerView</h1>
          </Suspense>
        ),
      },



      // Auth Views
      {
        path: "/login",
        element: <Suspense fallback={<h1>Loading...</h1>}>
          <h1>Login</h1>
        </Suspense>
      },
      {
        path: "/register",
        element: <Suspense fallback={<h1>Loading...</h1>}>
          <h1>Signup</h1>
        </Suspense>
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
