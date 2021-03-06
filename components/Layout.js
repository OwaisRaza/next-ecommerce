import NextLink from "next/link";
import {
  AppBar,
  Badge,
  Button,
  Container,
  Drawer,
  Link,
  List,
  ListItem,
  ListItemText,
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
import CarouselView from "./Carousel";

const Layout = ({ title, description, children, carousel, isAdmin }) => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo, selectedIndex } = state;
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
        main: "#009688",
      },
      // secondary: {
      //   main: "#41b883",
      // },
    },
  });
  const classes = useStyles();

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? "DARK_MODE_OFF" : "DARK_MODE_ON" });
    const newDarkMode = !darkMode;
    Cookies.set("darkMode", newDarkMode ? "ON" : "OFF");
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleListItemClick = (e, index, redirect) => {
    dispatch({ type: "SELECTED_INDEX", payload: index });
    Cookies.set("selectedIndex", index);
    router.push(redirect);
  };

  const loginClickHandler = (e, redirect) => {
    setAnchorEl(e.currentTarget);
    if (redirect) {
      router.push(redirect);
    }
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
    Cookies.remove("selectedIndex");
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
        <AppBar position="sticky" className={classes.navbar}>
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
                  <MenuItem onClick={(e) => loginClickHandler(e, "/profile")}>
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => loginClickHandler(e, "/order-history")}
                  >
                    Order History
                  </MenuItem>
                  {userInfo.isAdmin && (
                    <MenuItem
                      onClick={(e) =>
                        handleListItemClick(e, 0, "/admin/dashboard")
                      }
                    >
                      Admin Dashboard
                    </MenuItem>
                  )}
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
        {carousel && <CarouselView />}
        {isAdmin ? (
          <div className={classes.root}>
            <Drawer
              className={classes.drawer}
              variant="permanent"
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <Toolbar />
              <div className={classes.drawerContainer}>
                <List>
                  <ListItem
                    button
                    selected={selectedIndex === 0}
                    onClick={(e) =>
                      handleListItemClick(e, 0, "/admin/dashboard")
                    }
                  >
                    <ListItemText primary="Admin Dashboard"></ListItemText>
                  </ListItem>
                  <ListItem
                    button
                    selected={selectedIndex === 1}
                    onClick={(e) => handleListItemClick(e, 1, "/admin/orders")}
                  >
                    <ListItemText primary="Orders"></ListItemText>
                  </ListItem>
                  <ListItem
                    button
                    selected={selectedIndex === 2}
                    onClick={(e) =>
                      handleListItemClick(e, 2, "/admin/products")
                    }
                  >
                    <ListItemText primary="Products"></ListItemText>
                  </ListItem>
                  <ListItem
                    button
                    selected={selectedIndex === 3}
                    onClick={(e) => handleListItemClick(e, 3, "/admin/users")}
                  >
                    <ListItemText primary="Users"></ListItemText>
                  </ListItem>
                </List>
              </div>
            </Drawer>
            <main className={classes.content}>{children}</main>
          </div>
        ) : (
          <Container className={classes.main}>{children}</Container>
        )}

        <footer className={classes.footer}>
          <Typography>All rights reserved. Next Commerce </Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
};

export default Layout;
