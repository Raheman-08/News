import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';

const SwipeControl = ({ onSwipe, newsData }) => {
  const pan = useRef(new Animated.Value(0)).current;
  const containerWidth = Dimensions.get('window').width - 32;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (evt, gestureState) => {
        const newX = gestureState.dx;
        if (newX >= 0 && newX <= containerWidth - 80) {
          pan.setValue(newX);
        }
      },
      onPanResponderRelease: async (evt, gestureState) => {
        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      
        if (Math.abs(gestureState.dx) >= containerWidth / 2 && onSwipe) {
          onSwipe();
        }
      },
    }),
  ).current;

  return (
    <View style={styles.bgContainer}>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ translateX: pan }],
          },
        ]}
        {...panResponder.panHandlers}
      />
      <Text style={styles.sliderText}>Swipe To Fetch News</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bgContainer: {
    backgroundColor: '#000',
    marginHorizontal: 16,
    height: 90,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sliderText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    zIndex: 1,
  },
  circle: {
    position: 'absolute',
    height: 80,
    width: 80,
    backgroundColor: 'orange',
    borderRadius: 100,
    zIndex: 2,
    left: 0,
    marginHorizontal: 5,
  },
});

export default SwipeControl;
