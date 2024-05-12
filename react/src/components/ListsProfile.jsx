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
    let color;
    switch (name) {
      case "Playing":
        color = "#FF0000";
        break;
      case "Completed":
        color = "#136422";
        break;
      case "Like":
        color = "#BF17D3";
        break;
      case "Dropped":
        color = "#490C0C";
        break;
      default:
        if (name.length <= 5) {
          color = "#FF2222";
        } else if (name.length <= 8) {
          color = "blue";
        } else {
          color = "darkorange";
        }
        break;
    }
    return color;
  };

  useEffect(() => {
    const filtered = lists.filter((list) =>
      list.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLists(filtered);
  }, [searchTerm, lists]);

  return (
    <>
      <div className="container-search-list">
        <span className="icon_search">{searchIcon()}</span>
        <input
          className="input-search"
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
