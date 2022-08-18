import { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, } from "react-native";
import axios from 'axios';
import { config } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native';
import Review from '../../../components/Details/Review';
import Standby from '../../../components/Details/Standby';
import { HeaderBackButton } from '@react-navigation/elements';

const loading = () => {
    //Se utiliza para mostrar loading mientras se hace la peticion.
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
};

const Details = ({ route, navigation }) => {

    const [id, setId] = useState(route.params.id);
    const [name, setName] = useState(route.params.name);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        if (route.params?.id) {
            if(route.params.name == 'standby'){
                checkIfOnBoardingRequest(route.params.id, route.params.name);
            }
        }

    }), [route.params?.id];

    const checkIfOnBoardingRequest = async (id, name) => {
        try{
            const response = await axios.get(`${config.API_URL}/reviews/${id}/standbys`);

            if (response.data.review) {
              setId(response.data.review);
              setName('review');
              console.log('hubo una review');
              navigation.setOptions({headerLeft: (props) => (
                <HeaderBackButton 
                {...props}
                onPress={()  =>{ 
                    navigation.navigate('Home', {
                    id: response.data.review,
                    name: 'review'
                }); }} 
                />
            ) });
              AsyncStorage.setItem('@requestId', JSON.stringify(id));
              AsyncStorage.setItem('@requestName', name);
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
        checkIfOnBoardingRequest(id, name);
    }
    , []);

    return (
        <View style={styles.container}>
            {isLoading ? loading() : name == "review" ? <Review review_id={id} /> : <Standby standby_id={id}/>}
            <StatusBar style="auto" />
        </View>
    );
}

export default Details;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 30,
        backgroundColor: "white"
    },
});