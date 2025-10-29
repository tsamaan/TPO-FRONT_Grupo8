import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import './ImageCarousel.css';

const ImageCarousel = ({ images }) => (
  <div className="image-carousel">
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      loop={true}
      slidesPerView={1}
      className="mySwiper"
    >
      {images.map((img, idx) => (
        <SwiperSlide key={idx}>
          <img src={img.src} alt={img.alt || `slide-${idx}`} className="carousel-img" />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

export default ImageCarousel;
