import { useState, useEffect } from "react";
import { ListPreview } from "./ListPreview";
import "../styles/ListSection.css";
import { useAuth } from "../hooks/useAuth";
import { getAllListOfUserRequest } from "../api/list";
import { ModalCreateList } from "./ModalLists";
import { searchIcon } from "./Icons";
import { Link } from "react-router-dom";

export function ListsProfile() {
  const [lists, setLists] = useState([]);
  const [filteredLists, setFilteredLists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useAuth();
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lists = await getAllListOfUserRequest(token);
        setLists(lists);
        setFilteredLists(lists);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [token]);

  const handleOpenModalCreate = (event) => {
    event.preventDefault();
    setShowCreate(true);
  };

  const addList = (newList) => {
    setLists((prevLists) => [...prevLists, newList]);
    setFilteredLists((prevLists) => [...prevLists, newList]);
  };

  const getColor = (name) => {
    switch (name) {
      case "Playing":
        return "#ef4f23";
      case "Completed":
        return "#136422";
      case "Favorites":
        return "#BF17D3";
      case "Dropped":
        return "#555";
      case "Owned":
        return "#0003b8";
      default:
        if (name.length <= 5) return "#ef4f23";
        if (name.length <= 8) return "#2563eb";
        return "#ea580c";
    }
  };

  useEffect(() => {
    const filtered = lists.filter((list) =>
      list.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredLists(filtered);
  }, [searchTerm, lists]);

  return (
    <>
      <div className="container-search-list">
        <span className="icon_search-list">{searchIcon()}</span>
        <input
          className="input-search-list"
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="list-section-header">
        <span className="list-section-title">Mis listas</span>
        <div class="carousel-line"></div>
      </div>

      <section className="list-section">
        <div onClick={handleOpenModalCreate}>
          <ListPreview name="+" color="#F2F2F2" newlist={true} />
        </div>
        {filteredLists.map((list) => (
          <div key={list.id}>
            <Link
              to={`/list/${list.id}`}
              className="list-link"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListPreview
                name={list.name}
                color={getColor(list.name)}
                list_id={list.id}
              />
            </Link>
          </div>
        ))}
        <ModalCreateList
          show={showCreate}
          handleClose={() => setShowCreate(false)}
          token={token}
          addList={addList}
        />
      </section>
    </>
  );
}
