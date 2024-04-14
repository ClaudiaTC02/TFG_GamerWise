import { GameCarousel } from "./GameCarousel";
import "../styles/CarouselSection.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function CarouselSection({ gamesData }) {
  const uniqueGames = new Set();
  // Configuración del carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };
  return (
    <section className="carousel-section">
      <h1 className="carousel-title">Últimos estrenos</h1>
      <hr className="carousel-line" />
      <Slider {...settings} className='carousel'>
        {gamesData.map((element) => {
          if (!uniqueGames.has(element.game.name)) {
            uniqueGames.add(element.game.name);
            return <GameCarousel key={element.id} game={element} />;
          } else {
            return null;
          }
        })}
      </Slider>
    </section>
  );
}
