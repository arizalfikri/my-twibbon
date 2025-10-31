export default function ModalAlert({ children, onClose }) {
  const handOnClose = (e) => {
    if (e.target.id === "container") onClose();
  };
  return (
    <div
      id="container"
      onClick={handOnClose}
      className="z-50 inset-0 fixed bg-[#103449] bg-opacity-40 backdrop-brightness-50 flex justify-center items-center"
    >
      <div className="bg-[#e3f2fb] dark:bg-gray-800 m-3 rounded-xl">{children}</div>
    </div>
  );
}
