import nc from "next-connect";
import User from "../../../models/User";
import db from "../../../utils/db";
import bcrypt from "bcryptjs";
import { signToken } from "../../../utils/auth";

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const user = await User.findOne({ username: req.body.username });
  await db.disconnect();
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken(user);
    res.send({
      token,
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401).send({ message: "invalid user or password" });
  }
});

export default handler;
