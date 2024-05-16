import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "../components/Loading";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export function SteamPage() {
  const {token} = useParams();
  const {isAuthenticated, signInSteam} = useAuth();
  const navigate = useNavigate();

  signInSteam(token)

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/logged");
    }
  }, [isAuthenticated, navigate]);
  
  return <Loading/>;
}
