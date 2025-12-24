import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import ProjectsScreenBase from '../../common/project/ProjectsScreenBase';

const MyProjects = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <ProjectsScreenBase navigation={navigation} />
    </View>
  );
};

export default MyProjects;

const styles = StyleSheet.create({});
