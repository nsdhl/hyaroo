import { Stack } from '@mui/material';
import Signup from '../components/Signup';
import Signin from '../components/Signin';

export default async function SignUp() {
  return (
    //  change later: Only signup should be here but for now including them both
    // direction="row" and no alignItems="center" originally. remove them while removing signin
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="90vh"
    >
      <Signup />
      <Signin />
    </Stack>
  );
}
