import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';

/**
 * SwipeControl Component
 * @param {function} onSwipe - Callback function triggered when swipe action is performed
 * @param {object} newsData - Data containing news information
 */
const SwipeControl = ({onSwipe}) => {
  // Refs for the pan gesture and previous position
  const pan = useRef(new Animated.Value(0)).current;
  const prevPosition = useRef(0);

  // Get the width of the screen
  const containerWidth = Dimensions.get('window').width - 32;

  // PanResponder for handling touch events
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

          // Update the previous position for reference
          prevPosition.current = newX;
        }
      },
      onPanResponderRelease: async (evt, gestureState) => {
        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: false,
        }).start();

        if (Math.abs(gestureState.dx) >= containerWidth / 2 && onSwipe) {
          onSwipe();
        } else {
          // If the circle returns to its original position, animate the background color with it
          Animated.spring(pan, {
            toValue: prevPosition.current,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  // Calculate the width and left position of the background color view dynamically
  const bgColorWidth = pan.interpolate({
    inputRange: [0, containerWidth - 80],
    outputRange: [0, containerWidth - 80],
    extrapolate: 'clamp',
  });

  const bgColorLeft = pan.interpolate({
    inputRange: [0, containerWidth - 300],
    outputRange: [-containerWidth + 300, 0],
    extrapolate: 'clamp',
  });

  // JSX rendering
  return (
    <View style={styles.bgContainer}>
      {/* Background color view */}
      <Text style={styles.sliderText}>Swipe To Fetch News</Text>
      <Animated.View
        style={[styles.bgColor, {width: bgColorWidth, left: bgColorLeft}]}
        
      />

      {/* Circle */}
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{translateX: pan}],
            top: 10, // Adjust the top position as needed
            left: 10, // Adjust the left position as needed
          },
        ]}
        {...panResponder.panHandlers}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  bgContainer: {
    backgroundColor: '#000',
    marginHorizontal: 16,
    height: 90,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden', // Ensure that the overflowing color doesn't show outside the container
  },
  sliderText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    zIndex: 1,
  },
  circle: {
    position: 'absolute',
    top: 10, // Adjust the top position as needed
    height: 70,
    width: 70,
    backgroundColor: 'orange',
    borderRadius: 100,
    zIndex: 3,
    left: 10, // Ensure the circle appears above the background color
  },
  bgColor: {
    position: 'absolute',
    backgroundColor: '#ff5733', // Same as bgContainer background color
    height: '100%',
    zIndex: 2,
    width: 100,
    borderRadius: 100,
  },
});

export default SwipeControl;
