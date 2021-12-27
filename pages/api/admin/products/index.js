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
    title: "sample name",
    slug: "sample-slug-" + Math.random(),
    img: "/images/shirt1.jpg",
    price: 0,
    category: "sample category",
    brand: "sample brand",
    currentInStock: 0,
    description: "sample description",
    rating: 0,
    numReviews: 0,
    isFeatured: true,
    featuredImage: "/images/shirt1.jpg",
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: "Product Created", product });
});

export default handler;
