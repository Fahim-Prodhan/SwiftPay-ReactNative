import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "@/components/context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

export default function UserProfile() {
  const { authUser, setAuthUser } = useContext(AuthContext);
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  useEffect(() => {
    if (!authUser) {
      router.replace("login");
    }
  }, [authUser]);

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
        {/* Profile Picture */}
        <Image
          source={require('../../assets/images/man.png')}
          style={styles.profilePicture}
        />
        <Text style={styles.username}>{authUser?.name || "User Name"}</Text>
        <Text style={styles.email}>{authUser?.email || "user@example.com"}</Text>

        {/* User Status (Active/Inactive) */}
        <TouchableOpacity style={styles.statusButton}>
          <Text style={styles.statusText}>{authUser?.isActive ? "Active" : "Inactive"}</Text>
        </TouchableOpacity>

        {/* User Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Role:</Text>
          <Text style={styles.infoValue}>{authUser?.role || "N/A"}</Text>

          <Text style={styles.infoLabel}>Phone Number:</Text>
          <Text style={styles.infoValue}>{authUser?.phone || "N/A"}</Text>

          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue}>{authUser?.address || "N/A"}</Text>
        </View>

        {/* Buttons for Edit Profile and Logout */}
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
    backgroundColor: "#f0f0f5", // Light background color
    alignItems: "center",
    paddingTop: 30,
  },
  profileContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    elevation: 8, // Soft shadow for a floating effect
    alignItems: "center",
    marginTop: 30,
  },
  profilePicture: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "#f0f0f5", // Light border for profile picture
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  username: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  email: {
    fontSize: 18,
    color: "#777",
    marginBottom: 15,
  },
  statusButton: {
    backgroundColor: "#00C853", // Green color for active status
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginBottom: 20,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  infoSection: {
    width: "100%",
    marginVertical: 20,
  },
  infoLabel: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: "#3F51B5", // Primary color for edit button
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 25,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
    elevation: 5, // Slight shadow for elevation
  },
  logoutButton: {
    backgroundColor: "#F44336", // Red color for logout button
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 25,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
