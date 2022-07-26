import { useWindowDimensions, StyleSheet, View, Animated } from 'react-native'

export default Paginator = ({ data, scrollX}) => {
    const { width } = useWindowDimensions();

    return (
        <View style={{ flexDirection: 'row', height: 64 }}>
            {data.map((_, index) => {
                const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                
                const dotWith = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 20, 10],
                    extrapolate: 'clamp',
                });

                const dotOpacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                });

                return <Animated.View style={[
                    styles.dot, 
                    {
                        width: dotWith,
                        opacity: dotOpacity,
                    }
                ]} 
                key={index.toString()} />
            })}
            
        </View>
    );
};

const styles = StyleSheet.create({
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#52525b',
        marginHorizontal: 8,
        marginVertical: 30,
    },
});