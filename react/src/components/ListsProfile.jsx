import { ListPreview } from "./ListPreview";
import "../styles/ListSection.css";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getAllListOfUserRequest } from "../api/list";
export function ListsProfile() {
  const [lists, setLists] = useState();
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lists = await getAllListOfUserRequest(token);
        setLists(lists);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [token]);

  const getColor = (name) => {
    switch (name) {
        case "Playing":
            return "#FF0000";
        case "Completed":
            return "#136422"
        case "Like":
            return "#BF17D3"
        case "Dropped":
            return "#490C0C"
        default:
            return "#FF2222"
    }
  };
  return (
    <section className="list-section">
      <ListPreview name='+' color="#F2F2F2" newlist={true} />
      {lists &&
        lists.map((list) => (
          <div key={list.id}>
            <ListPreview name={list.name} color={getColor(list.name)} list_id={list.id} />
          </div>
        ))}
    </section>
  );
}
