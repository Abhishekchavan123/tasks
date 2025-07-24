import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import App from './App.jsx'
import ViewTasks from './ViewTasks.jsx'
import Login from "./Login"

function LoginWithRedirect() {
  const navigate = useNavigate();
  return <Login onLoginSuccess={() => navigate("/app")} />;
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginWithRedirect />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/app" element={<App />} />
        <Route path="/view-tasks" element={<ViewTasks />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
