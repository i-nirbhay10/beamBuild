import React from 'react';
import {View} from 'react-native';

import ProjectsScreenBase from '../../common/project/ProjectsScreenBase';

export default function MyProjectsScreen({navigation}) {
  return (
    <View style={{flex: 1}}>
      <ProjectsScreenBase navigation={navigation} />
    </View>
  );
}
