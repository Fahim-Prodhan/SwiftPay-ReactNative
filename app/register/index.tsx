import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import baseUrl from '../../components/services/baseUrl';
import { router } from "expo-router";
import { AuthContext } from '@/components/context/AuthContext';

const Register = () => {
    const [eye, setEye] = useState(false);
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        pin: '',
    });
    const [role, setRole] = useState('user');  

    const navigation = useNavigation();

    const togglePasswordVisibility = () => setEye(!eye);

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleInputErrors = () => {
        const { name, email, phone, pin } = formData;
        if (!name || !email || !phone || !pin) {
            Alert.alert("Error", "All fields are required.");
            return false;
        }
        if (pin.length !== 5) {
            Alert.alert("Error", "PIN must be exactly 5 digits.");
            return false;
        }
        return true;
    };

    const registerUser = async () => {
        if (!handleInputErrors()) return;

        setLoading(true);
        try {
            const dataToSend = { ...formData, role }; // Add the selected role to the request
            const res = await fetch(`${baseUrl}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend),
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            Alert.alert("Success", "Registration successful!");
            await AsyncStorage.setItem("authUser", JSON.stringify(data));
            setAuthUser(data);
            navigation.navigate("index");
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
            <Text style={styles.title}>Register</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    placeholder="Enter full name"
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(value) => handleChange('name', value)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder="Enter email"
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(value) => handleChange('email', value)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                    placeholder="Enter phone number"
                    style={styles.input}
                    value={formData.phone}
                    onChangeText={(value) => handleChange('phone', value)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Pin</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        placeholder="Your 5-digit pin"
                        style={[styles.input, { flex: 1 }]}
                        secureTextEntry={!eye}
                        value={formData.pin}
                        onChangeText={(value) => handleChange('pin', value)}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
                        <Icon name={eye ? 'eye' : 'eye-slash'} size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
            
            {/* Role selection */}
            <View style={styles.roleContainer}>
                <TouchableOpacity
                    style={[styles.roleButton, role === 'user' && styles.selectedButton]}
                    onPress={() => setRole('user')}
                >
                    <Text style={styles.roleButtonText}>User</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.roleButton, role === 'agent' && styles.selectedButton]}
                    onPress={() => setRole('agent')}
                >
                    <Text style={styles.roleButtonText}>Agent</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={registerUser} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
            </TouchableOpacity>
            <Text style={styles.footerText}>
                Already have an account?{' '}
                <Text style={styles.registerText} onPress={() => router.push('/login')}>
                    Login
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
    footerText: {
        fontSize: 14,
        color: '#333',
        marginTop: 24,
    },
    registerText: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    roleContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    roleButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginRight: 10,
    },
    selectedButton: {
        backgroundColor: '#FAB12F',
    },
    roleButtonText: {
        color: '#333',
        fontSize: 16,
    },
});

export default Register;
