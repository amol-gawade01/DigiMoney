import { useState,useEffect} from 'react' 
import { login,logout } from './store/authSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import './App.css'
import axios from "axios"
import { Header } from './components/index.js';
import { Outlet } from 'react-router-dom';
import Cookies from "js-cookie"


function App() {

   const [loading,setLoading] = useState(true);
   const theme = useSelector((store) => store.theme.theme)
   const authStatus = useSelector((store) => store.auth.status)
   const dispatch = useDispatch()
   
   
    
  
  
   useEffect(() => {
    
    if (!authStatus) {
      axios.get(`http://localhost:8000/api/v1/users/getuser`, {
        withCredentials: true 
      })
      .then((userData) => {
        if (userData) {
          dispatch(login(userData.data));
        } else {
          dispatch(logout());
        }
        setLoading(false); 
      })
      .catch(() => setLoading(false)); 
    } else {
      setLoading(false); // No cookie, stop loading
    }
  }, []);
   
   useEffect(() => {
    document.body.className = "" // Set the class based on theme
    document.body.className = theme; // Set the class based on theme
  }, [theme]);


  if (loading) {
    return <>
    <Header/>
    <div className=' text-center items-center w-screen h-screen mt-40'>
    </div>
    
    </>
  }else{
    return <>
     <Header/>
     <main className='min-h-screen'>
     <Outlet/>
     </main>
     
    </>
  }
}

export default App
