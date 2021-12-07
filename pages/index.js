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
import { useContext } from "react";
import { Store } from "../utils/Store";
import useStyles from "../utils/style";
import db from "../utils/db";
import Product from "../models/Product";
import { useSnackbar } from "notistack-next";
import Rating from "material-ui-rating";

const Home = ({ products }) => {
  const { state, dispatch } = useContext(Store);
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const addToCartHandler = (product) => {
    closeSnackbar();
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.currentInStock < quantity) {
      enqueueSnackbar("Sorry Product is out of stock", { variant: "error" });
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
  };

  return (
    <Layout title="Home" carousel={true}>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product._id}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      className={classes.img}
                      component="img"
                      image={product.img}
                      title={product.title}
                    ></CardMedia>
                    <CardContent>
                      <Typography>{product.title}</Typography>
                      <Rating value={product.rating} readOnly></Rating>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => addToCartHandler(product)}
                  >
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

export async function getServerSideProps() {
  // const res = await fetch("https://dummyjson.com/products");
  // const data = await res.json();
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();

  return {
    props: { products: products.map(db.convertDocToObj) },
  };
}

export default Home;
