import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {useData} from '../../context/DataContext';

export default function RecentTasks() {
  const {tasks, users} = useData();
  const recent = tasks.slice(0, 5); // last 5 tasks

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Recent Tasks</Text>
      {recent.map(t => {
        const assignee = users.find(u => u.id === t.assigneeId) || {};
        return (
          <View key={t.id} style={styles.taskRow}>
            <View style={styles.avatarSmall}>
              <Image source={{uri: assignee.avatar}} style={styles.avatarImg} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.taskTitle}>{t.title}</Text>
              <Text style={styles.taskSubtitle}>
                {assignee.name || 'Unassigned'}
              </Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text
                style={[
                  styles.badge,
                  t.status === 'completed'
                    ? styles.badgeSuccess
                    : styles.badgeNeutral,
                ]}>
                {t.status.replace('-', ' ')}
              </Text>
              <Text style={styles.taskDue}>
                {new Date(t.dueDate).toLocaleDateString()}
              </Text>
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
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f2f6',
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  avatarImg: {width: 40, height: 40, borderRadius: 8, resizeMode: 'cover'},
  taskTitle: {fontWeight: '700'},
  taskSubtitle: {color: '#777', fontSize: 12},
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
  },
  badgeSuccess: {backgroundColor: '#e6ffed', color: '#1b8a3e'},
  badgeNeutral: {backgroundColor: '#f3f4f6', color: '#6b7280'},
  taskDue: {color: '#777', fontSize: 11, marginTop: 6},
});
