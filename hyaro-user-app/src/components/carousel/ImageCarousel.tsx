'use client';

import { FC } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { Box } from '@mui/material';

interface IImageCarousel {
  images: string[];
}

const ImageCarousel: FC<IImageCarousel> = ({ images }) => {
  return (
    <Carousel
      infiniteLoop={true}
      showArrows={true}
      showIndicators={false}
      showStatus={false}
      showThumbs={false}
      autoPlay={true}
      swipeable={true}
    >
      {images.map((el, key) => {
        return (
          <Box
            component="img"
            src={el}
            alt={el}
            sx={{
              objectFit: 'fill',
              borderRadius: { xs: '0', md: '16px' },
              height: '310px',
              width: '100%',
            }}
            key={key}
          />
        );
      })}
    </Carousel>
  );
};

export default ImageCarousel;
