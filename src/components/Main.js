import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//Import personal components
import Home from '../../src/screens/Home';
import Requirements from '../../src/screens/Information/Requirements';
import Operation from '../../src/screens/Information/Operation';
import Support from '../../src/screens/Support/Support';
import Contact from '../../src/screens/Support/Contact';
import Terms from '../../src/screens/Support/Terms';
import RequestAppoinment from '../../src/screens/Request/RequestAppointment';
import Details from '../../src/screens/Request/Appoiment/Details';
import Messages from '../../src/screens/Request/Appoiment/Messages';

//Slides
import Request from './Onboarding/request/Onboarding';
import { HeaderBackButton } from '@react-navigation/elements';

const Stack = createNativeStackNavigator();

const Main = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={Home} options={{ headerShown: false}}/>
                <Stack.Group>
                    <Stack.Screen name="Requirements" component={Requirements}/>
                    <Stack.Screen name="Operation" component={Operation}/>
                </Stack.Group>

                <Stack.Group>
                    <Stack.Screen name="Support" component={Support}/>
                    <Stack.Screen name="Contact" component={Contact}/>
                    <Stack.Screen name="Terms" component={Terms}/>
                </Stack.Group>

                <Stack.Group>
                    <Stack.Screen name="RequestAppoinment" component={RequestAppoinment} options={{ headerShown: false}}/>

                    <Stack.Screen name="Request" component={Request} options={{ headerShown: false}}/>
                    <Stack.Screen name="Details" component={Details} options={({ navigation, route }) => ({
                    title: 'Pre-revisión',
                    headerLeft: (props) => (
                        <HeaderBackButton 
                        {...props}
                        onPress={()  =>{ navigation.navigate('Home', {
                            id: route.params.id,
                        }); }} 
                        />
                    ),
                    })} />
                    <Stack.Screen name="Messages" component={Messages}/>
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Main;