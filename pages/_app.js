import { SnackbarProvider } from "notistack-next";
import { useEffect } from "react";
import "../styles/globals.css";
import { StoreProvider } from "../utils/Store";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const jssStyle = document.querySelector("#jss-server-side");
    if (jssStyle) {
      jssStyle.parentElement.removeChild(jssStyle);
    }
  }, []);
  return (
    <SnackbarProvider anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </SnackbarProvider>
  );
}

export default MyApp;
