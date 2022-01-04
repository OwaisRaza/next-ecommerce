import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../utils/auth";
import Product from "../../../../models/Product";
import db from "../../../../utils/db";

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    title: req.body.title,
    slug: req.body.slug,
    img: req.body.img,
    price: req.body.price,
    category: req.body.category,
    brand: req.body.brand,
    currentInStock: req.body.currentInStock,
    description: req.body.description,
    rating: req.body.rating,
    numReviews: 0,
    isFeatured: req.body.isFeatured,
    featuredImage: req.body.featuredImage,
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: "Product Created", product });
});

export default handler;
