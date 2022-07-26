import { StatusBar } from "expo-status-bar"
import { useState, useEffect } from "react"
import { ActivityIndicator, View } from "react-native"
import Main from "./src/components/Main"

import Constants from "expo-constants"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Start from "./src/components/Start"

const loading = () => {
  return (
    <View>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [viewedOnboarding, setViewedOnboarding] = useState(false);
  
  const checkIfOnBoarding = async () => {
    try {
      const value = await AsyncStorage.getItem("@viewedOnBoarding")
      if (value !== null) {
        setViewedOnboarding(true)
      } else {
        return false
      }
    }
    catch (error) {
      console.log('Error @checkIfOnBoarding: ',error)
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkIfOnBoarding()
  }
  , []);

  return (
  <View style={{ marginTop: Constants.statusBarHeight, flexGrow: 1 }}>
    {isLoading ? loading() : viewedOnboarding ? <Main /> : <Start />}
    <StatusBar style="auto" />
  </View>
  )
}