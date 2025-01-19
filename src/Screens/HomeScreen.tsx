import { Alert, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Features from "../Components/Features";
import colors from "../Components/colors";
import Voice from '@react-native-voice/voice';
import { apiCall } from "../Api/openAI";
import { dummyMessages } from "../Constants/dummyMessages";
import Tts from 'react-native-tts';


export default function HomeScreen() {

    interface Message {
        role: string;
        content: string;
    }

    const [messages, setMessages] = useState<Message[]>(dummyMessages);
    const [reacording, setReacording] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const [result, setResult] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    const clear = () => {
        setMessages([]);

    }

    const stopSpeaking = () => {
        setSpeaking(false);
        if(Platform.OS === 'ios') {
            Tts.stop(true);
        }else{
            Tts.stop();
        }
        
    }

    const speechStartHandler = () => {
        console.log('Speech started');
    }

    const speechEndHandler = () => {
        setReacording(false);
        console.log('Speech ended');

    }

    const speechResultsHandler = (e: any) => {
        console.log('Speech results', e.value);
        const text = e.value[0];
        setResult(text);
    }

    const speechErrorHandler = (e: any) => {
        console.log('Speech error', e.error);
    }

    const startRecording = async () => {
        setReacording(true);
        try {
            await Voice.start('en-US');
        } catch (e) {
            console.log('Error starting speech', e);
        }
    }

    const stopRecording = async () => {
        try {
            await Voice.stop();
            setReacording(false);
            //fatch result from chatGPT
            fatchResponse();
        } catch (e) {
            console.log('Error stopping speech', e);
        }
    }

    const fatchResponse = () => {
        if (result.trim().length > 0) {
            let newMessages = [...messages];
            newMessages.push({ role: 'user', content: result.trim() });
            updateScrollView();
            setMessages(newMessages);

            apiCall(result.trim(), newMessages).then((res) => {
                console.log('response', res.data);
                if (res.success) {
                    setMessages([...res.data]);
                    updateScrollView();
                    setResult('');
                    startTextToSpeech(res.data[res.data.length - 1]);
                } else {
                    Alert.alert('Error', res.msg);
                }
            })
        }
    }

    const startTextToSpeech = message => {
        if(!message.content.includes('https')) {
            Tts.speak(message.content, {
                rate: 0.5,
                inVoiceId: 'com.apple.ttsbundle.Samantha-compact',
            })
        }
    }

    const updateScrollView = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 200);
    }

    useEffect(() => {
        Voice.onSpeechStart = speechStartHandler;
        Voice.onSpeechEnd = speechEndHandler;
        Voice.onSpeechResults = speechResultsHandler;
        Voice.onSpeechError = speechErrorHandler;

        // tts

        Tts.addEventListener('tts-start', (event) => console.log("start", event));
        Tts.addEventListener('tts-progress', (event) => console.log("progress", event));
        Tts.addEventListener('tts-finish', (event) => console.log("finish", event));
        Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        }

    }, []);

    //console.log('result', result);


    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.SafeAreaView}>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "flex-start" }}>
                    <Image source={require("../Components/bot.png")} style={{ width: wp(25), height: hp(15) }} />
                </View>
                {messages.length > 0 ? (
                    <View style={styles.messageContainer}>
                        <Text style={styles.headingText}>Assistant</Text>
                        <View style={styles.messageBox}>
                            <ScrollView
                                ref={scrollViewRef}
                                bounces={false}
                                style={styles.scrollView}
                                showsHorizontalScrollIndicator={false}>
                                {
                                    messages.map((message, index) => {
                                        if (message.role == 'assistant') {
                                          if (message.content.includes('https')) {
                                            // For image messages
                                            return (
                                              <View key={`assistant-image-${index}`} style={styles.assistantMessage}>
                                                <Image source={{ uri: message.content }} style={{ width: wp(70), height: hp(30) }} />
                                              </View>
                                            );
                                          } else {
                                            // For text messages
                                            return (
                                              <View key={`assistant-text-${index}`} style={styles.assistantMessage}>
                                                <Text style={styles.assistantMessageText}>{message.content}</Text>
                                              </View>
                                            );
                                          }
                                        } else {
                                          // For user input
                                          return (
                                            <View key={`user-${index}`} style={styles.userMessage}>
                                              <Text style={styles.userMessageText}>{message.content}</Text>
                                            </View>
                                          );
                                        }
                                      })
                                }
                            </ScrollView>
                        </View>

                    </View >
                ) : (
                    <Features />
                )
                }
                {/* reacording, claer chat and stop button */}
                <View style={styles.buttonsContainer}>
                    {
                        speaking ? (
                            <TouchableOpacity style={styles.button} onPress={stopSpeaking}>
                                <Text style={styles.buttonText}>Stop</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={{ width: 70, height: 70 }} />
                        )

                    }
                    {
                        reacording ? (
                            <TouchableOpacity onPress={stopRecording} style={styles.recordingbutton} >
                                {/* Recording stop buton*/}
                                <Image style={{ width: hp(3), height: hp(5), tintColor: 'white' }} source={require('../Components/microphone.png')} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={startRecording} style={styles.button}>
                                {/* Recording start buton*/}
                                <Image style={{ width: hp(3), height: hp(5), tintColor: 'white' }} source={require('../Components/microphone.png')} />
                            </TouchableOpacity>
                        )
                    }
                    {
                        messages.length > 0 ? (
                            <TouchableOpacity onPress={() => clear()} style={styles.button}>
                                <Text style={styles.buttonText}>Clear</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.buttonspace} />
                        )
                    }
                </View>
            </SafeAreaView >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    SafeAreaView: {
        flex: 1,
        marginTop: hp(5),
    },
    headingText: {
        fontSize: wp(5),
        fontWeight: "semibold",
        color: colors.black,
    },
    messageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    messageBox: {
        width: wp(90),
        height: hp(60),
        backgroundColor: "lightgray",
        borderRadius: 10,
        padding: 10,
    },
    scrollView: {
        flex: 1,
    },
    chatMessage: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginVertical: 5,
    },
    userMessage: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 10,
        alignSelf: "flex-end",
        marginVertical: 5,
    },
    userMessageText: {
        color: colors.white,
        fontSize: wp(4),
    },
    assistantMessage: {
        backgroundColor: colors.secondary,
        padding: 10,
        borderRadius: 10,
        alignSelf: "flex-start",
        marginVertical: 5,
    },
    assistantMessageText: {
        color: colors.white,
        fontSize: wp(4),
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: 10,
    },
    button: {
        borderWidth: 5,
        borderColor: colors.secondary2,
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 70,
        backgroundColor: colors.primary,
        borderRadius: 50,
    },
    recordingbutton: {
        borderWidth: 5,
        borderColor: colors.secondary2,
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 70,
        backgroundColor: colors.red,
        borderRadius: 50,
    },
    buttonText: {
        color: colors.white,
        fontSize: wp(4),
    },
    buttonspace: {
        width: 70,
        height: 70,
    },
});


