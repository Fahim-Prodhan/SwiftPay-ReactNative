import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Login = () => {
    const [eye, setEye] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const togglePasswordVisibility = () => {
        setEye(!eye);
    };

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
            <Text className='text-red-500' style={styles.title}>Login</Text>
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
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link}>
                <Text style={styles.linkText}>Forgot password?</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>
                Don’t have an account?{' '}
                <Text style={styles.registerText}>Register</Text>
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
        // color: '#333',
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
