import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage'; // for storing auth data locally
import { useNavigation } from '@react-navigation/native'; // use navigation for native apps
import baseUrl from '../../components/services/baseUrl';
import { router } from "expo-router";
import { AuthContext } from '@/components/context/AuthContext';
import { useFocusEffect } from "@react-navigation/native"; 


const Login = () => {
    const [eye, setEye] = useState(false);
    const [loading, setLoading] = useState(false);
    const {setLoadingUser, setAuthUser, authUser} = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const navigation = useNavigation();

    const togglePasswordVisibility = () => {
        setEye(!eye);
    };

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleInputErrors = (username, password) => {
        if (!username || !password) {
            Alert.alert("Error", "Username and password are required.");
            return false;
        }
        return true;
    };

    const login = async (username, password) => {
        const success = handleInputErrors(username, password);
        if (!success) return;
        setLoadingUser(true);
        try {
            const res = await fetch(`${baseUrl}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            Alert.alert("Success", "Successfully Logged in!");
            await AsyncStorage.setItem("authUser", JSON.stringify(data));
            const userId = await AsyncStorage.getItem('authUser')
            const parsedUser = JSON.parse(userId);
            await fetchUserData(parsedUser);
            navigation.navigate("index");
            setLoadingUser(false)
        } catch (error) {
            await AsyncStorage.setItem("authUser", '');
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {  
        login(formData.username, formData.password);
    };

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

    // Navigate to the /register screen
    const handleRegisterNavigation = () => {
        router.push('/register')
    };

    useFocusEffect(
        React.useCallback(() => {
          if (authUser) {
            router.replace("/home");
          }
        }, [])
      );

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
            <Text style={styles.title}>Login</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone/Email</Text>
                <TextInput
                    placeholder="Enter phone/email"
                    style={styles.input}
                    value={formData.username}
                    onChangeText={(value) => handleChange('username', value)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Pin</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        placeholder="Your 5-digit pin"
                        style={[styles.input, { flex: 1 }]}
                        secureTextEntry={!eye}
                        value={formData.password}
                        onChangeText={(value) => handleChange('password', value)}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
                        <Icon name={eye ? 'eye' : 'eye-slash'} size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.link}>
                <Text style={styles.linkText}>Forgot password?</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>
                Don’t have an account?{' '}
                <Text style={styles.registerText} onPress={handleRegisterNavigation}>
                    Register
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    logo: {
        width: 200,
        height: 100,
        marginBottom: 0,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 0,
        backgroundColor: '#fff',
    },
    icon: {
        marginLeft: 14,
        marginRight: 14,
    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#363062',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 16,
    },
    linkText: {
        color: '#007bff',
        fontSize: 14,
    },
    footerText: {
        fontSize: 14,
        color: '#333',
        marginTop: 24,
    },
    registerText: {
        color: '#007bff',
        fontWeight: 'bold',
    },
});

export default Login;
