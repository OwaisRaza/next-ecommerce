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
  Select,
  MenuItem,
  Button,
  Card,
  List,
  ListItem,
} from "@material-ui/core";
import { useContext } from "react";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import NextLink from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = (item, quantity) => {
    if (item.currentInStock <= 0) {
      window.alert("Sorry Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
  };

  const removeCartHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const checkOutHandler = () => {
    router.push("/shipping");
  };

  return (
    <Layout title="Shopping Cart">
      <Typography component="h1" variant="h1">
        Shopping Cart
      </Typography>
      {cartItems?.length === 0 ? (
        <div>
          Cart is empty.
          <NextLink href="/" passHref>
            <Link>Go shopping</Link>
          </NextLink>
        </div>
      ) : (
        <div>
          <Grid container spacing={1}>
            <Grid item md={9} xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <NextLink href={`/product/${item.slug}`} passHref>
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
                          <NextLink href={`/product/${item.slug}`} passHref>
                            <Link>
                              <Typography>{item.title}</Typography>
                            </Link>
                          </NextLink>
                        </TableCell>
                        <TableCell align="right">
                          <Select
                            value={item.quantity}
                            onChange={(e) =>
                              updateCartHandler(item, e.target.value)
                            }
                          >
                            {[...Array(item.currentInStock).keys()].map((x) => (
                              <MenuItem key={x + 1} value={x + 1}>
                                {x + 1}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell align="right">
                          <Typography>${item.price}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => removeCartHandler(item)}
                          >
                            x
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item md={3} xs={12}>
              <Card>
                <List>
                  <ListItem>
                    <Typography variant="h2">
                      Subtotal ({cartItems.reduce((a, b) => a + b.quantity, 0)}{" "}
                      items) : ${" "}
                      {cartItems.reduce((a, b) => a + b.quantity * b.price, 0)}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={checkOutHandler}
                    >
                      Check Out
                    </Button>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
