import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { AuthContext } from "@/components/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseUrl from "../../components/services/baseUrl"; // Replace with your actual base URL
import { Picker } from "@react-native-picker/picker"; // Import Picker

export default function MobileRechargePage({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [selectedOperator, setSelectedOperator] = useState(""); // State to store selected operator
  const { authUser, setAuthUser, setLoadingUser } = useContext(AuthContext);

  // Fetch the user data
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

  // Fetch user data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      getUser();
      if (!authUser) {
        router.replace("login");
      }
    }, [])
  );

  const handleRecharge = async () => {
    if (!phoneNumber || !amount || !pin || !selectedOperator) {
      Alert.alert("Error", "Please fill all fields.");
    } else {
      try {
        // Making the API call to recharge
        const response = await fetch(`${baseUrl}/api/transaction/create-recharge-transaction`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: authUser?.phone,
            to: phoneNumber,
            amount: amount,
            pin: pin,
            tType: "Mobile Recharge", // Transaction type
            // operator: selectedOperator, // Pass selected operator
          }),
        });

        const result = await response.json();

        if (response.ok) {
          // Recharge successful
          Alert.alert("Success", "Mobile recharge successful.");
          router.push('/home'); // Navigate to home page after successful recharge
        } else {
          // Error in recharge
          Alert.alert("Error", result.error || "Something went wrong.");
        }
      } catch (error) {
        // Network or other error
        Alert.alert("Error", "Failed to process recharge.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mobile Recharge</Text>

      <View style={styles.formContainer}>
        {/* Phone Number Input Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
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

        {/* Mobile Operator Select Dropdown */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Operator</Text>
          <Picker
            selectedValue={selectedOperator}
            onValueChange={(itemValue) => setSelectedOperator(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Grameenphone" value="Grameenphone" />
            <Picker.Item label="Banglalink" value="Banglalink" />
            <Picker.Item label="TeleTalk" value="TeleTalk" />
            <Picker.Item label="Robi" value="Robi" />
            <Picker.Item label="Airtel" value="Airtel" />
          </Picker>
        </View>

        {/* Recharge Button */}
        <TouchableOpacity style={styles.rechargeButton} onPress={handleRecharge}>
          <Text style={styles.rechargeButtonText}>Recharge</Text>
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
    justifyContent: "center", // Center the form inputs and button vertically
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
  picker: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  rechargeButton: {
    backgroundColor: "#7868E6", // Button color
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  rechargeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
