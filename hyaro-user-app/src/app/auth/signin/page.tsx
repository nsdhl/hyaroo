import { Stack } from '@mui/material';
import Signin from '../components/Signin';

export default async function SignIn() {
  return (
    <Stack direction="row" justifyContent="center" minHeight="70vh">
      <Signin />
    </Stack>
  );
}
