import { Header } from "../components/Header";
import { userIcon } from "../components/Icons";
import "../styles/ProfilePage.css";

export function ProfilePage() {
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
          <p className="profile-subtitle">0 Playing</p>
          <h1 className="profile-title">Usuario</h1>
          <p className="profile-subtitle">0 Completed</p>
        </div>
      </section>
    </>
  );
}
