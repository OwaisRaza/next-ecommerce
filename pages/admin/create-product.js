import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useContext, useReducer, useState } from "react";
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
import { getError } from "../../utils/error";
import { Store } from "../../utils/Store";
import useStyles from "../../utils/style";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack-next";
import dynamic from "next/dynamic";
import Layout from "../../components/Layout";

function reducer(state, action) {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      state;
  }
}

function CreateProduct() {
  const { state } = useContext(Store);
  const [{ loadingCreate, loadingUpload }, dispatch] = useReducer(reducer, {});
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

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      return router.push("/login");
    }
  }, []);

  const uploadHandler = async (e, imageField = "img") => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post("/api/admin/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      setValue(imageField, data.secure_url);
      enqueueSnackbar("File uploaded successfully", { variant: "success" });
    } catch (err) {
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
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
    console.log({
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
      isFeatured,
    });
    try {
      dispatch({ type: "CREATE_REQUEST" });
      await axios.post(
        `/api/admin/products`,
        {
          title,
          slug,
          price,
          category,
          img,
          isFeatured,
          featuredImage,
          brand,
          currentInStock,
          rating,
          description,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "CREATE_SUCCESS" });
      enqueueSnackbar("Product updated successfully", { variant: "success" });
      router.push("/admin/products");
    } catch (err) {
      dispatch({ type: "CREATE_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  const [isFeatured, setIsFeatured] = useState(false);

  return (
    <Layout title={`Create Product`} isAdmin={true}>
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        <Grid item xs={10}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Create Product
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
                            disabled={loadingCreate}
                            error={Boolean(errors.title)}
                            helperText={errors.title ? "title is required" : ""}
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
                            disabled={loadingCreate}
                            error={Boolean(errors.slug)}
                            helperText={errors.slug ? "Slug is required" : ""}
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
                            disabled={loadingCreate}
                            error={Boolean(errors.price)}
                            helperText={errors.price ? "Price is required" : ""}
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
                            disabled={loadingCreate}
                            error={Boolean(errors.img)}
                            helperText={errors.img ? "Image is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Button
                        variant="contained"
                        component="label"
                        disabled={loadingCreate}
                      >
                        Upload File
                        <input type="file" onChange={uploadHandler} hidden />
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
                            disabled={loadingCreate}
                          />
                        }
                      ></FormControlLabel>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="featuredImage"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="featuredImage"
                            label="Featured Image"
                            disabled={loadingCreate}
                            error={Boolean(errors.featuredImage)}
                            helperText={
                              errors.featuredImage
                                ? "Featured Image is required"
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
                        component="label"
                        disabled={loadingCreate}
                      >
                        Upload File
                        <input
                          type="file"
                          onChange={(e) => uploadHandler(e, "featuredImage")}
                          hidden
                        />
                      </Button>
                      {loadingUpload && <CircularProgress />}
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
                            disabled={loadingCreate}
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
                            disabled={loadingCreate}
                            error={Boolean(errors.brand)}
                            helperText={errors.brand ? "Brand is required" : ""}
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
                            disabled={loadingCreate}
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
                            disabled={loadingCreate}
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
                            disabled={loadingCreate}
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
                        disabled={loadingCreate}
                      >
                        Create Product
                      </Button>
                      {loadingCreate && <CircularProgress />}
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CreateProduct), { ssr: false });
