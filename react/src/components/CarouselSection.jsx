import { GameCarousel } from "./GameCarousel";
import "../styles/CarouselSection.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Loading } from "./Loading";

export function CarouselSection({ gamesData, text }) {
  if (!Array.isArray(gamesData) || gamesData.length === 0) {
    return <Loading/>;
  }
  const uniqueGames = new Set();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          initialSlide: 1,
          infinite: true,
        },
      },
    ],
  };
  return (
    <section className="carousel-section">
      <h1 className="carousel-title">{text}</h1>
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
