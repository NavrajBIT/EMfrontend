const { createContext, useState } = require("react");

export const CategoryContext = createContext(null);


export const CategoryContextProvider = ({ children }) => {
    const [category, setCategories] = useState([ {
        "name": "All",
        isChecked:true
      },
      {
        "name": "Sports",
        isChecked:true
      },
      {
        "name": "Technology",
        isChecked:true
      },
      {
        "name": "Education",
        isChecked:true
      },])

    return <CategoryContext.Provider value={{category, setCategories}}>
        {children}
    </CategoryContext.Provider>
}