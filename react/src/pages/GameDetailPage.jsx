import { useParams } from "react-router-dom";
import { CarouselSection } from "../components/CarouselSection";
import datamock from "../mock/latestGame.json";
import { Header } from "../components/Header";
import { defaultCoverIcon } from "../components/Icons";
import "../styles/GameDetailPage.css";

export function GameDetailPage() {
  const { id } = useParams();
  return (
    <>
      <Header />
      <section>
        <div className="detail-section">
          <div className="detail-container-right">
            <img className="detail-cover" src={defaultCoverIcon()} />
            <p className="detail-rating">Puntúalo</p>
            <div className="detail-star-container">
              <i className="bi bi-star"></i>
              <i className="bi bi-star"></i>
              <i className="bi bi-star"></i>
              <i className="bi bi-star"></i>
              <i className="bi bi-star"></i>
            </div>
            <button className="detail-addList-button">Añadir a lista</button>
          </div>
          <div className="detail-container-left">
            <div className="detail-container-info">
              <div className="detail-container-title">
                <h1 className="detail-title">Título</h1>
                <h3 className="detail-subtitle">Subtítulo</h3>
              </div>
              <i className="bi bi-heart"></i>
            </div>
            <p className="detail-gender">Género</p>
            <p className="detail-platforms">Plataformas</p>
          </div>
        </div>
        <div className="detail-container-description">
          <h5 className="detail-title-description">Desripción</h5>
          <p className="detail-text-description">Texto</p>
        </div>
      </section>
      <CarouselSection gamesData={datamock} text="También puede gustarte" />
    </>
  );
}
