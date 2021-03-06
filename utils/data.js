import bcrypt from "bcryptjs";
const data = {
  users: [
    {
      username: "ovais",
      email: "ovais@gmail.com",
      password: bcrypt.hashSync("ovais314"),
      isAdmin: true,
    },
    {
      username: "raza",
      email: "raza@gmail.com",
      password: bcrypt.hashSync("raza314"),
      isAdmin: false,
    },
  ],
  products: [
    {
      title: "Casual",
      slug: "casual",
      currentInStock: 3,
      price: 1000,
      category: "Shoes",
      numReviews: 10,
      rating: 4.5,
      brand: "Bata",
      description: "A popular shoes",
      img: "/images/img1.jpeg",
      isFeatured: true,
      featuredImage: "/images/banner2.jpg",
    },
    {
      title: "Lofers",
      slug: "lofers",
      currentInStock: 50,
      price: 500,
      category: "Shoes",
      numReviews: 4,
      rating: 3.5,
      brand: "urban soal",
      description: "A popular shoes",
      img: "/images/img2.jpeg",
      isFeatured: true,
      featuredImage: "/images/banner2.jpg",
    },
    {
      title: "Sports",
      slug: "sports",
      currentInStock: 3,
      price: 1200,
      category: "Shoes",
      numReviews: 6,
      rating: 4,
      brand: "Nike",
      description: "A popular shoes",
      img: "/images/img3.jpeg",
      isFeatured: true,
      featuredImage: "/images/banner2.jpg",
    },
    {
      title: "Lawsuit",
      slug: "lawsuit",
      currentInStock: 20,
      price: 1300,
      category: "Shoes",
      numReviews: 3,
      rating: 3.5,
      brand: "Lawsuit",
      description: "A popular shoes",
      img: "/images/img4.jpeg",
      isFeatured: true,
      featuredImage: "/images/banner2.jpg",
    },
    {
      title: "Caterpillar",
      slug: "caterpillar",
      currentInStock: 15,
      price: 1500,
      category: "Shoes",
      numReviews: 5,
      rating: 4.5,
      brand: "Caterpillar",
      description: "A popular shoes",
      img: "/images/img5.jpeg",
      isFeatured: true,
      featuredImage: "/images/banner2.jpg",
    },
    {
      title: "Badminton",
      slug: "badminton",
      currentInStock: 25,
      price: 1500,
      category: "Shoes",
      numReviews: 5,
      rating: 3.9,
      brand: "Badminton",
      description: "A popular shoes",
      img: "/images/img6.jpeg",
      isFeatured: true,
      featuredImage: "/images/banner2.jpg",
    },
    {
      title: "Old Sports",
      slug: "old-sports",
      currentInStock: 25,
      price: 1500,
      category: "Shoes",
      numReviews: 5,
      rating: 3.9,
      brand: "Old Sports",
      description: "A popular shoes",
      img: "/images/img7.jpeg",
      isFeatured: true,
      featuredImage: "/images/banner2.jpg",
    },
    {
      title: "New Sports",
      slug: "new-sports",
      currentInStock: 25,
      price: 1500,
      category: "Shoes",
      numReviews: 5,
      rating: 3.9,
      brand: "New Sports",
      description: "A popular shoes",
      img: "/images/img8.jpeg",
      isFeatured: true,
      featuredImage: "/images/banner2.jpg",
    },
  ],
};

export default data;
