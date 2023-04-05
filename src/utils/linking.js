const config = {
    screens: {
      Home: {
        path: "postdetails/:id",
        parse: {
          id: (id) => `${id}`,
        },
      },
    },
  };
  
  const linking = {
    prefixes: ["eastmojo://app"],
    config,
  };
  
  export default linking;
  