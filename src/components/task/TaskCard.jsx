import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {getUserById, getProjectById} from '../../data/mockData';

const statusColors = {
  pending: '#f59e0b',
  'in-progress': '#3b82f6',
  completed: '#10b981',
  blocked: '#ef4444',
};

const priorityColors = {
  low: '#d1d5db',
  medium: '#fbbf24',
  high: '#f87171',
  urgent: '#dc2626',
};

export default function TaskCard({task}) {
  const assignee = getUserById(task.assigneeId);
  const project = getProjectById(task.projectId);
  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <View
      style={[
        styles.card,
        {borderLeftColor: priorityColors[task.priority] || '#000'},
      ]}>
      <View style={styles.header}>
        <View style={styles.badges}>
          <Text
            style={[
              styles.badge,
              {backgroundColor: statusColors[task.status] || '#ccc'},
            ]}>
            {task.status.replace('-', ' ')}
          </Text>
          <Text
            style={[
              styles.badge,
              {
                backgroundColor: '#fff',
                color: '#000',
                borderWidth: 1,
                borderColor: '#ccc',
              },
            ]}>
            {task.priority}
          </Text>
          {isOverdue && (
            <Text style={[styles.badge, {backgroundColor: '#ef4444'}]}>
              Overdue
            </Text>
          )}
        </View>
        <TouchableOpacity>
          <Icon name="more-vertical" size={20} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {task.title}
      </Text>
      <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
        {task.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.assignee}>
          <Image
            source={{uri: assignee?.avatar || 'https://via.placeholder.com/40'}}
            style={styles.avatar}
          />
          <Text numberOfLines={1} ellipsizeMode="tail">
            {assignee?.name || 'Unassigned'}
          </Text>
        </View>
        <View style={styles.projectContainer}>
          <Text style={styles.project} numberOfLines={1} ellipsizeMode="tail">
            {project?.name || 'No Project'}
          </Text>
          <Text style={styles.dueDate}>
            {new Date(task.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  badges: {flexDirection: 'row'},
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
    color: '#fff',
    marginRight: 6,
  },
  title: {fontWeight: '700', fontSize: 14, marginBottom: 2},
  description: {fontSize: 12, color: '#555', marginBottom: 6},
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assignee: {flexDirection: 'row', alignItems: 'center'},
  avatar: {width: 24, height: 24, borderRadius: 12, marginRight: 6},
  projectContainer: {alignItems: 'flex-end'},
  project: {fontSize: 10, color: '#555'},
  dueDate: {fontSize: 10, color: '#555'},
});
