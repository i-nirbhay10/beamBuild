import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import TaskCard from './TaskCard';

const statusColumns = [
  {id: 'pending', title: 'Pending', color: '#f59e0b'},
  {id: 'in-progress', title: 'In Progress', color: '#3b82f6'},
  {id: 'blocked', title: 'Blocked', color: '#ef4444'},
  {id: 'completed', title: 'Completed', color: '#10b981'},
];

export default function TaskBoard({tasks}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{flexDirection: 'row', gap: 12}}>
      {statusColumns.map(column => {
        const columnTasks = tasks.filter(t => t.status === column.id);

        return (
          <View key={column.id} style={{width: 250}}>
            <Text style={{fontWeight: '700', marginBottom: 6}}>
              {column.title} ({columnTasks.length})
            </Text>
            <View style={{gap: 8}}>
              {columnTasks.length > 0 ? (
                columnTasks.map(task => <TaskCard key={task.id} task={task} />)
              ) : (
                <Text
                  style={{color: '#555', textAlign: 'center', marginTop: 20}}>
                  No tasks
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
