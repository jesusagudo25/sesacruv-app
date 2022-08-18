import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../../config';

import { Header, ListItem, Avatar, Card, Icon, Divider, CheckBox, Button } from '@rneui/themed';

const Review = ({ review_id }) => {

    const [receipt, setReceipt] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [analystNumber, setAnalystNumber] = useState(null);
    const [date_request, setDateRequest] = useState('');
    const [date_review, setDateReview] = useState('');
    const [status, setStatus] = useState('');

    const enableMessage = new Date();

    const initiateWhatsapp = () => {
        let url = `whatsapp://send?phone=${analystNumber}`;

        Linking.openURL(url)
            .then(() => {
                console.log('Whatsapp Opened');
            }).catch(err => {
                alert('Por favor, instala Whatsapp en tu dispositivo para poder enviar un mensaje.');
            });
    }

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/reviews/${review_id}`);
                console.log('response: ', response.data);
                setReceipt(response.data.review.student.id);
                setAnalysis(`${response.data.review.user.name}`);
                setAnalystNumber(response.data.review.user.phone_number);
                setDateRequest(response.data.review.date_request);
                setDateReview(response.data.review.date_review);
                setStatus(response.data.review.status ? 'Finalizado' : 'En proceso');
            }
            catch (error) {
                console.log(error);
            }
        }
        getData();
    }
        , [])

    return (
        <View style={{ height: 480 }}>
            <View style={styles.header}>
                <Text style={styles.textPrimary}>Información</Text>
                <Text style={styles.textSecundary}>{date_request}</Text>
            </View>
            <View>
                <View style={styles.itemsContainer}>
                    <Text style={styles.itemLeft}>Número de revisión</Text>
                    <Text style={styles.itemRight}>#{receipt}</Text>
                </View>
                <View style={styles.itemsContainer}>
                    <Text style={styles.itemLeft}>Analista</Text>
                    <Text style={styles.itemRight}>{analysis}</Text>
                </View>
                <View style={styles.itemsContainer}>
                    <Text style={styles.itemLeft}>Fecha prevista de revisión</Text>
                    <Text style={styles.itemRight}>{date_review}</Text>
                </View>
                <View style={styles.itemsContainer}>
                    <Text style={styles.itemLeft}>Observación</Text>
                    <Text style={[styles.itemRight, { width: 200, textAlign: "right" }]}>Por favor, estar al tanto de los mensajes vía WhatsApp</Text>
                </View>
                <View style={styles.itemsContainer}>
                    <Text style={styles.itemLeft}>Estado</Text>
                    <Text style={styles.itemRight}>{status}</Text>
                </View>
            </View>

            {enableMessage.toISOString().split('T')[0] == date_review ? (
                <View style={styles.buttonContainer}>
                    <Button
                        title={'Enviar mensaje'}
                        containerStyle={{
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 25,
                            marginBottom: 20
                        }}
                        buttonStyle={{
                            backgroundColor: "#3b82f6",
                            borderRadius: 3,
                            paddingHorizontal: 15,
                            paddingVertical: 10
                        }}
                        onPress={() => initiateWhatsapp()}
                    //Agregar loading
                    />
                </View>
            ) : <></>}
        </View>
    )
}

export default Review


const styles = StyleSheet.create({
    header: {
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textPrimary: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        fontWeight: 'bold',
    },
    textSecundary: {
        textAlign: 'center',
        fontSize: 18,
        color: '#43484d',
    },
    itemsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomColor: '#747474',
        borderBottomWidth: 1,
        height: 60,
    },
    itemLeft: {
        padding: 10,
        fontSize: 14,
        fontWeight: '400',
    },
    itemRight: {
        padding: 10,
        fontSize: 14,

        fontWeight: '300',
    },
    buttonContainer: {
        marginVertical: 20,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#00bcd4',
        padding: 10,
        borderRadius: 5,
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
