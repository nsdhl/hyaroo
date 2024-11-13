'use client';
import { IRating } from '@/types/types';
import { Stack, Typography, Rating, Divider } from '@mui/material';

const ReviewsCard = ({ comment }: { comment: IRating }) => {
  return (
    <Stack direction="column" rowGap={'5px'}>
      <Typography variant="body2">{comment.userId.fullName}</Typography>
      <Rating value={comment.rating} readOnly />
      <Typography variant="body1">{comment.comment}</Typography>
      <Divider flexItem />
    </Stack>
  );
};

export default ReviewsCard;
