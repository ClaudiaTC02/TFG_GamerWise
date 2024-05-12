import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { editIcon } from "../components/Icons";
import { ListGame } from "../components/ListGame";
import "../styles/ListPage.css";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getListRequest } from "../api/list";

export function ListPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [list, setList] = useState([]);


  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const list_result = await getListRequest(id, token);
        if (list_result) {
            setList(list_result);
          } else {
            console.log("No se encontraron detalles del juego");
          }
      } catch (error) {
        console.log(error);
      }
    };
    fetchListDetails();
  }, [id, token]);

  return (
    <>
      <Header isLogged={true} />
      <div className="list-titles-container">
        <div className="list-title-container">
          <h1 className="list-title">{list.name}</h1>
          <hr className="list-hr" />
        </div>
        <div className="list-edit-container">
          <a>{editIcon()}</a>
        </div>
      </div>
      <p className="list-description">{list.description}</p>
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
