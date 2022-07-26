import { View, Text } from "react-native";
import { useState, useEffect } from "react";


const loading = () => {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
};

const Messages = ({route}) => {

    const [id, setId] = useState(route.params.id);
    const [isLoading, setIsLoading] = useState(true);

    
    return (
        <View>
        <Text>Messages</Text>
        </View>
    );
}

export default Messages;
