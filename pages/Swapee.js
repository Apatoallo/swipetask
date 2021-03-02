import React, { useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  SafeAreaView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const {width, height} = Dimensions.get('screen');

function useWishes() {
  
  const [img, setWishes] = useState([])
  useEffect(() => {
       firestore()
       .collection('swapList')
       .onSnapshot((snapshot) => {
           const newWishes = snapshot.docs.map((doc)=> (
            {
               id: doc._data.id,
               name: doc._data.name,
               imageURL: doc._data.imageURL,
               positionX: doc._data.positionX,
               positionY: doc._data.positionY,
               centered: doc._data.centered,
               width: doc._data.width,
               height: doc._data.height,
               swipeDegrees: doc._data.swipeDegrees,

               ...doc.data()
           }))
           setWishes(newWishes)
       })
       return;
  }, [])
  return img,
  
}

const Carousel = () => {
  const xScroll = useRef(new Animated.Value(0)).current;
  const img = useWishes();
  return (
    <View style={style.container}>
      <Animated.FlatList
        style={style.flatList}
        data={img}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={width}
        decelerationRate={'fast'}
        keyExtractor={(_, index) => index.toString()}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: xScroll}}}],
          {useNativeDriver: true},
        )}
        renderItem={({item, index}) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const outputRange = [item.swipeDegrees[0], item.swipeDegrees[1], item.swipeDegrees[2]];
          // const outputRange = ['-90deg', '0deg', '90deg'];

          const translateX = xScroll.interpolate({inputRange, outputRange});

          return (
            <SafeAreaView>
            <View style={style.imageContainer}>
              <Animated.Image
                style={[style.image,{
                  height: item.height,
                  width: item.width,
                },
                item.centered === false && 
                {
                  top: item.positionX,
                  left: item.positionY,
                  position: 'absolute'
                },
                {transform: [{rotateZ: translateX}]}]}
                source={{uri: item.imageURL}}
              />
            </View>
            </SafeAreaView>
          );
        }}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    flexGrow: 0,
  },
  imageContainer: {
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    borderRadius: 50,
    resizeMode: 'cover',
  },
});

export default Carousel;