import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseUrl from "../services/baseUrl";
import { useFocusEffect } from "@react-navigation/native";  // Import useFocusEffect

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const getUserData = async () => {
    try {
      // Get user data from AsyncStorage
      const userData = await AsyncStorage.getItem("authUser");
      console.log("userData:", userData);  
      if (userData) {
        const parsedUser = JSON.parse(userData);
        await fetchUserData(parsedUser);
      } else {
        setLoadingUser(false);
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
      setLoadingUser(false);
    }
  };

  // Use useFocusEffect to re-fetch user data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      getUserData();
    }, [])
  );

  const fetchUserData = async (userId) => {
    setLoadingUser(true);
    try {
      const response = await fetch(`${baseUrl}/api/auth/user/${userId._id}`);
      if (response.ok) {
        const userData = await response.json();
        setAuthUser(userData);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []); // Initial fetch when the component is mounted

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, loadingUser, setLoadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};
