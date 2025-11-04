import React from 'react';
import ProductList from '../components/ProductList';
import ImageCarousel from '../components/ImageCarousel';
import BannerSwiper from '../components/BannerSwiper';
import MosaicCategory from '../components/MosaicCategory';
import './HomePage.css';

const images = [
  { src: 'https://dcdn-us.mitiendanube.com/stores/005/572/435/themes/atlantico/2-slide-1746064821469-8323734941-52bdbb886f8d732b4b2ba3f9f6b974fc1746064821-1920-1920.webp?398181426', alt: 'Texto 1' },
  { src: 'https://dcdn-us.mitiendanube.com/stores/005/572/435/themes/atlantico/2-slide-1745246668335-3628377708-f1b09c88bef8f46956809197208d4c7f1745246669-1920-1920.webp?398181426', alt: 'Texto 2' },
  { src: 'https://dcdn-us.mitiendanube.com/stores/005/572/435/themes/atlantico/2-slide-1747671771536-6155866042-f246ef8334b9fda2333c74f710a6e7ae1747671773-1920-1920.webp?398181426', alt: 'Texto 3' },
];
const promos = [
  "¡TODA LA WEB CON DESCUENTOS IMPERDIBLES!",
  "3 y 6 cuotas SIN INTERES"
];
const HomePage = () => {
  return (
    <div className="home-page">
      <main className="main-content">
        
        <BannerSwiper promos={promos} />
        <ImageCarousel images={images} />
        <MosaicCategory />
        <section className="products-section">
          <div className="products-header">
            <h2>Productos destacados</h2>
            <p>Explora nuestro catalogo actualizado en tiempo real.</p>
          </div>
          <ProductList />
        </section>
      </main>
    </div>
  );
};

export default HomePage;