import Carousel from "react-material-ui-carousel";
import Item from "./Item";
import slider1 from "../public/images/slider-1.jpeg";
import slider2 from "../public/images/slider-2.jpeg";
import slider3 from "../public/images/slider-3.jpeg";

export default function CarouselView() {
  const items = [
    {
      img: slider1,
      name: "Random Name #1",
      description: "Probably the most random thing you have ever seen!",
    },
    {
      img: slider2,
      name: "Random Name #2",
      description: "Hello World!",
    },
    {
      img: slider3,
      name: "Random Name #2",
      description: "Hello World!",
    },
  ];

  return (
    <Carousel>
      {items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </Carousel>
  );
}
