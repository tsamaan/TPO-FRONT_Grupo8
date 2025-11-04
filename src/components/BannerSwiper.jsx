import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';
import './BannerSwiper.css';

const BannerSwiper = ({ promos }) => (
  <main className="banner-swiper">
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      loop={true}
      slidesPerView={1}
      allowTouchMove={false}
      className="bannerSwiper"
    >
      {promos.map((promo, idx) => (
        <SwiperSlide key={idx}>
          <div className="banner-slide">{promo}</div>
        </SwiperSlide>
      ))}
    </Swiper>
  </main>
);

export default BannerSwiper;
