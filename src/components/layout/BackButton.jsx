import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // or your icon library

const BackButton = ({navigation, title = 'Back', style}) => {
  return (
    <TouchableOpacity
      style={[styles.backBtn, style]}
      activeOpacity={0.8}
      onPress={() => navigation.goBack()}>
      <Icon name="arrow-left" size={14} />
      <Text style={styles.backText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default BackButton;
