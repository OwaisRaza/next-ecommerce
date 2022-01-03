const dateFormat = (date) => {
  const updatedFormat = new Date(date).toLocaleDateString();
  return updatedFormat;
};
export { dateFormat };
