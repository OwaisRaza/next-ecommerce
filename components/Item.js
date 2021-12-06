/* eslint-disable jsx-a11y/alt-text */
import { Paper } from "@material-ui/core";
import Image from "next/image";

export default function Items(props) {
  return (
    <Paper>
      <Image
        src={props.item.img.src}
        width={1200}
        height={450}
        layout="responsive"
      />
    </Paper>
  );
}
