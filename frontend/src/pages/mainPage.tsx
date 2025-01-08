import React from "react";
import '../App.css';
import logo from '../logo.svg';
import { useAuth } from "../contexts/AuthContext.tsx"

const HomePage = () => {
  const [data, setData] = React.useState(null);
  const auth = useAuth();

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {!auth.isLogin && (
          <p>
            Welcome to the Innovation Hub
          </p>
        )}

        {auth.isLogin && (
          <p>
            Welcome {auth.user}
          </p>
        )}

        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {!data ? "Loading..." : data}
        </p>
      </header>
    </div>
  );
}

export default HomePage;