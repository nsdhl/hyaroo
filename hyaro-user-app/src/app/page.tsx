import { Box } from '@mui/material';
import HeroCarousel from './components/HeroCarousel';
import ProductListInterface from './components/ProductListInterface';
import FeaturedProducts from './components/FeaturedProducts';
import { ICategory, IAnnouncement, IFeaturedProduct } from '@/types/types';

async function getCarouselImage() {
  const res = await fetch(`${process.env.API_URL}/api/app-feature/img`, {
    next: {
      revalidate: 3600,
    },  
  });

  if (!res.ok) {
    console.log('Issues fetching carousel images!');
  }

  return res.json();
}

async function getCarouselVideo() {
  const res = await fetch(`${process.env.API_URL}/api/app-feature/vid`, {
    next: {
      revalidate: 3600,
    },
  });

  if (!res.ok) {
    console.log('Issues fetching carousel videos!');
  }

  return res.json();
}

// async function getProducts() {
//   const res = await fetch(`${process.env.API_URL}/api/product?limit=12`, {
//     next: { revalidate: 60 }
//   })

//   if (!res.ok) {
//     throw new Error("Issues fetching products!")
//   }

//   const productResponse = await res.json()

//   return productResponse.products

// }

async function getCategories(): Promise<ICategory[]> {
  const res = await fetch(`${process.env.API_URL}/api/app-feature/category`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error("Can't retreive data. Try again later!");
  }

  return res.json();
}

async function getFeaturedProducts(): Promise<IFeaturedProduct[]> {
  const res = await fetch(`${process.env.API_URL}/api/product/featured`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error("Can't retreive data. Try again later!");
  }

  const data: { products: IFeaturedProduct[] } = await res.json();
  return data.products;
}


async function getAnnouncement(): Promise<IAnnouncement | undefined> {
  const res = await fetch(
    `${process.env.API_URL}/api/app-feature/announcements`,
    {
      cache: 'no-cache',
      method: 'GET',
    },
  );

  if (!res.ok) {
    throw new Error("Can't retreive announcements. Try again later!");
  }

  const announcementResponse: { announcements: IAnnouncement[] } =
    await res.json();

  const announcement = announcementResponse.announcements.find(
    (announcement) => !announcement.isDeleted,
  );

  return announcement;
}

export default async function Home() {
  // const products = await getProducts()
  const [images, videos, categoryList, featuredProducts, announcement] = await Promise.all([
    getCarouselImage(),
    getCarouselVideo(),
    getCategories(),
    getFeaturedProducts(),
    getAnnouncement()
  ]);
  return (
    <Box width="100%">
      <Box
        sx={{
          width: { xs: '100%', md: '90%' },
          margin: '0 auto',
          minHeight: '70vh',
        }}
      >
        <HeroCarousel images={images} videos={videos} />


        <ProductListInterface categoryList={categoryList} announcement={announcement}>
          <FeaturedProducts featuredProducts={featuredProducts} />
        </ProductListInterface>

      </Box>
      {/* <SellWithUs /> */}
    </Box>
  );
}
