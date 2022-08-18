import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import axios from 'axios';
import { config } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, ListItem, Avatar, Card, Icon, Divider, CheckBox, Button } from '@rneui/themed';

//Se debe refactorizar en el futuro: Formik y yupi

const RequestAppointment = ({ navigation }) => {

    const [checked, setChecked] = useState(false);
    const [receipt, setReceipt] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');

    const sendForm = async () => {
        if (!receipt || !phoneNumber) {
            alert('Para solicitar una cita de pre-revisón, debes ingresar los datos correspondientes..');
            return;
        }
        
        if (!checked) {
            alert('Para solicitar una cita de pre revisión, debes marcar la casilla de confirmación.');
            return;
        }

        try {
            const response = await axios.post(`${config.API_URL}/reviews`, {
                id: receipt,
                phone_number: phoneNumber,
            });

            if (response.data.standby) {
                setName(response.data.name);
                AsyncStorage.setItem('@requestId', JSON.stringify(response.data.standby));
                AsyncStorage.setItem('@requestName', 'standby');

                setTimeout(() => {
                    alert('Su cita ha sido agendada con éxito.');
                }, 500);

                setTimeout(() => {
                    navigation.navigate('StandbyOnBoarding', {
                        id: response.data.standby,
                        name: 'standby',
                    });
                }, 1000);
            }
            else {
                setName(response.data.review.name);
                AsyncStorage.setItem('@requestId', JSON.stringify(response.data.review.id));
                AsyncStorage.setItem('@requestName', 'review');

                setTimeout(() => {
                    alert('Su cita ha sido agendada con éxito.');
                }, 500);

                setTimeout(() => {
                    navigation.navigate('ReviewOnBoarding', {
                        id: response.data.review.id,
                        name: 'review',
                    });
                }, 1000);
            }

            //Falta realizar una mejor validacion con alguna libreria front-end
        }
        catch (error) {
            alert('El recibo es incorrecto o ya existe una cita para ese recibo.');
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textPrimary}>Solicitud</Text>
            <Text style={styles.textSecundary}>Pre-revisión</Text>

            <TextInput style={styles.inputText} placeholder="Ingresa el número de recibo" onChangeText={e => setReceipt(e)} value={receipt} />
            <TextInput style={styles.inputText} placeholder="Ingresa el número de telefono" onChangeText={e => setPhoneNumber(e)} value={phoneNumber} />

            <CheckBox
                title="¿Has verificado los datos ingresados?"
                checked={checked}
                checkedColor="#3b82f6"
                onPress={() => setChecked(!checked)}
                textStyle={{ fontWeight: "300", color: "gray" }}
                containerStyle={{ margin: 0, padding: 0, textAlign: "left", justifyContent: "flex-start", alignItems: "flex-start" }}
            />

            <Button
                title={'Enviar solicitud'}
                containerStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 35,
                    marginBottom: 20
                }}
                buttonStyle={{
                    backgroundColor: "#3b82f6",
                    borderRadius: 3,
                    paddingHorizontal: 15,
                    paddingVertical: 10
                }}
                onPress={() => sendForm()}
                //Agregar loading
            />

            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    navigation.navigate('Requirements');
                }}>
                <Text style={{ textAlign: "center", fontSize: 14, color: "#43484d" }} >Revisa los <Text style={{ fontWeight: "bold" }}>requerimientos</Text> antes de enviar la solicitud </Text>
            </TouchableOpacity>
        </View>
    );
}

export default RequestAppointment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 30,
        backgroundColor: "white"
    },
    textPrimary: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: "#43484d"
    },
    textSecundary: {
        fontSize: 14,
        fontWeight: "400",
        textAlign: "center",
        color: "gray",
        marginBottom: 15
    },
    inputText: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#D9D9D9",
        padding: 8,
        marginBottom: 15
    },
    button: {
        backgroundColor: "#000",
        padding: 10,
        margin: 10
    },
    buttonText: {
        color: "#fff"
    },
    input: {
        borderWidth: 1,
        borderColor: "#000",
        padding: 10,
        margin: 10
    },
    inputDisabled: {
        borderWidth: 1,
        borderColor: "#000",
        padding: 10,
        margin: 10,
        backgroundColor: "#eee"
    },
    checkboxContainer: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        margin: 8
    },
    paragraph: {
        margin: 10,
        fontSize: 15
    },
    textFooter: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "auto"
    }
});