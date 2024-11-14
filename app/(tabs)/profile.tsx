import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "@/components/context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

export default function UserProfile() {
  const { authUser, setAuthUser } = useContext(AuthContext);
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!authUser) {
      router.replace("login");
    }
  }, [authUser]);

  useFocusEffect(
    React.useCallback(() => {
      // Fetch user data when the screen is focused
      const getUserData = async () => {
        const userData = await AsyncStorage.getItem("authUser");
        if (userData) {
          setUserData(JSON.parse(userData));
        }
      };
      getUserData();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authUser");
      setAuthUser(null);
      router.replace("login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: userData?.profilePicture || "https://via.placeholder.com/150" }}
          style={styles.profilePicture}
        />
        <Text style={styles.username}>{userData?.name || "User Name"}</Text>
        <Text style={styles.email}>{userData?.email || "user@example.com"}</Text>

        {/* Balance visibility toggle */}
        <TouchableOpacity onPress={toggleBalanceVisibility} style={styles.toggleButton}>
          <Text style={styles.toggleText}>Toggle Balance</Text>
        </TouchableOpacity>

        {/* Display balance conditionally */}
        {isBalanceVisible && (
          <Text style={styles.balanceText}>Balance: $100</Text> // Placeholder balance
        )}

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Phone Number:</Text>
          <Text style={styles.infoValue}>{userData?.phone || "N/A"}</Text>

          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue}>{userData?.address || "N/A"}</Text>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    paddingTop: 20,
  },
  profileContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#888",
    marginBottom: 10,
  },
  toggleButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  toggleText: {
    color: "#fff",
    fontWeight: "bold",
  },
  balanceText: {
    fontSize: 18,
    color: "#333",
    marginVertical: 10,
  },
  infoSection: {
    marginVertical: 20,
    width: "100%",
  },
  infoLabel: {
    fontSize: 16,
    color: "#444",
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: "#2196F3",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#FF5722",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
