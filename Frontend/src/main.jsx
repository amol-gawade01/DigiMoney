import React from "react"
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage.jsx'
import AuthLayout from './components/AuthLayout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import SendMoneyPage from './pages/SendMoneyPage.jsx'
import store from "./store/store.js"
import { Provider } from "react-redux";
import Home from "./components/Home.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/dashboard",
        element: (
          <AuthLayout authentication={true}>
            <DashboardPage />
          </AuthLayout>
        )
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <LoginPage />
          </AuthLayout>
        )
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <SignUpPage />
          </AuthLayout>
        )
      },
      {
        path: "/send/:id/:name",
        element: (
          <AuthLayout authentication={true}>
            <SendMoneyPage />
          </AuthLayout>
        )
      }
    ]
  }
]);


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>
)
