import { CardGiftcardSharp } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';

const GiftNow = () => {
  return (
    <Stack
      direction="row"
      columnGap="6px"
      sx={{
        cursor: 'pointer',
      }}
    >
      <Typography variant="subtitle1" alignSelf="flex-end">
        GIFT NOW
      </Typography>
      <CardGiftcardSharp fontSize="small" />
    </Stack>
  );
};

export default GiftNow;
