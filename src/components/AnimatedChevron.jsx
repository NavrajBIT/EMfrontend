import React, { useRef } from 'react';
import { View, TouchableWithoutFeedback, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo'

const ChevronButton = ({ direction, onPress }) => {
  const animationValue = useRef(new Animated.Value(0)).current;



  const onPressIn = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
s
  const onPressOut = () => {
    Animated.timing(animationValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const rotate = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', direction === 'right' ? '90deg' : '-90deg'],
  });

  return (
    <TouchableWithoutFeedback onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <View style={styles.button}>
        <Animated.View style={[styles.iconContainer, { transform: [{ rotate }] }]}>
          <Icon name={direction === 'right' ? 'chevron-right' : 'chevron-left'} size={24} color="white" />
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChevronButton;
