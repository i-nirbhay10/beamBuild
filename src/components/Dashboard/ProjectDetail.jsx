import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useData} from '../../context/DataContext';

export default function ProjectDetail({projectId}) {
  const {projects, tasks, users, updateTaskStatus} = useData();
  const project = projects.find(p => p.id === projectId);
  const projectTasks = tasks.filter(t => t.projectId === projectId);

  if (!project)
    return (
      <View style={{padding: 16}}>
        <Text>Project not found</Text>
      </View>
    );

  return (
    <View style={{padding: 16}}>
      <Text style={styles.projectName}>{project.name}</Text>
      <Text style={styles.projectDesc}>{project.description}</Text>

      <Text style={styles.sectionTitle}>Tasks</Text>
      {projectTasks.map(t => {
        const assignee = users.find(u => u.id === t.assigneeId) || {};
        return (
          <View key={t.id} style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <Text style={{fontWeight: '700'}}>{t.title}</Text>
              <Text style={{color: '#666'}}>{t.priority}</Text>
            </View>
            <Text style={{marginTop: 6}}>{t.description}</Text>
            <View style={styles.taskMeta}>
              <Text>Assignee: {assignee.name || '-'}</Text>
              <Text>Due: {new Date(t.dueDate).toLocaleDateString()}</Text>
            </View>
            <View style={styles.taskButtons}>
              <TouchableOpacity
                onPress={() => updateTaskStatus(t.id, nextStatus(t.status))}
                style={[styles.smallBtn, {backgroundColor: '#1976D2'}]}>
                <Text style={{color: '#fff'}}>Next</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateTaskStatus(t.id, 'blocked')}
                style={[
                  styles.smallBtn,
                  {backgroundColor: '#D32F2F', marginLeft: 8},
                ]}>
                <Text style={{color: '#fff'}}>Block</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function nextStatus(status) {
  if (status === 'pending') return 'in-progress';
  if (status === 'in-progress') return 'completed';
  if (status === 'blocked') return 'in-progress';
  return status;
}

const styles = StyleSheet.create({
  projectName: {fontSize: 18, fontWeight: '700'},
  projectDesc: {color: '#666', marginBottom: 12},
  sectionTitle: {fontWeight: '700', marginBottom: 8},
  taskCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  taskHeader: {flexDirection: 'row', justifyContent: 'space-between'},
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  taskButtons: {flexDirection: 'row', marginTop: 8},
  smallBtn: {paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8},
});
