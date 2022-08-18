import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, ImageBackground, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from "expo-status-bar";
import Svg, { G, Circle } from 'react-native-svg';
import { config } from "../config";
import axios from 'axios';
import { Header, ListItem, Card, Icon, Divider,  BottomSheet } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';

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
  const clearOnBoarding = async () => {
    try {
      await AsyncStorage.removeItem('@viewedOnBoarding');
      await AsyncStorage.removeItem('@requestId');
      await AsyncStorage.removeItem('@requestNameId');
    }
    catch (error) {
      console.log('Error @clearOnBoarding: ', error)
    }
  }
  clearOnBoarding();

  const [id, setId] = useState(null);
  const [name, setName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const [dateRequest, setDateRequest] = useState('');
  const [dateReview, setDateReview] = useState('');
  const [analystName, setAnalystName] = useState('');
  
  const list = [
    { title: 'Llamar al 300-5000' },
    { title: 'Chatear por WhatsApp' },
    { title: 'Enviar correo electrónico' },
    {
      title: 'Cerrar',
      containerStyle: { backgroundColor: '#3b82f6' },
      titleStyle: { color: 'white' },
      onPress: () => setIsVisible(false),
    },
  ];

  useEffect(() => {
    if (route.params?.id) {
      AsyncStorage.setItem('@requestId', JSON.stringify(route.params.id));
      AsyncStorage.setItem('@requestName', route.params.name);

      checkIfOnBoardingRequest();

    }
  }, [route.params?.id]);

  // Esto solo se ejecuta una vez, cuando se carga la pantalla.
  const checkIfOnBoardingRequest = async () => {
    try {
      const request = await AsyncStorage.getItem("@requestId")
      const requestName = await AsyncStorage.getItem("@requestName")
      if (request !== null) {

        //Se obtiene la información del storage
        setId(JSON.parse(request));
        setName(requestName);

        //Se verifica si es un standby, para luego consultar si ya ha entrado en la entidad de revisión.
        if (requestName === 'standby') {
          const response = await axios.get(`${config.API_URL}/reviews/${JSON.parse(request)}/standbys`);

          if (response.data.review) {

            AsyncStorage.setItem('@requestId', JSON.stringify(response.data.review));
            AsyncStorage.setItem('@requestName', 'review');
            setId(JSON.parse(response.data.review));
            setName('review');

            //F1
            const response = await axios.get(`${config.API_URL}/reviews/${JSON.parse(request)}`);
            setDateRequest(response.data.review.date_request);
            setDateReview(response.data.review.date_review);
            setAnalystName(response.data.review.user.name);
          }
          else{
            //F2
            const response = await axios.get(`${config.API_URL}/standbys/${JSON.parse(request)}`);
            setDateRequest(response.data.standby.date_request);
          }
        }
        else{
          //F1
          const response = await axios.get(`${config.API_URL}/reviews/${JSON.parse(request)}`);
          setDateRequest(response.data.review.date_request);
          setDateReview(response.data.review.date_review);
          setAnalystName(response.data.review.user.name);
        }

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
  
    const requeriments = { uri: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80" };
  const operation = { uri: "https://images.unsplash.com/photo-1612831455359-970e23a1e4e9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1325&q=80" };


  const size = 90;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={styles.container}>
      <Header
        backgroundColor="#3b82f6"
        barStyle="default"
        centerComponent={{
          text: "SESACRUVAPP",
          style: { color: "#fff", fontSize: 16 }
        }}
        centerContainerStyle={{}}
        containerStyle={{ width: Dimensions.get("window").width }}
        leftComponent={
          <TouchableOpacity onPress={() => setIsVisible(true)} >
            <Icon name="contact-support" color="white" />
          </TouchableOpacity>
        }
        leftContainerStyle={{}}
        linearGradientProps={{}}
        placement="center"
        rightComponent={
          <TouchableOpacity >
            <Icon name="close" color="white" />
          </TouchableOpacity>
        }
        rightContainerStyle={{}}
        statusBarProps={{}}
      />

      <BottomSheet modalProps={{}} isVisible={isVisible}>
        {list.map((l, i) => (
          <ListItem
            key={i}
            containerStyle={l.containerStyle}
            onPress={l.onPress}
          >
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>

      <Card>
        <Card.Title style={{ textAlign: 'left' }}>INFORMACIÓN</Card.Title>
        <Card.Divider />
        <View style={styles.vertical}>
          <TouchableOpacity
            style={styles.buttonFacebookStyle}
            activeOpacity={0.5}
            onPress={() => {
              navigation.navigate('Requirements');
            }}
          >
            <ImageBackground source={requeriments} resizeMode="cover" style={styles.image} imageStyle={{ borderRadius: 6 }}>
              <Text style={styles.text}>Requerimientos</Text>
            </ImageBackground>
          </TouchableOpacity>
          <Divider orientation="vertical" />
          <TouchableOpacity
            style={styles.buttonFacebookStyle}
            activeOpacity={0.5}
            onPress={() => {
              navigation.navigate('Operation');
            }}
          >
            <ImageBackground source={operation} resizeMode="cover" style={styles.image} imageStyle={{ borderRadius: 6 }}>
              <Text style={styles.text}>Funcionamiento</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </Card>

      <Card>
        <Card.Title style={{ textAlign: 'left' }}>SOLICITUD</Card.Title>
        <Card.Divider />
        {isLoading ? loading()
          :
          id ?
            name === 'review' ?
              <TouchableOpacity
                style={styles.buttonRequest}
                activeOpacity={0.5}
                onPress={() => {
                  navigation.navigate('Details', {
                    id: id,
                    name: name
                  });
                }}
              >
                <View style={stylesButtonReview.vertical}>
                  <Text style={stylesButtonReview.textPrimary}>Pre-revisión  <FontAwesome name="bell-o" size={16} color="#43484d" /></Text>
                  <Text style={stylesButtonReview.dateRequest}>Solicitud: {dateRequest}</Text>
                </View>

                <View style={stylesButtonReview.vertical}>
                  <View style={stylesButtonReview.containerDetails}>
                    <View>
                      <Text style={stylesButtonReview.analystTitle}>Analista</Text>
                      <Text style={stylesButtonReview.analystName}>{analystName}</Text>
                    </View>

                    <View>
                      <Text style={stylesButtonReview.dateReview}><Fontisto name="date" size={16} color="black" />  Resultados: {dateReview}</Text>
                    </View>
                  </View>
                  <View style={stylesButtonReview.containerPercentage}>
                    <Svg width={size} height={size}>
                      <G rotation="-90" origin={center}>
                        <Circle cx={center} cy={center} r={radius} strokeWidth={strokeWidth} stroke="#E6E7E8" />
                        <Circle
                          stroke="#3b82f6"
                          cx={center}
                          cy={center}
                          r={radius}
                          strokeWidth={strokeWidth}
                          strokeDasharray={circumference}
                          strokeDashoffset={circumference - (circumference * 50) / 100}
                        />
                      </G>
                    </Svg>
                    <Text style={styles.textPercentage}>50%</Text>
                  </View>
                </View>

              </TouchableOpacity>
              :
              <TouchableOpacity
                style={styles.buttonRequest}
                activeOpacity={0.5}
                onPress={() => {
                  navigation.navigate('Details', {
                    id: id,
                    name: name
                  });
                }}
              >
                <View style={stylesButtonReview.vertical}>
                  <Text style={stylesButtonReview.textPrimary}>Pre-revisión  <FontAwesome name="bell-o" size={16} color="#43484d" /></Text>
                  <Text style={stylesButtonReview.dateRequest}>Solicitud: {dateRequest}</Text>
                </View>

                <View style={stylesButtonReview.vertical}>
                  <View style={stylesButtonReview.containerDetails}>
                    <View>
                      <Text style={stylesButtonReview.analystTitle}>Analista</Text>
                      <Text style={stylesButtonReview.analystName}>Por asignar</Text>
                    </View>

                    <View>
                      <Text style={stylesButtonReview.dateReview}><Fontisto name="date" size={16} color="black" />  Sin fecha prevista de resultados</Text>
                    </View>
                  </View>
                  <View style={stylesButtonReview.containerPercentage}>
                    <Svg width={size} height={size}>
                      <G rotation="-90" origin={center}>
                        <Circle cx={center} cy={center} r={radius} strokeWidth={strokeWidth} stroke="#E6E7E8" />
                        <Circle
                          stroke="#3b82f6"
                          cx={center}
                          cy={center}
                          r={radius}
                          strokeWidth={strokeWidth}
                          strokeDasharray={circumference}
                          strokeDashoffset={circumference - (circumference * 25) / 100}
                        />
                      </G>
                    </Svg>
                    <Text style={styles.textPercentage}>25%</Text>
                  </View>
                </View>

              </TouchableOpacity>
            :
            <TouchableOpacity
              style={styles.buttonRequest}
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate('RequestAppoinment');
              }}
            >
              <View style={styles.containerPercentage}>
                <Svg width={size} height={size}>
                  <G rotation="-90" origin={center}>
                    <Circle cx={center} cy={center} r={radius} strokeWidth={strokeWidth} stroke="#E6E7E8" />
                    <Circle
                      stroke="#3b82f6"
                      cx={center}
                      cy={center}
                      r={radius}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - (circumference * 0) / 100}
                    />
                  </G>
                </Svg>
                <Text style={styles.textPercentage}>0%</Text>
              </View>
              <Text style={styles.textRequest}>Iniciar solicitud</Text>
            </TouchableOpacity>
        }
      </Card>
      <StatusBar style="auto" />
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  vertical: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  image: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    borderRadius: 100
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0"
  },
  button: {
    position: 'absolute',
    borderRadius: 100,
    padding: 20,
  },
  containerPercentage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRequest: {
    height: 130,
  },
  textPercentage: {
    color: '#43484d',
    fontSize: 18,
    textAlign: 'center',
    position: 'absolute',
    padding: 20,
  },
  textRequest: {
    color: '#43484d',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const stylesButtonReview = StyleSheet.create({
  vertical: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textPrimary: {
    color: "#43484d",
    fontSize: 18,
    fontWeight: "bold",
  },
  dateRequest: {
    color: "#43484d",
    fontSize: 12,
    fontWeight: "400",
  },
  containerDetails: {
    height: 80,
    justifyContent: 'space-between',
    width: '70%',
  },
  analystTitle: {
    color: "#43484d",
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 5,
  },
  analystName: {
    color: "#43484d",
    fontSize: 12,
    fontWeight: "300",
  },
  dateReview: {
    color: "#43484d",
    fontSize: 12,
    fontWeight: "400",
  },
  containerPercentage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});    