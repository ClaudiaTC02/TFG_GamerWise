import { GameCarousel } from "./GameCarousel";

export function CarouselSection(){
    return (
        <section>
            <h1 className="carousel-title">Últimos estrenos</h1>
            <hr className="carousel-line"/>
            <div className="carousel">
                <GameCarousel url='https://images.igdb.com/igdb/image/upload/t_cover_big/co5pxn.png' name='Nombre'/>
                <GameCarousel url='https://images.igdb.com/igdb/image/upload/t_cover_big/co5pxn.png' name='Nombre'/>
                <GameCarousel url='https://images.igdb.com/igdb/image/upload/t_cover_big/co5pxn.png' name='Nombre'/>
                <GameCarousel url='https://images.igdb.com/igdb/image/upload/t_cover_big/co5pxn.png' name='Nombre'/>
            </div>
        </section>
    )
}