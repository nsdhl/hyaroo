import { ICategory, IWishListRepsonse, IProduct, IRating } from '@/types/types';

import ProductListInterface from '@/app/components/ProductListInterface';
import ProductSection from './components/productSection';
import { useCookies } from '@/hooks/useCookies';
import { url } from '@/lib/axios';
import { generateQueryString } from '@/utils/encodeQueryParams';
import RecommendedProducts from './components/recommendedProducts';
// export async function generateStaticParams() {
//   let products: IProduct[] = await fetch(
//     `${process.env.API_URL}/api/product/?limit=12`)
//     .then(res => res.json())

//   return products.map((product) => {
//     return {
//       id: product._id,
//       name: product.name
//     }
//   })
// }

async function getCategories(): Promise<ICategory[]> {
  const res = await fetch(`${process.env.API_URL}/api/app-feature/category`);

  if (!res.ok) {
    throw new Error("Can't retreive data. Try again later!");
  }

  return res.json();
}



export default async function ProductDetailPage({
  params,
}: {
  params: { id: string; name: string };
}) {
  const { id } = params;
  const categoryList = await getCategories();
  const product: IProduct = await fetch(
    `${process.env.API_URL}/api/product/${id}`,
    {
      next: {
        revalidate: 0,
      },
    },
  ).then((res) => {
    return res.json();
  });
  const token = useCookies();

  const deliveryResponse = await fetch(`${process.env.API_URL}/api/user/delivery-address`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }).then(res => res.json())

  let wishListResponse: IWishListRepsonse | undefined;
  const wishlist = async () => {

    if (token) {
      wishListResponse = await fetch(
        `${process.env.API_URL}/api/wishlist?productId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          next: {
            revalidate: 0,
          },
        },
      ).then((res) => {
        return res.json();
      });

    }
  };
  wishlist();

  const productComments: IRating[] = await fetch(
    `${process.env.API_URL}/api/rating/${id}`,
    {
      next: {
        revalidate: 0,
      },
    },
  ).then((res) => {
    return res.json();
  });
  function cosineSimilarity(product1: IProduct, product2: IProduct): number {
    const attributes = [
      'name',
      'description',
      'variants.title',
      'user.name',
      'categories.name',
    ];
  
    const uniqueAttributes = [
      ...new Set(attributes.flatMap((attr) => attr.split('.'))),
    ];
  
    const vector1 = uniqueAttributes.map((attr) => {
      const value1 = getNestedValue(product1, attr);
      return value1 ? 1 : 0;
    });
  
    const vector2 = uniqueAttributes.map((attr) => {
      const value2 = getNestedValue(product2, attr);
      return value2 ? 1 : 0;
    });
  
    const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
    const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val ** 2, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val ** 2, 0));
  
    return dotProduct / (magnitude1 * magnitude2);
  }
  
  function getNestedValue(obj: any, path: string): any {
    const parts = path.split('.');
    let value = obj;
    for (const part of parts) {
      value = value?.[part];
    }
    return value;
  }
  
  const recommendedProducts = async (
    product: IProduct,
    categories: ICategory[],
    mainProductId: string
  ): Promise<IProduct[]> => {
    const categoryListString = categories?.map((el) => el._id);
  
    // Fetch products from the API
    const { data } = await url.get<{ products: IProduct[] }>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product?limit=100&${generateQueryString(
        'categories',
        categoryListString
      )}`
    );
  
    // Filter products based on cosine similarity and exclude the main product
    const similarProducts = data.products.filter((p: IProduct) => {
      return (
        p._id !== mainProductId && cosineSimilarity(product, p) > 0.9
      );
    });
  
    return similarProducts;
  };

  return (
    <>
      <ProductSection
        product={product}
        productComments={productComments}
        fav={wishListResponse}
        deliveryAddress={deliveryResponse.deliveryAddress}
      />
      <RecommendedProducts recommendedProducts={await recommendedProducts(product,product.categories, product._id)} />
    </>
  );
}
