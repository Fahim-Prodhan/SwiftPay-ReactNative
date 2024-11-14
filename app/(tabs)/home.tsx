import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "@/components/context/AuthContext";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { useFocusEffect } from "@react-navigation/native"; 
import baseUrl from "../../components/services/baseUrl";


export default function HomeScreen() {
  const { authUser, setAuthUser,setLoadingUser } = useContext(AuthContext);

  // Add a state to track balance toggle
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authUser");
      setAuthUser(null);
      router.replace("login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };



  const getUser = async () => {
    const userData = await AsyncStorage.getItem("authUser");
    const parsedUser = JSON.parse(userData);
    setLoadingUser(true);
    try {
      const response = await fetch(`${baseUrl}/api/auth/user/${parsedUser._id}`);
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

  // Using useFocusEffect to refetch user data whenever the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      getUser(); 
      if (!authUser) {
        router.replace("login");
      }
    }, [])
  );

  // Handle button press
  const handleCardPress = (cardTitle) => {
    console.log(`Card Pressed: ${cardTitle}`);
  };

  // Handle balance toggle
  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible); // Toggle balance visibility
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbarContainer}>
        <Navbar />
      </View>

      {/* Static Buttons styled as Cards */}
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => handleCardPress("Card 1")}>
          <Text style={styles.cardText}>Card 1</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handleCardPress("Card 2")}>
          <Text style={styles.cardText}>Card 2</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handleCardPress("Card 3")}>
          <Text style={styles.cardText}>Card 3</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handleCardPress("Card 4")}>
          <Text style={styles.cardText}>Card 4</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handleCardPress("Card 5")}>
          <Text style={styles.cardText}>Card 5</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handleCardPress("Card 6")}>
          <Text style={styles.cardText}>Card 6</Text>
        </TouchableOpacity>
      </View>

      {/* Display balance conditionally */}
      {isBalanceVisible && (
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Current Balance: $100</Text> {/* Placeholder balance */}
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  navbarContainer: {
    width: "100%",
    paddingBottom: 10, // Spacing below navbar
  },
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    flexDirection: "row",
    flexWrap: "wrap", // Allows the cards to wrap to the next line
    justifyContent: "space-around", // Distribute cards evenly
  },
  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    margin: 5,
    elevation: 3, // Adds shadow for a raised look
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  cardText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  toggleButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#4CAF50", // Green color for toggle button
    borderRadius: 5,
  },
  toggleText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  balanceContainer: {
    marginVertical: 10,
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  balanceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
