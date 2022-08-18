import { View, Text, Button,StyleSheet, FlatList } from "react-native";
import { Video, AVPlaybackStatus } from 'expo-av';
import React, {Component} from 'react';
import { Header, ListItem, Avatar, Card, Icon, Divider } from '@rneui/themed';

const Requirements = () => {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    return (
      <View style={styles.container}>
        <Card>
        <Card.Title>VIDEO</Card.Title>
          <Card.Divider />
          <Video
          ref={video}
          style={styles.video}
          source={{
            uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
          }}
          useNativeControls
          resizeMode="contain"
          isLooping
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
          <Text style={{ marginBottom: 10, lineHeight: 20 }}>
            Para solicitar el servicio de pre revisión de graduandos, debes tener en cuenta los siguientes requerimientos:
            </Text>
            <FlatList
        data={[
          {key: 'Cédula.'},
          {key: 'Creditos.'},
          {key: 'Foto tamaño carnet.'},
        ]}
        renderItem={({item}) => <Text style={styles.item}>{'\u2B24' + '  '}<Text style={styles.key}>{item.key}</Text></Text>}
      />

          <Button
            color="#3b82f6"
            title="Leer más"
          />
        </Card>
      </View>
    );
}
export default Requirements;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    video: {
      alignSelf: 'center',
      width: 335,
      height: 220,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    item: {
      fontSize: 13,
      height: 25,
      
    }
  });