import bcrypt from "bcryptjs";
const data = {
  users: [
    {
      username: "ovais",
      password: bcrypt.hashSync("ovais314"),
      isAdmin: true,
    },
    {
      username: "raza",
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
    },
  ],
};

export default data;
