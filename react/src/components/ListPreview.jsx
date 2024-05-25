import "../styles/ListSection.css";

export function ListPreview({ name, color, newlist, list_id }) {
  const handleListClick = () => {
    if (newlist) {
      console.log("crear nueva lista");
    } else {
      console.log("entrar a", list_id);
    }
  };
  return (
    <div
      style={{
        border:`2px solid ${color}`,
        color: "black",
        backgroundColor: newlist ? color : "rgb(249 249 249)" 
      }}
      className="list-container"
      onClick={handleListClick}
    >
      {name}
    </div>
  );
}
