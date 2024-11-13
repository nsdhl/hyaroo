import { Dialog, Stack, Typography } from '@mui/material';
import BasicInput from '../inputs/BasicInput';
import { BuyButton2 } from '../buttons/BuyButton';
import { useState } from 'react';

interface IUpdatePasswordCard {
  open: boolean;
  handleUpdatePassword: (password: {
    password: string;
    confirmPassword: string;
  }) => void;
}

const UpdatePasswordCard = ({
  open,
  handleUpdatePassword,
}: IUpdatePasswordCard) => {
  const [password, setPassword] = useState<{
    password: string;
    confirmPassword: string;
  }>({
    password: '',
    confirmPassword: '',
  });

  return (
    <Dialog open={open}>
      <Stack
        direction="column"
        rowGap="1.3em"
        sx={{
          padding: '2em',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">Update Your Password</Typography>
        <Typography variant="caption">
          An account is already created for you using the phone number you
          provided just before. Please update your password so that you can
          always access your account.
        </Typography>

        <BasicInput
          label="Password"
          variant="outlined"
          type="password"
          getText={(data) => {
            setPassword((prev) => ({ ...prev, password: data }));
          }}
        />

        <BasicInput
          label="Confirm Password"
          variant="outlined"
          type="password"
          getText={(data) => {
            setPassword((prev) => ({ ...prev, confirmPassword: data }));
          }}
        />

        <BuyButton2 onClick={() => handleUpdatePassword(password)}>
          Confirm
        </BuyButton2>
      </Stack>
    </Dialog>
  );
};

export default UpdatePasswordCard;
