import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import './ProductImageCarousel.css';

const ProductImageCarousel = ({ images, productName }) => {
  if (!images || images.length === 0) {
    return (
      <div className="product-image-carousel">
        <img
          src="/placeholder-logo.png"
          alt={productName || "Producto"}
          className="product-image-single"
        />
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="product-image-carousel">
        <img
          src={images[0]}
          alt={productName || "Producto"}
          className="product-image-single"
        />
      </div>
    );
  }

  return (
    <div className="product-image-carousel">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={true}
        pagination={{
          clickable: true,
          dynamicBullets: true
        }}
        loop={images.length > 1}
        slidesPerView={1}
        spaceBetween={10}
        className="product-swiper"
      >
        {images.map((imageUrl, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={imageUrl}
              alt={`${productName || "Producto"} - Imagen ${idx + 1}`}
              className="product-carousel-img"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductImageCarousel;