import React from 'react';
import {View, Text, FlatList} from 'react-native';

const WorkerDashboard = ({projects, members}) => {
  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 20, marginBottom: 10}}>Worker Dashboard</Text>

      <Text style={{fontWeight: 'bold'}}>Projects:</Text>
      <FlatList
        data={projects}
        keyExtractor={item => item._id}
        renderItem={({item}) => <Text>- {item.name}</Text>}
      />

      <Text style={{fontWeight: 'bold', marginTop: 10}}>Team Members:</Text>
      <FlatList
        data={members}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <Text>
            - {item.name} ({item.role})
          </Text>
        )}
      />
    </View>
  );
};

export default WorkerDashboard;
