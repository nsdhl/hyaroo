import ProductCard from "@/components/cards/ProductCard";
import { IFeaturedProduct } from "@/types/types";
import { Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export default function FeaturedProducts({ featuredProducts }: { featuredProducts: IFeaturedProduct[] }) {
  return (
    <>
      {featuredProducts && featuredProducts.length > 0 && (
        <Grid2
          container
          rowSpacing={4}
          sx={{
            width: '100%',
            p: '2.5em 0em',
          }}
        >
          <Grid2 xs={12} sx={{
            padding: { xs: '0px 20px', md: '0px' }
          }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '18px', md: '28px' },
              }}
            >
              Like Store Selected Products
            </Typography>
          </Grid2>
          {featuredProducts.map((product, key) => {
            return (
              <Grid2
                lg={2}
                md={3}
                sm={4}
                xs={6}
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'unset' },
                }}
                key={key}
              >
                <ProductCard product={product} key={key} />
              </Grid2>
            );
          })}
        </Grid2>
      )}
    </>
  )
}
