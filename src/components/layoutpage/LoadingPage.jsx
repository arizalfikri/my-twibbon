import React from "react";
import HashLoader from "react-spinners/HashLoader";

const LoadingPage = () => {
  return (
    <div style={styles.loaderContainer}>
      <HashLoader color="#2C6399" size={90} />
    </div>
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
