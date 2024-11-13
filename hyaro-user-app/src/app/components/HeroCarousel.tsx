'use client';

import { Stack, Box } from '@mui/material';
import ImageCarousel from '@/components/carousel/ImageCarousel';
import VideoCarousel from '@/components/carousel/VideoCarousel';
import { useRouter } from 'next/navigation';

const HeroCarousel = ({ images, videos }: any) => {
  const router = useRouter();
  return (
    <Stack
      justifyContent="space-between"
      sx={{
        flexDirection: { xs: 'column', md: 'row' },
        rowGap: '1.5rem',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '48%' },
        }}
      >
        <ImageCarousel
          images={images.map(
            (el: { image: string }) =>
              `${process.env.NEXT_PUBLIC_API_URL}/carousel/${el.image}`,
          )}
        />
      </Box>
      <Box
        sx={{
          width: { xs: '100%', md: '48%' },
        }}
      >
        <VideoCarousel
          videos={videos}
          handleOnClick={(video) => {
            router.push(
              `/product/${video.productId._id}/${video.productId.name.replaceAll(' ', '-')}`,
            );
          }}
        />
      </Box>
    </Stack>
  );
};

export default HeroCarousel;
