import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../../utils/auth";
import Product from "../../../../../models/Product";
import db from "../../../../../utils/db";

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

handler.put(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    product.title = req.body.title;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.category = req.body.category;
    product.img = req.body.img;
    product.featuredImage = req.body.featuredImage;
    product.isFeatured = req.body.isFeatured;
    product.brand = req.body.brand;
    product.currentInStock = req.body.currentInStock;
    product.description = req.body.description;
    await product.save();
    await db.disconnect();
    res.send({ message: "Product Updated Successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Product Not Found" });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    await product.remove();
    await db.disconnect();
    res.send({ message: "Product Deleted" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Product Not Found" });
  }
});

export default handler;
