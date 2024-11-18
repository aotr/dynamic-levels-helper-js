const queryStringToArray = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = [];

  // Loop through each entry in the query string
  for (const [key, value] of params.entries()) {
    result.push({ [key]: value });
  }

  return result;
};
export default queryStringToArray;
