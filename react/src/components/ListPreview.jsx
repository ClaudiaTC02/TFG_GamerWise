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
      className={`list-container${newlist ? " list-container--new" : ""}`}
      style={{ "--list-color": color }}
      onClick={handleListClick}
    >
      {!newlist && (
        <span
          className="list-container__dot"
          style={{ background: color }}
        />
      )}
      <span className="list-container__name">{name}</span>
    </div>
  );
}
