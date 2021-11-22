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

export const getServerSideProps = async (context) => {
  const id = context.params.id;
  const res = await fetch("https://dummyjson.com/products/" + id);
  const data = await res.json();

  return {
    props: { product: data },
  };
};

const ProductDetails = ({ product }) => {
  const classes = useStyles();
  const { dispatch } = useContext(Store);

  const onAddCartHandler = () => {
    if (product.stock <= 0) {
      window.alert("Sorry Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity: 1 } });
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
            src={product.images[0]}
            alt={product.title}
            width={400}
            height={300}
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
                    <Typography>${product.price}</Typography>
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
                      {product.stock > 0 ? "In stock" : "Unavailable"}
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
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ProductDetails;
