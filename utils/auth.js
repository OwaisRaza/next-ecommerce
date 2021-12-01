import jwt from "jsonwebtoken";

const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

export { signToken };
