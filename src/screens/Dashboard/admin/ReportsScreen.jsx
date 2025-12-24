import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Card, Button, ProgressBar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import {projects, tasks, users} from '../../../data/mockData';
import BackButton from '../../../components/layout/BackButton';

// Chart placeholder
const ChartPlaceholder = ({title, subtitle}) => (
  <Card style={styles.card}>
    <Card.Title title={title} subtitle={subtitle} />
    <Card.Content>
      <Text style={styles.chartPlaceholder}>[Chart Placeholder]</Text>
    </Card.Content>
  </Card>
);

const PerformanceMetrics = () => {
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const budgetUtilization =
    totalSpent && totalBudget ? (totalSpent / totalBudget) * 100 : 0;

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  const overdueTasks = tasks.filter(t => {
    const dueDate = new Date(t.dueDate);
    return dueDate < new Date() && t.status !== 'completed';
  }).length;

  const avgProgress = projects.length
    ? projects.reduce((acc, p) => acc + p.progress, 0) / projects.length
    : 0;

  const metrics = [
    {
      title: 'Budget Utilization',
      icon: 'dollar-sign',
      color: '#6200ee',
      value: `${budgetUtilization.toFixed(1)}%`,
      subtitle: 'On track - within budget',
      progress: budgetUtilization / 100,
    },
    {
      title: 'Task Completion',
      icon: 'check-circle',
      color: '#6200ee',
      value: `${completionRate.toFixed(0)}%`,
      subtitle: `${completedTasks} of ${totalTasks} tasks completed`,
      progress: completionRate / 100,
    },
    {
      title: 'Overdue Tasks',
      icon: 'alert-triangle',
      color: '#b00020',
      value: `${overdueTasks}`,
      subtitle: overdueTasks > 0 ? 'Needs attention' : 'All on schedule',
      // progress: completionRate / 50,
    },
    {
      title: 'Avg Project Progress',
      icon: 'clock',
      color: '#6200ee',
      value: `${avgProgress.toFixed(0)}%`,
      subtitle: `Across ${projects.length} active projects`,
      progress: avgProgress / 100,
    },
  ];

  return (
    <View style={styles.metricsContainer}>
      {metrics.map((m, i) => (
        <Card style={styles.metricsCard} key={i}>
          <Card.Title
            title={m.title}
            left={() => <Icon name={m.icon} size={24} color={m.color} />}
          />
          <Card.Content>
            <Text style={styles.metricValue}>{m.value}</Text>
            {m.progress > 0 && (
              <ProgressBar progress={m.progress} style={styles.progress} />
            )}
            <Text style={styles.metricSubtitle}>{m.subtitle}</Text>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
};

const ReportsScreen = ({navigation}) => {
  const teamPerformance = users.slice(1).map(user => {
    const userTasks = tasks.filter(t => t.assigneeId === user.id);
    const completed = userTasks.filter(t => t.status === 'completed').length;
    return {
      ...user,
      totalTasks: userTasks.length,
      completed,
      rate: userTasks.length ? (completed / userTasks.length) * 100 : 0,
    };
  });

  return (
    <View style={{flex: 1}}>
      <BackButton title="Reports & Analytics" navigation={navigation} />
      <ScrollView style={styles.container}>
        <Text style={styles.subHeader}>
          Track project performance and team productivity
        </Text>

        <Button
          mode="contained"
          icon={() => <Icon name="download" size={20} />}
          style={styles.exportButton}>
          Export Report
        </Button>

        <PerformanceMetrics />

        <ChartPlaceholder
          title="Budget Overview"
          subtitle="Budget vs Spent by Project"
        />
        <ChartPlaceholder
          title="Task Distribution"
          subtitle="Tasks by status across all projects"
        />
        <ChartPlaceholder
          title="Project Progress Over Time"
          subtitle="Monthly progress by project"
        />

        <Card style={styles.card}>
          <Card.Title
            title="Team Performance"
            subtitle="Task completion rate by team member"
          />
          <Card.Content>
            {teamPerformance.map(member => (
              <View key={member.id} style={styles.teamMember}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {member.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </Text>
                </View>
                <View style={styles.memberInfo}>
                  <View style={styles.memberHeader}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRate}>
                      {member.rate.toFixed(0)}%
                    </Text>
                  </View>
                  <ProgressBar
                    progress={member.rate / 100}
                    style={styles.progress}
                  />
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 5, backgroundColor: '#f6f6f6'},

  subHeader: {fontSize: 14, color: '#666', marginBottom: 8},

  exportButton: {marginBottom: 8, justifyContent: 'center'},

  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricsCard: {
    marginBottom: 6,
    borderRadius: 10,
    overflow: 'hidden',
    // backgroundColor: '#c5babaff',
    width: '48%',
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  chartPlaceholder: {textAlign: 'center', paddingVertical: 50, color: '#999'},

  metricValue: {fontSize: 22, fontWeight: '700', marginBottom: 6},
  metricSubtitle: {fontSize: 12, color: '#666', marginTop: 4},
  progress: {height: 8, borderRadius: 4, marginVertical: 6},

  teamMember: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {color: '#fff', fontWeight: '700', fontSize: 14},
  memberInfo: {flex: 1},
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  memberName: {fontSize: 14, fontWeight: '600', color: '#111'},
  memberRate: {fontSize: 12, color: '#666', fontWeight: '500'},
});

export default ReportsScreen;
