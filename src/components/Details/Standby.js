import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../../config';
import { Button } from '@rneui/themed';
const Standby = ({standby_id}) => {

  const [receipt, setReceipt] = useState('');
  const [name, setName] = useState('');
  const [dateRequest, setDateRequest] = useState('');

  useEffect(() => {
      const getData = async () => {
          try {
              const response = await axios.get(`${config.API_URL}/standbys/${standby_id}`); 
              setReceipt(response.data.standby.id);
              setName(`${response.data.standby.name}`);
            setDateRequest(response.data.standby.date_request);
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
        <Text style={styles.textSecundary}>{dateRequest}</Text>
    </View>
    <View>
        <View style={styles.itemsContainerMessage}>
            <Text style={styles.itemLeft}>¡Hola {name}!</Text>
            <Text style={styles.itemRight}>Aún no se ha definido la fecha de tú pre revisión, esperamos tener pronto una respuesta.</Text>
        </View>
        <View style={styles.itemsContainer}>
            <Text style={styles.itemLeft}>Número de revisión</Text><Text style={styles.itemRight}>#{receipt}</Text>
        </View>
        <View style={styles.sendEmailContainer}>
            <Text style={styles.emailTitleContainer}>Si necesitas ayuda, puedes contactar al departamento de soporte por medio de un correo.</Text>
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
                    paddingVertical: 10,
                }}
                onPress={() => Linking.openURL('mailto:jagudo2514@gmail.com')}
            />
        </View>
    </View>
</View>
  )
}

export default Standby


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
  itemsContainerMessage: {
    paddingHorizontal: 10,
    borderBottomColor: '#747474',
    borderBottomWidth: 1,
    height: 110,
    justifyContent: 'center',
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
  },
  sendEmailContainer: {
      marginVertical: 30,
      paddingHorizontal: 10,
      height: 110,
      justifyContent: 'center',
      alignItems: 'center',
  },
  emailTitleContainer: {
      fontSize: 14, 
      fontWeight: '400',
      textAlign: 'center',
  }
});

