import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { userIcon } from "../components/Icons";
import "../styles/ProfilePage.css";
import { ListsProfile } from "../components/ListsProfile";
import { useAuth } from "../hooks/useAuth";
import { getBasicInfoRequest } from "../api/user";
import { getCountOfGamesProfileLogic } from "../logic/listLogic";
import { RatingProfile } from "../components/RatingProfile";

export function ProfilePage() {
    const {token} = useAuth()
    const [user, setUser] = useState(null)
    const [gamesCount, setGamesCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
        try {
          const userData = await getBasicInfoRequest(token);
          setUser(userData.info)
          const counted = await getCountOfGamesProfileLogic(token)
          setGamesCount(counted)
        } catch (error) {
          console.log(error);
        }
      };
      fetchData()
  }, [token]);
  const [activeComponent, setActiveComponent] = useState("lists");
  const handleClick = (componente) => {
    setActiveComponent(componente);
  };
  return (
    <>
      <Header isLogged={true} />
      <section>
        <div className="profile-background">
          <div className="profile-img-container">
            <img src={userIcon()} alt="user-photo" className="profile-img" />
          </div>
        </div>
        <div className="profile-texts-container">
          <p className="profile-subtitle">{gamesCount && gamesCount.counted_playing} Playing</p>
          <h1 className="profile-title">{user && user.name}</h1>
          <p className="profile-subtitle">{gamesCount && gamesCount.counted_completed} Completed</p>
        </div>
      </section>
      <nav className="profile-nav">
        <ul>
          <li>
            <a
              href="#"
              className={activeComponent === "lists" ? "active" : ""}
              onClick={() => handleClick("lists")}
            >
              Listas
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeComponent === "ratings" ? "active" : ""}
              onClick={() => handleClick("ratings")}
            >
              Puntuaciones
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeComponent === "options" ? "active" : ""}
              onClick={() => handleClick("options")}
            >
              Opciones
            </a>
          </li>
        </ul>
      </nav>

      {activeComponent === "lists" && <ListsProfile />}
      {activeComponent === "ratings" && <RatingProfile />}

    </>
  );
}
