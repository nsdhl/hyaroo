'use client';
import {
  AppBar,
  Container,
  Grid,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { IAnnouncement } from '@/types/types';
import Link from 'next/link';

export default function Announcement({ data }: { data: IAnnouncement }) {
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {open && (
        <AppBar
          position="sticky"
          color="primary"
          sx={{
            top: 0,
            zIndex: 10,
            background: (theme) => theme.color.gray.primary,
          }}
        >
          <Container maxWidth="lg" sx={{}}>
            <Toolbar disableGutters>
              <Grid container>
                <Grid item xs={11}>
                  <Stack>
                    <Typography
                      variant="h6"
                      color="inherit"
                      component="div"
                      sx={{ flexGrow: 1 }}
                    >
                      🎉{data.title}
                    </Typography>
                    <Typography variant="body1" color="inherit" component="div">
                      {data.description + ' '}
                      {data.productId && (
                        <Typography
                          variant="body1"
                          color="inherit"
                          component="span"
                        >
                          Click{' '}
                          <Typography
                            variant="body1"
                            color="blue"
                            sx={{ ':hover': { textDecoration: 'underline' } }}
                            component="span"
                          >
                            <Link href={`/product/${data.productId._id}/${encodeURI(data.productId.name)}`}>
                              here
                            </Link>
                          </Typography>{' '}
                          to view the product.
                        </Typography>
                      )}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    size="small"
                    onClick={handleClose}
                    aria-label="close"
                    sx={{ position: 'absolute', right: 0 }}
                  >
                    <CloseIcon sx={{ color: '#fff' }} />
                  </IconButton>
                </Grid>
              </Grid>
            </Toolbar>
          </Container>
        </AppBar>
      )}
    </>
  );
}
