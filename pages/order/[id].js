import {
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Card,
  List,
  ListItem,
  Button,
} from "@material-ui/core";
import { useContext, useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { Store } from "../../utils/Store";
import NextLink from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import useStyles from "../../utils/style";
import axios from "axios";
import { getError } from "../../utils/error";
import Skeleton from "@material-ui/lab/Skeleton";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function Order({ params }) {
  const orderId = params.id;
  const classes = useStyles();
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    order: {},
  });

  const {
    shippingAddress,
    shippingPrice,
    taxPrice,
    itemsPrice,
    orderItems,
    totalPrice,
    paymentMethod,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order]);

  const goBackHandler = () => {
    router.push("/");
  };

  return (
    <Layout title={`Order ${orderId}`}>
      {loading ? (
        <div>
          <Typography component="h1" variant="h1">
            <Skeleton variant="h1" width="100%" height={40} />
          </Typography>
          <Grid container spacing={1}>
            <Grid item md={9} xs={12}>
              <Skeleton variant="rect" width="100%" height={150} />
              <Skeleton
                variant="rect"
                width="100%"
                height={150}
                style={{ marginTop: 8 }}
              />
              <Skeleton
                variant="rect"
                width="100%"
                height={150}
                style={{ marginTop: 8 }}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Skeleton variant="rect" width="100%" height={250} />
              <Skeleton
                variant="rect"
                width="100%"
                height={40}
                style={{ marginTop: 8 }}
              />
            </Grid>
          </Grid>
        </div>
      ) : error ? (
        <Typography className={classes.error}>{error}</Typography>
      ) : (
        <div>
          <Typography component="h1" variant="h1">
            Order {orderId}
          </Typography>
          <Grid container spacing={1}>
            <Grid item md={9} xs={12}>
              <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography variant="h2">Shipping Address</Typography>
                  </ListItem>
                  <ListItem>
                    {shippingAddress?.fullName}, {shippingAddress?.address},{" "}
                    {shippingAddress?.city}, {shippingAddress?.postalCode},{" "}
                    {shippingAddress?.country}
                  </ListItem>
                  <ListItem>
                    Status:{" "}
                    {isDelivered
                      ? `delivered at ${deliveredAt}`
                      : "not delivered"}
                  </ListItem>
                </List>
              </Card>
              <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography variant="h2">Payment Method</Typography>
                  </ListItem>
                  <ListItem>{paymentMethod}</ListItem>
                  <ListItem>
                    Status: {isPaid ? `paid at ${paidAt}` : "not paid"}
                  </ListItem>
                </List>
              </Card>
              <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography component="h2" variant="h2">
                      Order Items
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orderItems?.map((item) => (
                            <TableRow key={item._id}>
                              <TableCell>
                                <NextLink
                                  href={`/product/${item.slug}`}
                                  passHref
                                >
                                  <Link>
                                    <Image
                                      src={item.img}
                                      alt={item.title}
                                      width={100}
                                      height={60}
                                    ></Image>
                                  </Link>
                                </NextLink>
                              </TableCell>
                              <TableCell>
                                <NextLink
                                  href={`/product/${item.slug}`}
                                  passHref
                                >
                                  <Link>
                                    <Typography>{item.title}</Typography>
                                  </Link>
                                </NextLink>
                              </TableCell>
                              <TableCell align="right">
                                <Typography>{item.quantity}</Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography>Rs:{item.price}</Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </ListItem>
                </List>
              </Card>
            </Grid>
            <Grid item md={3} xs={12}>
              <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography variant="h2">Order Summary</Typography>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Items:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">Rs:{itemsPrice}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Tax:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">Rs:{taxPrice}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Shipping:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                          Rs:{shippingPrice}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>
                          <strong>Total:</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                          <strong>Rs:{totalPrice}</strong>
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                </List>
              </Card>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={goBackHandler}
              >
                Go Back To Home
              </Button>
            </Grid>
          </Grid>
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });
