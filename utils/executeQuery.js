const executeQuery = async query => {
  let finalQuery = `const fct = async () =>{const users = await User.find(${query}); return users};  fct()`;
  const res = await eval(finalQuery);
  return res;
};
