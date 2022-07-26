import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import axios from 'axios';
import {config} from '../../../config';

const Details = ({route, navigation}) => {    

    //En un futuro puede mejorarse para que sea una funcion polimorfica (Standby, Review)

    const [receipt, setReceipt] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [analystNumber, setAnalystNumber] = useState(null);
    const [date_request, setDateRequest] = useState('');
    const [date_review, setDateReview] = useState('');
    const [status, setStatus] = useState('');
    const id = route.params.id;

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
            try{
                const response = await axios.get(`${config.API_URL}/reviews/${id}`);
                setReceipt(response.data.student.receipt_number);
                setAnalysis(`${response.data.analyst.name} ${response.data.analyst.last_name}`);
                setAnalystNumber(response.data.analyst.phone_number);
                setDateRequest(response.data.review.date_request);
                setDateReview(response.data.review.date_review);
                setStatus(response.data.review.status ? 'Finalizado' : 'En proceso');
            }
            catch(error){
                console.log(error);
            }
        }
        getData();
    }
    ,[])

    return ( // El titulo del react navigate debe ser: Pre-revisión
        <View style={styles.container}>
            <Text style={styles.welcome}>Información</Text>
            <Text style={styles.instructions}>{date_request}</Text>
            <View>
                <Text style={styles.item}>Número de revisión: #{receipt}</Text>
                <Text style={styles.item}>Analista: {analysis}</Text>
                <Text style={styles.item}>Fecha prevista de revisión: {date_review}</Text>
                <Text style={styles.item}>Observación: Por favor, estar al tanto de los mensajes vía WhatsApp. </Text>
                <Text style={styles.item}>Estado: {status}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={initiateWhatsapp}>
                    <Text style={styles.buttonText}>Enviar mensaje</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Details;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    item: {
        padding: 10,
        fontSize: 14,
        height: 55,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom: 20,
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
