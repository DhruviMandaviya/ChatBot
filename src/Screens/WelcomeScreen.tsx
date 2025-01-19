import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import colors from "../Components/colors";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from "@react-navigation/native";


export default function HomeScreen() {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <StatusBar />
            <Text style={styles.headingText}>Jarvis</Text>
            <Text style={styles.sublineText}>The future is here, powered by AI</Text>
            <View style={styles.container}>
                <Image style={styles.logo} source={require('../Components/logo.png')} />
            </View>
            <TouchableOpacity onPress={()=>navigation.navigate("Home")} style={{marginBottom:wp('30%'), backgroundColor: colors.secondary, borderColor:colors.primary,borderWidth:3, margin: hp('5%'), padding: 10, borderRadius: 5 }}>
                <Text style={{ fontSize: wp('5%'), fontWeight:'bold', color: "white", textAlign: "center" }}>Get Started</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    SafeAreaView: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-between",
    },
    headingText: {
        fontSize: hp('5%'),
        fontWeight: "bold",
        color: colors.gray,
        marginTop: hp('10%'),
        textAlign: "center",
    },
    sublineText: {
        fontSize: hp('2%'),
        color: colors.black,
        textAlign: "center",
    },
    container: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    logo: {
        width: wp('75%'),
        height: hp('75%'),
        resizeMode: 'contain',
    },
});