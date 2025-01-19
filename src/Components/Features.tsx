import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import colors from "./colors";

export default function Features() {
    return (
        <View style={styles.container}>
            <Text style={styles.headingText}>Features</Text>
            <View style={styles.featureContainer}>
                <View style={styles.featureHeading}>
                    <Image source={require('../Components/chatgpticon.png')} style={styles.featureIcon} />
                    <Text style={styles.featureText}>AI Powered</Text>
                </View>
                <Text style={styles.description}>ChatGPT is an AI-powered chatbot that uses natural language processing to generate human-like text</Text>
            </View>
            <View style={[styles.featureContainer2]}>
                <View style={styles.featureHeading}>
                    <Image source={require('../Components/dall_e.png')} style={styles.featureIcon} />
                    <Text style={styles.featureText}>DALL-E</Text>
                </View>
                <Text style={styles.description}>DALL-E is an artificial intelligence (AI) model that generates images from text descriptions.</Text>
            </View>
            <View style={styles.featureContainer3}>
                <View style={styles.featureHeading}>
                    <Image source={require('../Components/brain.png')} style={styles.featureIcon} />
                    <Text style={styles.featureText}>Smart AI</Text>
                </View>
                <Text style={styles.description}>Smart A.I. is designed to simulate human-like intelligence and possesses the ability to learn, reason, and perform complex tasks across multiple domains.</Text>
            </View>
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    headingText: {
        fontSize: hp(4),
        fontWeight: "bold",
        color: 'black',
        marginLeft: wp(5),
    },
    featureContainer: {
        marginHorizontal: wp(3),
        padding: wp(5),
        backgroundColor: colors.secondary2,
        borderRadius: 20,
    },
    featureHeading: {
        flexDirection: "row",
        alignItems: "center",
    },
    featureIcon: {
        width: wp(10),
        height: wp(10),
    },
    featureText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
        marginLeft: wp(1),
    },
    description: {
        fontSize: 16,
        color: "black",
    },
    featureContainer2: {
        marginTop: hp(2),
        marginHorizontal: wp(3),
        padding: wp(5),
        backgroundColor: colors.lightparpal,
        borderRadius: 20,
    },
    featureContainer3: {
        marginTop: hp(2),
        marginHorizontal: wp(3),
        padding: wp(5),
        backgroundColor: colors.lightblue,
        borderRadius: 20,
    },

});