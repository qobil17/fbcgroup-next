const ServiceList = () => {
  const handleClick = () => {
    alert("Service List tugmasi bosildi!");
  };
  return (
    <button
      onClick={handleClick}
      style={{
        color: "white",
        backgroundColor: "blue",
        padding: "20px",
        fontSize: "20px",
        borderRadius: "8px",
      }}
    >
      SERVICE LIST
    </button>
  );
};
export default ServiceList;
