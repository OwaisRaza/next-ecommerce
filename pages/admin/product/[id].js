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
  FormControlLabel,
  Checkbox,
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
    case "UPLOAD_REQUEST":
      return { ...state, [action.payload]: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        [action.payload]: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return {
        ...state,
        [action.payload.loadingName]: false,
        errorUpload: action.payload.error,
      };

    default:
      return state;
  }
}

function ProductEdit({ params }) {
  const productId = params.id;
  const { state } = useContext(Store);
  const [
    { loading, error, loadingUpdate, loadingUpload, loadingFeature },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;
  const [isFeatured, setIsFeatured] = useState(false);
  const [skeletonData, setSkeletonData] = useState([]);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      return router.push("/login");
    } else {
      const fillData = new Array(11)
        .fill(undefined)
        .map(() => ({ id: 1 + Math.random() }));
      setSkeletonData(fillData);
      const fetchData = async () => {
        try {
          dispatch({ type: "FETCH_REQUEST" });
          const { data } = await axios.get(`/api/admin/products/${productId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          console.log("data", data);
          dispatch({ type: "FETCH_SUCCESS" });
          setValue("title", data.title);
          setValue("slug", data.slug);
          setValue("price", data.price);
          setValue("img", data.img);
          setValue("featuredImage", data.featuredImage);
          setIsFeatured(data.isFeatured);
          setValue("category", data.category);
          setValue("brand", data.brand);
          setValue("currentInStock", data.currentInStock);
          setValue("description", data.description);
          setValue("rating", data.rating);
        } catch (err) {
          dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);

  const uploadHandler = async (e, imageField = "img") => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    const loadingName =
      imageField === "img" ? "loadingUpload" : "loadingFeature";
    try {
      dispatch({ type: "UPLOAD_REQUEST", payload: loadingName });
      const { data } = await axios.post("/api/admin/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS", payload: loadingName });
      setValue(imageField, data.secure_url);
      enqueueSnackbar("File uploaded successfully", { variant: "success" });
    } catch (err) {
      dispatch({
        type: "UPLOAD_FAIL",
        payload: { loadingName: loadingName, error: getError(err) },
      });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  const submitHandler = async ({
    title,
    slug,
    price,
    category,
    img,
    featuredImage,
    brand,
    currentInStock,
    rating,
    description,
  }) => {
    closeSnackbar();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/admin/products/${productId}`,
        {
          title,
          slug,
          price,
          category,
          img,
          featuredImage,
          brand,
          currentInStock,
          isFeatured,
          rating,
          description,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      enqueueSnackbar("Product updated successfully", { variant: "success" });
      router.push("/admin/products");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  return (
    <Layout title={`Edit Product ${productId}`} isAdmin={true}>
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
                    {skeletonData.map((data) => (
                      <ListItem key={data.id}>
                        <Skeleton variant="h1" width="100%" height={50} />
                      </ListItem>
                    ))}
                  </div>
                </div>
              ) : error ? (
                <Typography className={classes.error}>{error}</Typography>
              ) : (
                <div>
                  <ListItem>
                    <Typography component="h1" variant="h1">
                      Edit Product {productId}
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
                            name="title"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="title"
                                label="Title"
                                disabled={loadingUpdate}
                                error={Boolean(errors.title)}
                                helperText={
                                  errors.title ? "title is required" : ""
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                        <ListItem>
                          <Controller
                            name="slug"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="slug"
                                label="Slug"
                                disabled={loadingUpdate}
                                error={Boolean(errors.slug)}
                                helperText={
                                  errors.slug ? "Slug is required" : ""
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                        <ListItem>
                          <Controller
                            name="price"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="price"
                                label="Price"
                                disabled={loadingUpdate}
                                error={Boolean(errors.price)}
                                helperText={
                                  errors.price ? "Price is required" : ""
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                        <ListItem>
                          <Controller
                            name="img"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="img"
                                label="Img"
                                disabled={loadingUpdate}
                                error={Boolean(errors.img)}
                                helperText={
                                  errors.img ? "Image is required" : ""
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                        <ListItem>
                          <Button
                            variant="contained"
                            component="label"
                            disabled={loadingUpdate}
                          >
                            Upload File
                            <input
                              type="file"
                              onChange={uploadHandler}
                              hidden
                            />
                          </Button>
                          {loadingUpload && <CircularProgress />}
                        </ListItem>
                        <ListItem>
                          <FormControlLabel
                            label="Is Featured"
                            control={
                              <Checkbox
                                onClick={(e) => setIsFeatured(e.target.checked)}
                                checked={isFeatured}
                                name="isFeatured"
                                disabled={loadingUpdate}
                              />
                            }
                          ></FormControlLabel>
                        </ListItem>
                        <ListItem>
                          <Controller
                            name="featuredImage"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="featuredImage"
                                label="Featured Image"
                                disabled={loadingUpdate}
                                error={Boolean(errors.featuredImage)}
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                        <ListItem>
                          <Button
                            variant="contained"
                            component="label"
                            disabled={loadingUpdate}
                          >
                            Upload File
                            <input
                              type="file"
                              onChange={(e) =>
                                uploadHandler(e, "featuredImage")
                              }
                              hidden
                            />
                          </Button>
                          {loadingFeature && <CircularProgress />}
                        </ListItem>
                        <ListItem>
                          <Controller
                            name="category"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="category"
                                label="Category"
                                disabled={loadingUpdate}
                                error={Boolean(errors.category)}
                                helperText={
                                  errors.category ? "Category is required" : ""
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                        <ListItem>
                          <Controller
                            name="brand"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="brand"
                                label="Brand"
                                disabled={loadingUpdate}
                                error={Boolean(errors.brand)}
                                helperText={
                                  errors.brand ? "Brand is required" : ""
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                        <ListItem>
                          <Controller
                            name="currentInStock"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                type="number"
                                id="currentInStock"
                                label="Current in stock"
                                disabled={loadingUpdate}
                                error={Boolean(errors.currentInStock)}
                                helperText={
                                  errors.currentInStock
                                    ? "Current in stock is required"
                                    : ""
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                        <ListItem>
                          <Controller
                            name="rating"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                              max: 5,
                            }}
                            render={({ field }) => (
                              <TextField
                                type="number"
                                variant="outlined"
                                fullWidth
                                id="rating"
                                label="Rating"
                                disabled={loadingUpdate}
                                error={Boolean(errors.rating)}
                                helperText={
                                  errors.rating
                                    ? errors.rating.type === "max"
                                      ? "Rating value is must be less than 5"
                                      : "Rating is required"
                                    : ""
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                        <ListItem>
                          <Controller
                            name="description"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                multiline
                                id="description"
                                label="Description"
                                disabled={loadingUpdate}
                                error={Boolean(errors.description)}
                                helperText={
                                  errors.description
                                    ? "Description is required"
                                    : ""
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
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

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
