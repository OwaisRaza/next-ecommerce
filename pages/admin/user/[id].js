import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useContext, useReducer, useState } from "react";
import {
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  TextField,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { getError } from "../../../utils/error";
import { Store } from "../../../utils/Store";
import Layout from "../../../components/Layout";
import useStyles from "../../../utils/style";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack-next";
import Skeleton from "@material-ui/lab/Skeleton";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    default:
      return state;
  }
}

function UserEdit({ params }) {
  const userId = params.id;
  const { state } = useContext(Store);
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const [isAdmin, setIsAdmin] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      return router.push("/login");
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: "FETCH_REQUEST" });
          const { data } = await axios.get(`/api/admin/users/${userId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setIsAdmin(data.isAdmin);
          setValue("username", data.username);
          dispatch({ type: "FETCH_SUCCESS" });
        } catch (err) {
          dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);

  const submitHandler = async ({ username }) => {
    closeSnackbar();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/admin/users/${userId}`,
        {
          username,
          isAdmin,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      enqueueSnackbar("User updated successfully", { variant: "success" });
      router.push("/admin/users");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  return (
    <Layout title={`Edit User ${userId}`} isAdmin={true}>
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        <Grid item xs={10}>
          <Card className={classes.section}>
            <List>
              {loading ? (
                <div>
                  <ListItem component="h1" variant="h1">
                    <Skeleton variant="h1" width="100%" height={40} />
                  </ListItem>
                  <div className={classes.form}>
                    <ListItem>
                      <Skeleton variant="rect" width="100%" height={50} />
                    </ListItem>
                    <ListItem>
                      <Skeleton variant="rect" width={150} height={30} />
                    </ListItem>
                    <ListItem>
                      <Skeleton variant="rect" width="100%" height={40} />
                    </ListItem>
                  </div>
                </div>
              ) : error ? (
                <Typography className={classes.error}>{error}</Typography>
              ) : (
                <div>
                  <ListItem>
                    <Typography component="h1" variant="h1">
                      Edit User {userId}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <form
                      onSubmit={handleSubmit(submitHandler)}
                      className={classes.form}
                    >
                      <List>
                        <ListItem>
                          <Controller
                            name="username"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="username"
                                label="User Name"
                                disabled={loadingUpdate}
                                error={Boolean(errors.username)}
                                helperText={
                                  errors.username ? "username is required" : ""
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                        <ListItem>
                          <FormControlLabel
                            label="Is Admin"
                            control={
                              <Checkbox
                                onClick={(e) => setIsAdmin(e.target.checked)}
                                checked={isAdmin}
                                name="isAdmin"
                                disabled={loadingUpdate}
                              />
                            }
                          ></FormControlLabel>
                        </ListItem>
                        <ListItem>
                          <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            color="primary"
                            disabled={loadingUpdate}
                          >
                            Update
                          </Button>
                          {loadingUpdate && <CircularProgress />}
                        </ListItem>
                      </List>
                    </form>
                  </ListItem>
                </div>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(UserEdit), { ssr: false });
