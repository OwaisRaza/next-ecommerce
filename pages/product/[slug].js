import Layout from "../../components/Layout";
import NextLink from "next/link";
import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
import useStyles from "../../utils/style";
import Image from "next/image";
import { useContext } from "react";
import { Store } from "../../utils/Store";
import Product from "../../models/Product";
import db from "../../utils/db";
import { useSnackbar } from "notistack-next";

export async function getServerSideProps(context) {
  const slug = context.params.slug;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  return {
    props: { product: db.convertDocToObj(product) },
  };
}

const ProductDetails = ({ product }) => {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { state, dispatch } = useContext(Store);

  const onAddCartHandler = () => {
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
    <Layout title={product.title} description={product.description}>
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            <Typography>Back to product</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.img}
            alt={product.title}
            width={700}
            height={350}
            layout="responsive"
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">
                {product.title}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Rating: {product.rating} stars</Typography>
            </ListItem>
            <ListItem>
              <Typography>Description: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price: </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Rs:{product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status: </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {product.currentInStock > 0 ? "In stock" : "Unavailable"}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={onAddCartHandler}
                >
                  Add to cart
                </Button>
              </ListItem>
              <ListItem>
                <NextLink href="/cart" passHref>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={!state.cart.cartItems.length}
                  >
                    Go to checkout
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ProductDetails;
