import React, { useContext, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "@/components/context/AuthContext";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { useFocusEffect } from "@react-navigation/native"; 
import baseUrl from "../../components/services/baseUrl";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'; // Importing icons

export default function HomeScreen() {
  const { authUser, setAuthUser, setLoadingUser } = useContext(AuthContext);
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

  useFocusEffect(
    React.useCallback(() => {
      getUser(); 
      if (!authUser) {
        router.replace("login");
      }
    }, [])
  );

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbarContainer}>
        <Navbar />
      </View>

      {/* Static Buttons styled as Cards */}
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() =>router.push('/sendMoney')}>
          <MaterialIcons name="send" size={24} color="#fff" />
          <Text style={styles.cardText}>Send Money</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push("/cashOut")}>
          <FontAwesome name="money" size={24} color="#fff" />
          <Text style={styles.cardText}>Cash Out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push("/recharge")}>
          <MaterialIcons name="smartphone" size={24} color="#fff" />
          <Text style={styles.cardText}>Recharge</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <FontAwesome name="credit-card" size={24} color="#fff" />
          <Text style={styles.cardText}>Bill Pay</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <MaterialIcons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.cardText}>Add Money</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <MaterialIcons name="more-horiz" size={24} color="#fff" />
          <Text style={styles.cardText}>Others</Text>
        </TouchableOpacity>
      </View>

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
    paddingBottom: 10,
  },
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    flexDirection: "row",
    flexWrap: "wrap", 
    justifyContent: "space-around", 
  },
  card: {
    backgroundColor: "#7868E6",
    borderRadius: 8,
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    margin: 5,
    elevation: 3, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  cardText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 5, // Space between icon and text
  },
  toggleButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#4CAF50", 
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
