import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useData} from '../../context/DataContext';

export default function StatsCards() {
  const {projects, teams, tasks} = useData();
  const activeProjects = projects.filter(
    p => p.status === 'in-progress',
  ).length;
  const teamCount = teams.reduce((acc, t) => acc + t.members.length, 0);
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);

  const cards = [
    {
      title: 'Active Projects',
      value: activeProjects,
      sub: `${projects.length} total`,
      icon: '🏗️',
    },
    {title: 'Team Members', value: teamCount, sub: '', icon: '👷'},
    {
      title: 'Tasks Completed',
      value: completedTasks,
      sub: `${tasks.length} total`,
      icon: '✅',
    },
    {
      title: 'Budget Used',
      value: `$${(totalSpent / 1000000).toFixed(1)}M`,
      sub: `Budget ${(totalBudget / 1000000).toFixed(1)}M`,
      icon: '💲',
    },
  ];

  return (
    <View style={styles.statsRow}>
      {cards.map(c => (
        <View key={c.title} style={styles.statCard}>
          <Text style={styles.statIcon}>{c.icon}</Text>
          <View style={{flex: 1}}>
            <Text style={styles.statValue}>{c.value}</Text>
            <Text style={styles.statTitle}>{c.title}</Text>
            {c.sub ? <Text style={styles.statSub}>{c.sub}</Text> : null}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  statIcon: {fontSize: 26, marginRight: 12},
  statValue: {fontSize: 18, fontWeight: '700'},
  statTitle: {color: '#666', marginTop: 4},
  statSub: {color: '#999', fontSize: 12},
});
