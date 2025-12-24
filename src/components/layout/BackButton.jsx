import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const BackButton = ({navigation, title = 'Back', style}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.container, style]}
      onPress={() => navigation.goBack()}>
      <View style={styles.iconWrapper}>
        <Icon name="arrow-left" size={18} color="#1F2937" />
      </View>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingRight: 14,
    paddingLeft: 6,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',

    // Shadow (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},

    // Shadow (Android)
    elevation: 3,
  },
  iconWrapper: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});

export default BackButton;
