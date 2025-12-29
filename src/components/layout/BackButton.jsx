import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const BackButton = ({navigation, title = 'Title', rightComponent}) => {
  return (
    <View style={styles.container}>
      {/* Left */}
      <TouchableOpacity
        style={styles.left}
        activeOpacity={0.7}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={22} color="#111827" />
      </TouchableOpacity>

      {/* Center */}
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>

      {/* Right (optional placeholder to keep title centered) */}
      <View style={styles.right}>{rightComponent || null}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',

    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: {width: 0, height: 4},
      },
      android: {
        elevation: 6,
      },
    }),
  },
  left: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
});

export default BackButton;
