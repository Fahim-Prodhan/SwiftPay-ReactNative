import { AuthContext } from "@/components/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import baseUrl from "../../components/services/baseUrl";


export default function CashOutPage({ navigation }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const { authUser, setAuthUser,setLoadingUser } = useContext(AuthContext);


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


  const handleSendMoney = async () => {
    if (!to || !amount || !pin) {
      Alert.alert("Error", "Please fill all fields.");
    } else {
      // Making the API call to send money
      try {
        const response = await fetch(`${baseUrl}/api/transaction/create-cash-out-transaction`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: authUser?.phone,
            to: to,
            amount: amount,
            pin: pin,
            tType: "Agent Transaction", 
          }),
        });

        const result = await response.json();

        if (response.ok) {
          // Transaction successful
          Alert.alert("Success", "Money sent successfully.");
          router.push('/home')
        } else {
          // Error in transaction
          Alert.alert("Error", result.error || "Something went wrong.");
        }
      } catch (error) {
        // Network or other error
        Alert.alert("Error", "Failed to send money.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Cash Out</Text>

      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* To Input Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>To</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter agent's phone number"
            value={to}
            onChangeText={setTo}
          />
        </View>

        {/* Amount Input Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Pin Input Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Pin</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your PIN"
            secureTextEntry
            value={pin}
            onChangeText={setPin}
          />
        </View>

        {/* Send Button */}
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMoney}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fc", // Light background color
    justifyContent: "flex-start", // Align items at the top
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    paddingTop: 30,
    paddingBottom: 10,
    textAlign: "center",
    backgroundColor: "#FFD369",
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "", // Center the form inputs and button vertically
  },
  inputContainer: {
    marginBottom: 20,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#7868E6", // Button color
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
