import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUserContext = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [selectedUser, setSelectedUser] = useState(null);

    const updateSelectedUser = (user) => {
        setSelectedUser(user);
    };

    return (
        <UserContext.Provider value={{ selectedUser, updateSelectedUser }}>
            {children}
        </UserContext.Provider>
    );
};
