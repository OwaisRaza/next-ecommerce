import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import Layout from "../components/Layout";
import useStyles from "../utils/style";
import NextLink from "next/link";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const classes = useStyles();
  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, []);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("https://dummyjson.com/auth/login", {
        username,
        password,
      });
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", JSON.stringify(data));
      router.push(redirect || "/");
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <Layout>
      <form onSubmit={submitHandler} className={classes.form}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        <List>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="username"
              label="User Name"
              inputProps={{ type: "text" }}
              onChange={(e) => setUsername(e.target.value)}
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="password"
              label="Password"
              inputProps={{ type: "password" }}
              onChange={(e) => setPassword(e.target.value)}
            ></TextField>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Login
            </Button>
          </ListItem>
          <ListItem>
            Don't have an account? &nbsp;
            <NextLink href="/register" passHref>
              <Link> Register </Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
