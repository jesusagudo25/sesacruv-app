import { useRef,useState } from "react";
import { View, Text, StyleSheet, FlatList, Animated} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import OnboardingItem from "./OnboardingItem";
import Paginator from "../Paginator";
import slides from "../../../data/slides/standby.js";
import NextButton from "../NextButton";

export default function Onboarding({route, navigation}) {

    const {id,name} = route.params;

    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const viewlableItemsChanged = useRef(({viewableItems}) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
    
    const scrollTo = async () => {
        if(currentIndex < slides.length - 1) {
            slidesRef.current.scrollToIndex({
                index: currentIndex + 1,
            });
        }else {
            try {
                navigation.navigate('Details',{
                    id: id,
                    name: name
                });
            }
            catch (error) {
                console.log('Error @scrollTo: ',error)
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 3 }}>
                <FlatList 
                    data={slides}
                    renderItem={({item}) => <OnboardingItem item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll= {Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}],{
                        useNativeDriver: false
                    })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewlableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </View>

            <Paginator data={slides} scrollX={scrollX}/>
            <NextButton scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / slides.length)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    }
});