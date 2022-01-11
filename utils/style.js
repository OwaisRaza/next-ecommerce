import { makeStyles } from "@material-ui/core";
const drawerWidth = 240;
const useStyles = makeStyles({
  navbar: {
    backgroundColor: "#009688",
    "& a": {
      color: "#ffffff",
      marginLeft: 10,
    },
    "& button": {
      color: "#ffffff",
      marginLeft: 10,
    },
  },
  brand: {
    fontWeight: "bold",
    fontSize: "1rem",
  },
  grow: {
    flexGrow: 1,
  },
  main: {
    minHeight: "80vh",
    marginBottom: "50px",
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  footer: {
    width: "100%",
    padding: "5px",
    color: "#fff",
    background: "#009688",
    marginTop: "15px",
    position: "fixed",
    bottom: 0,
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
  },
  transparentBackground: {
    background: "transparent",
  },
  error: {
    color: "#f04040",
  },
  img: {
    minHeight: "210px",
    maxHeight: "210px",
    objectFit: "fill !important",
  },
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: "1",
  },
  drawerPaper: {
    width: drawerWidth,
    background: "#424242",
    color: "#fff",
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: "20px",
    marginBottom: "25px",
  },
  mt40: {
    marginTop: "40px",
  },
});

export default useStyles;
