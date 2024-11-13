'use client';

import { IVideo } from '@/types/types';
import { PlayCircle } from '@mui/icons-material';
import { Box, Fade, Stack, Typography } from '@mui/material';
import { FC, MutableRefObject, useRef, MouseEvent, useState } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';

interface IVideoCarousel {
  videos: IVideo[];
  handleOnClick: (video: IVideo) => void;
}

const VideoCarousel: FC<IVideoCarousel> = ({ videos, handleOnClick }) => {
  const ref = useRef<HTMLDivElement>() as MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(ref);

  const [playedVideo, setPlayedVideo] = useState<
    HTMLVideoElement | undefined
  >();
  const [playedVideoIndex, setPlayedVideoIndex] = useState<
    number | undefined
  >();

  const playVideo = (e: MouseEvent<HTMLVideoElement>, ind: number) => {
    if (playedVideo === e.currentTarget) {
      e.currentTarget.pause();
      setPlayedVideo(undefined);
      setPlayedVideoIndex(undefined);
      return;
    }
    playedVideo?.pause();
    setPlayedVideo(e.currentTarget);
    setPlayedVideoIndex(ind);
    e.currentTarget.play();
  };

  return (
    <Stack
      direction="row"
      sx={{
        overflowX: 'scroll',
        columnGap: '1.5rem',
        overflowY: 'hidden',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
      {...events}
      ref={ref}
    >
      {videos.map((el, key) => {
        return (
          <Box
            key={key}
            sx={{
              position: 'relative',
            }}
          >
            <>
              <video
                width="190"
                height="310px"
                style={{
                  objectFit: 'cover',
                  borderRadius: '16px',
                  cursor: 'pointer',
                }}
                playsInline
                preload="metadata"
                onClick={(e) => playVideo(e, key)}
              >
                <source
                  src={`${process.env.NEXT_PUBLIC_API_URL}/carousel/${el.video}#t=0.1`}
                />
              </video>
              <Fade in={!(playedVideoIndex === key)}>
                <PlayCircle
                  fontSize="large"
                  sx={{
                    position: 'absolute',
                    top: '48%',
                    left: '48%',
                    transfer: 'translate(-50%, -50%)',
                    color: '#fff',
                    pointerEvents: 'none',
                  }}
                />
              </Fade>

              <Box
                onClick={() => handleOnClick(el)}
                sx={{
                  position: 'absolute',
                  top: '3%',
                  left: '60%',
                  transfer: 'translate(-50%, -50%)',
                  color: '#000',
                  cursor: 'pointer',
                  fontSize: '12px',
                  bgcolor: '#fff',
                  p: '2px 5px',
                  opacity: 0.6,
                }}
              >
                <Typography variant="subtitle1" fontWeight={700}>
                  BUY NOW
                </Typography>
              </Box>
            </>
          </Box>
        );
      })}
    </Stack>
  );
};

export default VideoCarousel;
