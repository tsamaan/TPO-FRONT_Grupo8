import React from 'react';
import ProductDetail from '../components/ProductDetail';
import BannerSwiper from '../components/BannerSwiper';
import { usePromos } from '../context/PromoContext';

const ProductDetailPage = () => {
  const { promos } = usePromos();
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
 