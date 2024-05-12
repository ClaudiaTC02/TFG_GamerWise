import { Header } from "../components/Header";
import { editIcon } from "../components/Icons";
import { ListGame } from "../components/ListGame";
import "../styles/ListPage.css";

export function ListPage() {
  return (
    <>
      <Header isLogged={true} />
      <div className="list-titles-container">
        <div className="list-title-container">
          <h1 className="list-title">Título</h1>
          <hr className="list-hr" />
        </div>
        <div className="list-edit-container">
          <a>{editIcon()}</a>
        </div>
      </div>
      <p className="list-description">Descripcion</p>
      <main className="list-games-container">
        <ListGame />
        <ListGame />
        <ListGame />
        <ListGame />
        <ListGame />
        <ListGame />
      </main>
    </>
  );
}
