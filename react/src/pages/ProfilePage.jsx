import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { userIcon } from "../components/Icons";
import "../styles/ProfilePage.css";
import { ListsProfile } from "../components/ListsProfile";
import { useAuth } from "../hooks/useAuth";
import { getBasicInfoRequest } from "../api/user";
import { getCountOfGamesProfileLogic } from "../logic/listLogic";
import { RatingProfile } from "../components/RatingProfile";
import { SettingsProfile } from "../components/SettingsProfile";
import { Footer } from "../components/Footer";

export function ProfilePage() {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [gamesCount, setGamesCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getBasicInfoRequest(token);
        setUser(userData.info);
        const counted = await getCountOfGamesProfileLogic(token);
        setGamesCount(counted);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (["lists", "ratings", "options"].includes(hash)) {
        setActiveComponent(hash);
      } else {
        setActiveComponent("lists");
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const [activeComponent, setActiveComponent] = useState("lists");
  const handleClick = (componente) => setActiveComponent(componente);

  const updateUser = async (newName) => {
    try { setUser({ ...user, name: newName }); }
    catch (error) { console.log(error); }
  };

  const updateUserSteam = (newSteamValue) => {
    setUser((prevUser) => ({ ...prevUser, steam: newSteamValue }));
  };

  return (
    <>
      <Header isLogged={true} />

      <section>
        <div className="profile-background">
          <div className="profile-background-glow" />
          <div className="profile-background-fade" />
        </div>
        <div className="profile-img-container">
          <div className="profile-img-inner">
            <img src={userIcon()} alt="user-photo" className="profile-img" />
          </div>
        </div>
        <div className="profile-texts-container">
          <h1 className="profile-title">{user?.name ?? "—"}</h1>
          <div className="profile-stats-row">
            <p className="profile-subtitle">
              <span className="profile-stat-number">
                {gamesCount?.counted_playing ?? 0}
              </span>
              <span className="profile-stat-label">Playing</span>
            </p>
            <p className="profile-subtitle">
              <span className="profile-stat-number">
                {gamesCount?.counted_completed ?? 0}
              </span>
              <span className="profile-stat-label">Completed</span>
            </p>
          </div>
        </div>
      </section>

      <nav className="profile-nav">
        <ul>
          <li>
            <a href="#lists"
              className={activeComponent === "lists" ? "active" : ""}
              onClick={() => handleClick("lists")}>
              Listas
            </a>
          </li>
          <li>
            <a href="#ratings"
              className={activeComponent === "ratings" ? "active" : ""}
              onClick={() => handleClick("ratings")}>
              Puntuaciones
            </a>
          </li>
          <li>
            <a href="#options"
              className={activeComponent === "options" ? "active" : ""}
              onClick={() => handleClick("options")}>
              Opciones
            </a>
          </li>
        </ul>
      </nav>

      {activeComponent === "lists" && <ListsProfile />}
      {activeComponent === "ratings" && <RatingProfile />}
      {activeComponent === "options" && (
        <SettingsProfile updateUser={updateUser} user={user} updateUserSteam={updateUserSteam} />
      )}

      <Footer />
    </>
  );
}
