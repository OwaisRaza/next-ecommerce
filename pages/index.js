import { Grid } from "@material-ui/core";
import Layout from "../components/Layout";
import { useContext } from "react";
import { Store } from "../utils/Store";
import db from "../utils/db";
import Product from "../models/Product";
import { useSnackbar } from "notistack-next";
import ProductItem from "../components/ProductItem";
import Skeleton from "@material-ui/lab/Skeleton";
import { useEffect } from "react";
import { useState } from "react";

const Home = ({ products }) => {
  const { state, dispatch } = useContext(Store);
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

  const [skeletonData, setSkeletonData] = useState([]);

  useEffect(() => {
    const fillData = new Array(6)
      .fill(undefined)
      .map(() => ({ id: 1 + Math.random() }));
    setSkeletonData(fillData);
  }, []);

  return (
    <Layout title="Home" carousel={true}>
      <div>
        <h1>Products</h1>
        {!products ? (
          <Grid container spacing={3}>
            {skeletonData.map((data) => (
              <Grid item md={4} key={data.id}>
                <Skeleton variant="rect" height={250} />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item md={4} key={product._id}>
                <ProductItem
                  product={product}
                  addToCartHandler={addToCartHandler}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();

  return {
    props: { products: products.map(db.convertDocToObj) },
  };
}

export default Home;
