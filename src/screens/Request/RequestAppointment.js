import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import CheckBox from 'expo-checkbox';
import axios from 'axios';
import { config } from '../../config';

const RequestAppointment = ({navigation}) => {

    const [isChecked, setChecked] = useState(false);
    const [receipt, setReceipt] = useState('');
    const [name, setName] = useState('');
    const [identification, setIdentification] = useState('');

    const sendForm = async () => {
        if(!isChecked) {
            alert('Para solicitar um agendamento, você deve aceitar os termos e condições.');
            return;
        }

        if(!receipt) {
            alert('Para solicitar um agendamento, você deve informar o número do recibo.');
            return;
        }

        try{
            const response = await axios.post(`${config.API_URL}/reviews`, {
                receipt_number: receipt
            });

            if(response.data.standby){
                alert('Actualmente no hay citas disponibles, ha ingresado en una lista de espera.');
                navigation.navigate('Home');
                //Aqui se debe guardar en local storage el id de la standby, para que se pueda acceder a el desde el home
                //Se puede crear una introduccion a la lista de esperas, y luego una de Details para ese caso...
            }
            else{
                //Aqui se debe guardar en local storage el id de la cita, para que se pueda acceder a el desde el home
                setName(response.data.review.student.name);
                setIdentification(response.data.review.student.identity_card);

                setTimeout(() => {
                    alert('Su cita ha sido agendada con éxito.');
                }, 500);

                setTimeout(() => {
                    navigation.navigate('Request',{
                        id: response.data.review.id,
                    });
                }, 1000);
        }

            //Falta realizar una mejor validacion con alguna libreria front-end
        }
        catch(error){
            alert('El recibo es incorrecto o ya existe una cita para ese recibo.');
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Request Appointment</Text>
            
            <TextInput style={styles.input} placeholder="Receipt number" onChangeText={e => setReceipt(e)} value={receipt} />
            <TextInput style={styles.inputDisabled} placeholder="Name" editable={false} selectTextOnFocus={false} onChangeText={e => setName(e)} value={name} />
            <TextInput style={styles.inputDisabled} placeholder="Identification" editable={false} selectTextOnFocus={false} onChangeText={e => setIdentification(e)} value={identification} />

            <View style={styles.checkboxContainer}>
                <CheckBox
                    style={styles.checkbox}
                    value={isChecked} 
                    onValueChange={setChecked}
                    color="#000"
                />
                <Text style={styles.paragraph}>¿Has verificado los datos ingresados?</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={sendForm}>
                <Text style={styles.buttonText}>Enviar Solicitud</Text>
            </TouchableOpacity>
            <Text style={styles.paragraph}>¿Has revisado los requerimientos?                                
            <TouchableOpacity><Text>Revisar</Text></TouchableOpacity>
            </Text>
        </View>
    );
}

export default RequestAppointment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center"
    },
    text: {
        fontSize: 30
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
    }
});