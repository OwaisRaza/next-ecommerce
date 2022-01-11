import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useReducer } from "react";
import Layout from "../components/Layout";
import { getError } from "../utils/error";
import { Store } from "../utils/Store";
import NextLink from "next/link";
import useStyles from "../utils/style";
import { dateFormat } from "../utils/dateFormat";
import Skeleton from "@material-ui/lab/Skeleton";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function OrderHistory() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();
  const classes = useStyles();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    orders: [],
  });

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    const fetchOrders = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/history`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);

  return (
    <Layout title="Order History">
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        <Grid item md={9} xs={12} className={classes.mt40}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Order History
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <TableContainer>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                  </TableContainer>
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>DATE</TableCell>
                          <TableCell>TOTAL</TableCell>
                          <TableCell>PAID</TableCell>
                          <TableCell>DELIVERED</TableCell>
                          <TableCell>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(20, 24)}</TableCell>
                            <TableCell>{dateFormat(order.createdAt)}</TableCell>
                            <TableCell>Rs:{order.totalPrice}</TableCell>
                            <TableCell>
                              {order.isPaid
                                ? `paid at ${dateFormat(order.paidAt)}`
                                : "not paid"}
                            </TableCell>
                            <TableCell>
                              {order.isDelivered
                                ? `delivered at ${dateFormat(
                                    order.deliveredAt
                                  )}`
                                : "not delivered"}
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/order/${order._id}`} passHref>
                                <Button variant="contained" color="primary">
                                  Details
                                </Button>
                              </NextLink>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
