import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@material-ui/core";
import NextLink from "next/link";
import Layout from "../components/Layout";

export const getServerSideProps = async () => {
  const res = await fetch("https://dummyjson.com/products");
  const data = await res.json();

  return {
    props: { products: data.products },
  };
};

const Home = ({ products }) => {
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.id}>
              <Card>
                <NextLink href={`/product/${product.id}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.images[0]}
                      title={product.title}
                      height="230px"
                    ></CardMedia>
                    <CardContent>
                      <Typography>{product.title}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button size="small" color="primary">
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
};

export default Home;
