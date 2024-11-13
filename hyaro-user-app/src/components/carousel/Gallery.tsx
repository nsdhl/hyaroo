'use client';

import { Box, Stack } from '@mui/material';
import { FC, MutableRefObject, useRef, useState } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';
import When from '../hoc/When';
import { ArrowDownwardRounded } from '@mui/icons-material';

interface IGallery {
  images: string[];
  videos: string[];
}

const Gallery: FC<IGallery> = ({ images, videos }) => {
  const ref = useRef<HTMLDivElement>() as MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(ref);

  const [selectedMedia, setSelectedMedia] = useState(
    videos.length > 0 ? videos[0] : images[0],
  );

  return (
    <Stack
      direction="row"
      columnGap="0.5em"
      sx={{
        alignItems: 'flex-start',
        position: 'relative',
        height: '450px',
      }}
    >
      <Stack
        direction="column"
        flexBasis="20%"
        sx={{
          overflowY: 'scroll',
          rowGap: '0.9em',
          minWidth: '100px',
          maxHeight: { xs: '450px', md: '490px' },
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          position: 'relative',
        }}
        {...events}
        ref={ref}
      >
        {videos.length > 0 &&
          videos.map((video, key) => {
            return (
              <Box
                key={key}
                width="100px"
                height="120px"
                onClick={() => setSelectedMedia(video)}
              >
                <video
                  width="100px"
                  height="120px"
                  style={{
                    objectFit: 'contain',
                    cursor: 'pointer',
                    border: selectedMedia === video ? '5px solid black' : '',
                  }}
                  key={key}
                  preload="metadata"
                >
                  <source
                    src={`${process.env.NEXT_PUBLIC_API_URL}/product/${video}#t=0.1`}
                  />
                </video>
              </Box>
            );
          })}
        {images.length > 0 &&
          images.map((image, key) => {
            return (
              <Box
                key={key}
                width="100px"
                height="120px"
                sx={{
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedMedia(image)}
              >
                <Box
                  component="img"
                  src={`${process.env.NEXT_PUBLIC_API_URL}/product/${image}`}
                  alt={image}
                  sx={{
                    objectFit: 'contain',
                    width: '100px',
                    height: '120px',
                    border: selectedMedia === image ? '5px solid black' : '',
                  }}
                  key={key}
                />
              </Box>
            );
          })}
      </Stack>
      <Stack flexBasis="80%">
        <When condition={selectedMedia.includes('images')}>
          <Box
            component="img"
            src={`${process.env.NEXT_PUBLIC_API_URL}/product/${selectedMedia}`}
            alt={selectedMedia}
            sx={{
              objectFit: 'contain',
              width: '100%',
              height: '100%',
              maxHeight: { xs: '350px', md: '600px' },
            }}
            key={selectedMedia}
          />
        </When>

        <When condition={selectedMedia.includes('videos')}>
          <video
            width="100px"
            height="120px"
            style={{
              objectFit: 'contain',
              cursor: 'pointer',
              height: '100%',
              width: '100%',
              maxHeight: '450px',
            }}
            // autoPlay
            playsInline
            controls
            preload="metadata"
            key={selectedMedia}
          >
            <source
              src={`${process.env.NEXT_PUBLIC_API_URL}/product/${selectedMedia}#t=0.1`}
            />
          </video>
        </When>
      </Stack>
      <ArrowDownwardRounded
        sx={{
          position: 'absolute',
          bottom: { xs: -30, md: -60 },
          left: 40,
          color: (theme) => theme.color.black.primary,
        }}
      />
    </Stack>
  );
};

export default Gallery;
