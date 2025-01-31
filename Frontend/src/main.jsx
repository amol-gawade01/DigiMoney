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

const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"/",
        element:<AuthLayout authentication>
          <DashboardPage/>
        </AuthLayout>
      },
      {
        path:"/login",
        element:<AuthLayout authentication={false}>
          <LoginPage/>
        </AuthLayout>
      },
      {
        path:"/signup",
        element:<AuthLayout authentication={false}>
        <SignUpPage/>
      </AuthLayout>
      },
      {
        path:"/send",
        element:<AuthLayout authentication>
          <SendMoneyPage/>
        </AuthLayout>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>
)
