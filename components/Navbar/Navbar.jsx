// app/NavBar.js
import React, { useContext, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const router = useRouter();
    const [showBalance, setShowBalance] = useState(false);
    const {authUser} = useContext(AuthContext)

    return (
        <View style={styles.container}>
            {/* Container to hold logo and button/balance vertically */}
            <View style={styles.logoButtonContainer}>
                {/* Logo Image */}
                <Image 
                    source={require('../../assets/images/icon.png')} 
                    style={styles.logo}
                />
                
                {/* Toggle button or balance display */}
                <TouchableOpacity 
                    style={styles.toggleButton} 
                    onPress={() => setShowBalance(!showBalance)}
                >
                    <Text style={styles.buttonText}>
                        {showBalance ? `Balance: ${authUser?.balance} ৳` : 'Show Balance'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 5,
        paddingLeft: 20,
        paddingRight: 0,
        marginBottom: 5,
        backgroundColor: '#FFD369',
    },
    logoButtonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: 20,
        marginBottom:10
    },
    logo: {
        width: 200, 
        height: 80, 
        marginBottom:5, 
    },
    toggleButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#8B5DFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Navbar;
