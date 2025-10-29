import React from 'react';
import ProductDetail from '../components/ProductDetail';
import BannerSwiper from '../components/BannerSwiper';

const promos = [
  "¡TODA LA WEB CON DESCUENTOS INPERDIBLES!",
  "Envío gratis en compras mayores a $20.000",
  "3 y 6 cuotas sin interés"
];
const ProductDetailPage = () => {
  return (
    <main>
      <BannerSwiper promos={promos} />
      <section className="product-detail-section">
        <ProductDetail />
      </section>
    </main>
  );
};

export default ProductDetailPage;
 