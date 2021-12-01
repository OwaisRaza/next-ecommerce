import NextLink from "next/link";
import {
  AppBar,
  Badge,
  Button,
  Container,
  Link,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Head from "next/head";
import useStyles from "../utils/style";
import { useContext, useState } from "react";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const Layout = ({ title, description, children }) => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: "1.6rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
      h2: {
        fontSize: "1.4rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
    },
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: "#f0c000",
      },
      secondary: {
        main: "#208080",
      },
    },
  });
  const classes = useStyles();

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? "DARK_MODE_OFF" : "DARK_MODE_ON" });
    const newDarkMode = !darkMode;
    Cookies.set("darkMode", newDarkMode ? "ON" : "OFF");
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Cookies.remove("cartItems");
    Cookies.remove("shippingAddress");
    Cookies.remove("paymentMethod");
    router.push("/");
  };

  return (
    <div>
      <Head>
        <title>{title ? `${title} - Next ECommerce` : "Next ECommerce"}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className={classes.navbar}>
          <Toolbar>
            <NextLink href="/" passHref>
              <Link>
                <Typography className={classes.brand}>NextCommerce</Typography>
              </Link>
            </NextLink>
            <div className={classes.grow}></div>
            <Switch
              checked={darkMode}
              onChange={darkModeChangeHandler}
            ></Switch>
            <NextLink href="/cart" passHref>
              <Link>
                {cart.cartItems.length > 0 ? (
                  <Badge color="secondary" badgeContent={cart.cartItems.length}>
                    Cart
                  </Badge>
                ) : (
                  "Cart"
                )}
              </Link>
            </NextLink>
            {userInfo ? (
              <>
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={loginClickHandler}
                >
                  {userInfo.username}
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                  <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <NextLink href="/login" passHref>
                <Link>
                  <Typography>Login</Typography>
                </Link>
              </NextLink>
            )}
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Typography>All rights reserved. Ovais Raza </Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
};

export default Layout;
