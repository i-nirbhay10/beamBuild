import React from 'react';
import {View, Text, FlatList} from 'react-native';

const SupervisorDashboard = ({projects, members}) => {
  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 20, marginBottom: 10}}>Supervisor Dashboard</Text>

      <Text style={{fontWeight: 'bold'}}>Projects Overview:</Text>
      <FlatList
        data={projects}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <Text>
            - {item.name} (Tasks: {item.tasks?.length || 0})
          </Text>
        )}
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

export default SupervisorDashboard;
