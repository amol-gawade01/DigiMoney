import { useState, useEffect } from "react";
import { login, logout } from "./store/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import axios from "axios";
import { Header } from "./components/index.js";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function App() {
  const [loading, setLoading] = useState(true);
  const theme = useSelector((store) => store.theme.theme);
  const authStatus = useSelector((store) => store.auth.status);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    const cookie = Cookies.get("accessToken");

    if (cookie && !authStatus) {
      axios
        .get("http://localhost:8000/api/v1/users/getuser", {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data) {
            dispatch(login(response.data));
          } else {
            dispatch(logout());
            navigate("/login")
          }
        })
        .catch(() => dispatch(logout()))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch, authStatus]);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center items-center w-screen h-screen mt-40"></div>
      </>
    );
  } else {
    return (
      <>
        <Header />
        <main className="min-h-screen">
          <Outlet />
        </main>
      </>
    );
  }
}

export default App;
