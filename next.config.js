module.exports = {
  reactStrictMode: true,
  mongo: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  images: {
    domains: ["res.cloudinary.com"],
  },
};
