import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";

export default function Shipping() {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (!userInfo) {
      router.push("/login?redirect=/shipping");
    }
  }, []);

  return (
    <Layout>
      <h1>Shipping</h1>
    </Layout>
  );
}
