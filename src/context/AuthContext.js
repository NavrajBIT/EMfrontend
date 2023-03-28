const { createContext, useState } = require("react");

export const AuthContext = createContext(null);


export const AuthContextProvider = ({ children }) => {
    const [login, setIsLoggedIn] = useState(false)

    return <AuthContext.Provider value={{login, setIsLoggedIn}}>
        {children}
    </AuthContext.Provider>
}