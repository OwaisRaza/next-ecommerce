import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import Rating from "material-ui-rating/lib/components/Rating/Rating";
import useStyles from "../utils/style";
import NextLink from "next/link";

export default function ProductItem({ product, addToCartHandler }) {
  const classes = useStyles();

  return (
    <Card>
      <NextLink href={`/product/${product.slug}`} passHref>
        <CardActionArea>
          <CardMedia
            className={classes.img}
            component="img"
            image={product.img}
            title={product.title}
          ></CardMedia>
          <CardContent>
            <Typography>{product.title}</Typography>
            <Rating value={product.rating} precision={0.5} readOnly></Rating>
          </CardContent>
        </CardActionArea>
      </NextLink>
      <CardActions>
        <Typography>${product.price}</Typography>
        <Button
          size="small"
          color="primary"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
}
