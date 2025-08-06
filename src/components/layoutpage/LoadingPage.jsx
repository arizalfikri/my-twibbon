import React from "react";
import { SyncLoader } from "react-spinners";
import HashLoader from "react-spinners/HashLoader";

const LoadingPage = () => {
  return (
    <div style={styles.loaderContainer}>
<SyncLoader
  color="#d433c0"
  margin={3}
  size={15}
/>    </div>
  );
};

const styles = {
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Menutupi seluruh layar
    backgroundColor: "#f5f5f5", // Warna latar belakang (opsional)
  },
};

export default LoadingPage;
