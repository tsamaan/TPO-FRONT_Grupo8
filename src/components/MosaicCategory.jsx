import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MosaicCategory.css';

const mosaics = [
  {
    image: '/img/4.png', 
    link: '/mochilas',
  },
  {
    image: '/img/2.png', 
    link: '/materos',
  },
  {
    image: '/img/1.png', 
    link: '/bolsos',
  },
];

const MosaicCategory = () => {
  const navigate = useNavigate();
  return (
    <div className="mosaic-category-container">
      {mosaics.map((mosaic, idx) => (
        <button
          key={mosaic.link}
          className="mosaic-card"
          style={{ background: 'transparent', boxShadow: 'none' }}
          onClick={() => navigate(mosaic.link)}
        >
          <div className="mosaic-img-frame">
            <img src={mosaic.image} alt="" className="mosaic-img" />
          </div>
        </button>
      ))}
    </div>
  );
};

export default MosaicCategory;
