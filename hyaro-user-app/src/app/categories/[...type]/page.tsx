import { ICategory, IUser } from '@/types/types';
import { Box, Stack, Typography } from '@mui/material';
import CategoryPageInterface from '../components/CategoryPageInterface';
import When from '@/components/hoc/When';

async function getCategories(): Promise<ICategory[]> {
  const res = await fetch(`${process.env.API_URL}/api/app-feature/category`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error("Can't retreive data. Try again later!");
  }

  return res.json();
}

//here in getUsers, user refer to vendors and suppliers
async function getUsers(type: string): Promise<IUser[]> {
  const res = await fetch(
    `${process.env.API_URL}/api/user?type=${type}&showOnlyVerified=true`,
    {
      next: { revalidate: 30 },
    },
  );

  if (!res.ok) {
    throw new Error("Can't retreive data. Try again later!");
  }

  return res.json();
}

export default async function CategoriesPage({
  params,
}: {
  params: { type: string };
}) {
  let list: any = [];
  //type = product | vendor | supplier
  const { type } = params;

  if (type[0] === 'product' || type[0] === 'search') {
    list = await getCategories();
  }

  if (type[0] === 'vendor') {
    list = await getUsers('vendor');
  }

  if (type[0] === 'supplier') {
    list = await getUsers('supplier');
  }

  return (
    <Box width="100%" minHeight="70vh">
      <Stack
        direction="column"
        sx={{
          width: { xs: '96%', md: '90%' },
          margin: '0 auto',
        }}
      >
        <When condition={type[0] !== 'supplier'}>
          <Typography variant="h2" sx={{}}>
            Shop by{' '}
            {type[0] === 'product'
              ? 'Categories'
              : type[0] === 'vendor'
                ? 'Vendors'
                : 'Categories'}
          </Typography>
        </When>

        <When condition={type[0] === 'supplier'}>
          <Typography variant="h2" sx={{}}>
            Buy in Wholesale
          </Typography>
        </When>

        <CategoryPageInterface
          categories={list}
          displayField={
            type[0] === 'product'
              ? 'category'
              : type[0] === 'vendor'
                ? 'fullName'
                : type[0] === 'supplier'
                  ? 'fullName'
                  : 'category'
          }
          type={
            type[0] === 'product'
              ? 'product'
              : type[0] === 'vendor'
                ? 'vendor'
                : type[0] === 'supplier'
                  ? 'supplier'
                  : type[0] === 'search'
                    ? 'product'
                    : 'category'
          }
          searchKeyword={type[0] === 'search' ? type[1] : ''}
        />
      </Stack>
    </Box>
  );
}
