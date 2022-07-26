import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from "expo-status-bar"

const loading = () => {
  //Se utiliza para mostrar loading mientras se hace la peticion.
  return (
    <View>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

//Los componentes [] solo se renderizan una vez, esto es muy importante tomarlo en cuenta para cuando quieres que se actualice un valor.
const Home = ({ route, navigation }) => {
  /*const clearOnBoarding = async () => {
     try {
         await AsyncStorage.removeItem('@viewedOnBoarding');
         await AsyncStorage.removeItem('@requestId');
     }
     catch (error) {
         console.log('Error @clearOnBoarding: ',error)
     }
 }
 clearOnBoarding();*/

  useEffect(() => {
    if (route.params?.id) {
      setId(route.params.id);
    }
  }, [route.params?.id]);


  const [id, setId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkIfOnBoardingRequest = async () => {
    try {
      const value = await AsyncStorage.getItem("@requestId")
      if (value !== null) {
        console.log('value: ', value);
        setId(JSON.parse(value));
      } else {
        return false
      }
    }
    catch (error) {
      console.log('Error @checkIfOnBoardingRequest: ', error)
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkIfOnBoardingRequest()
  }
    , []);

  return (
    <View style={styles.container}>
      <View>
        <View>
          <Text style={styles.text}>Bienvenido</Text>
          <Text>SESACRUV APP MOBILE</Text>
        </View>
        <View>
          <Button style={styles.button} title="Salir" onPress={() => navigation.navigate("Login")} />
        </View>

        <View>
          <Text style={styles.text}>Información</Text>
          <View>
            <Button style={styles.button} title="Requisitos" onPress={() => navigation.navigate("Requirements")} />
            <Button style={styles.button} title="Operación" onPress={() => navigation.navigate("Operation")} />
          </View>
        </View>
        <View>
          <Text style={styles.text}>Solicitud</Text>
          {isLoading ? loading() : 
            id ? 
            <Button style={styles.button} title="Go to Details" onPress={() => {
              navigation.navigate('Details', { id});
            }
            } />: 
            <Button style={styles.button} title="Go to Request" onPress={() => {
              navigation.navigate('RequestAppoinment');
            }
            } />}

        </View>
        <View>
          <Text style={styles.text}>Soporte</Text>
          <Button style={styles.button} title="Go to Support" onPress={() => {
            navigation.navigate('Support');
          }
          } />
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});