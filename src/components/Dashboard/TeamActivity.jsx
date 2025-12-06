import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {useData} from '../../context/DataContext';

const demoActivities = [
  {
    id: 'a1',
    userId: 'u2',
    action: 'completed task',
    target: 'Foundation inspection',
    time: '2h',
  },
  {
    id: 'a2',
    userId: 'u3',
    action: 'commented on',
    target: 'Steel framework',
    time: '4h',
  },
  {id: 'a3', userId: 'u5', action: 'started', target: 'Site prep', time: '1d'},
];

export default function TeamActivity() {
  const {users} = useData();

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Team Activity</Text>
      {demoActivities.map(a => {
        const u = users.find(x => x.id === a.userId) || {};
        return (
          <View key={a.id} style={styles.activityRow}>
            <Image source={{uri: u.avatar}} style={styles.avatarImg} />
            <View style={{marginLeft: 10, flex: 1}}>
              <Text style={styles.activityText}>
                <Text style={{fontWeight: '700'}}>{u.name}</Text>{' '}
                <Text style={{color: '#666'}}>{a.action}</Text>{' '}
                <Text style={{color: '#0b74ff'}}>{a.target}</Text>
              </Text>
              <Text style={styles.activityTime}>{a.time} ago</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 1,
  },
  cardTitle: {fontSize: 16, fontWeight: '700', marginBottom: 8},
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f2f6',
  },
  avatarImg: {width: 40, height: 40, borderRadius: 8},
  activityText: {fontSize: 14},
  activityTime: {fontSize: 12, color: '#888', marginTop: 4},
});
