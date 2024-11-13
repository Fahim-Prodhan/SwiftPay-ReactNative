import { View, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { useContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from "@/components/context/AuthContext";

export default function HomeScreen() {
  const { authUser, setAuthUser,setLoadingUser } = useContext(AuthContext);

  // Function to log out the user
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authUser"); // Clear AsyncStorage
      setAuthUser(null); // Set authUser to null in context
      router.replace("login"); // Redirect to login screen
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  useEffect(() => {
    // Redirect to login if authUser is null
    if (!authUser) {
      router.replace("login");
    }
  }, [authUser]);

  const getUser = async ()=>{
    const userData = await AsyncStorage.getItem("authUser");
    console.log(userData);  
  }

  useEffect( ()=>{
    getUser()
  },[])

  return (
    <View style={styles.container}>
      <Button title="Go to Login" onPress={() => router.push("login")} />
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
