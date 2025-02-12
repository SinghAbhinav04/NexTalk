import React, { createContext, useState, useContext } from 'react';

const ActiveUserContext = createContext();

export const useActiveUserContext = () => {
    return useContext(ActiveUserContext);
};

export const ActiveUserProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(null);

    const updateLoggedInUser = (user) => {
        setLoggedInUser(user);
    };

    return (
        <ActiveUserContext.Provider value={{ loggedInUser, updateLoggedInUser }}>
            {children}
        </ActiveUserContext.Provider>
    );
};
