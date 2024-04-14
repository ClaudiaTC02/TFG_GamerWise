import { GameCarousel } from "./GameCarousel";
import gamesData from "../mock/latestGame.json";

export function CarouselSection() {
  const uniqueGames = new Set();
  return (
    <section>
      <h1 className="carousel-title">Últimos estrenos</h1>
      <hr className="carousel-line" />
      <div className="carousel">
        {gamesData.map((element) => {
          if (!uniqueGames.has(element.game.name)) {
            uniqueGames.add(element.game.name);
            return <GameCarousel key={element.id} game={element} />;
          } else {
            return null;
          }
        })}
      </div>
    </section>
  );
}
