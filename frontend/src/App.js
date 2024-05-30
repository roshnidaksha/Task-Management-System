import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom"
import Navbar from "./components/navbar.tsx";
import LoginPage from "./pages/loginPage.tsx";
import SignupPage from "./pages/signupPage.tsx";
import HomePage from "./pages/mainPage.tsx";
import ProfilePage from "./pages/profilePage.tsx";
import TasksPage from "./pages/tasksPage.tsx";
import './App.css';

const App = () => {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/profile/:userID' element={<ProfilePage />} />
        <Route path='/tasks' element={<TasksPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
