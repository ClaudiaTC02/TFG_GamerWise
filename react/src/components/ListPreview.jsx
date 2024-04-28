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
        backgroundColor: color,
        color: newlist ? "black" : "white",
      }}
      className="list-container"
      onClick={handleListClick}
    >
      {name}
    </div>
  );
}
