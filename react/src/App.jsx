import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LandingLogged from "./pages/LandingLogged.jsx";
import GameDetailPage from "./pages/GameDetailPage.jsx";

import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { useAuth } from "./hooks/useAuth.js";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { ListPage } from "./pages/ListPage.jsx";
import { SteamPage } from "./pages/SteamPage.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/logged" element={<LandingLogged />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/list/:id" element={<ListPage />} />
          </Route>
          <Route path="/game/:id" element={<GameDetailPage />} />
          <Route path="/steam/:token" element={<SteamPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function AuthRedirect() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/logged" /> : <LandingPage />;
}

export default App;
