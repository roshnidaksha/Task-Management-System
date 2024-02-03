import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom"
import Navbar from "./components/navbar.tsx";
import Login from "./pages/loginPage.tsx";
import Signup from "./pages/signupPage.tsx";
import Main from "./pages/mainPage.tsx";
import logo from './logo.svg';
import './App.css';

const App = () => {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
