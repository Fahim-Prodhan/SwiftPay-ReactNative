import React, { useContext, useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { AuthContext } from "@/components/context/AuthContext";

const StartPage = () => {
    const { authUser, loadingUser } = useContext(AuthContext);

    // Show a loading indicator while the auth status is being determined
    if (loadingUser) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // Redirect based on authUser status
    return authUser ? <Redirect href="/home" /> : <Redirect href="/login" />;
};

export default StartPage;
