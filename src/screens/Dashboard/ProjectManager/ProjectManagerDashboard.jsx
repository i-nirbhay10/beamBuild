import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';

import {
  projects,
  tasks,
  getUserById,
  getTasksByProjectId,
} from '../../../data/mockData';
import Header from '../../../components/layout/Header';
import {useAuth} from '../../../context/AuthContext';

export function ProjectManagerDashboard() {
  const navigation = useNavigation();
  const {user} = useAuth();

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const budgetUtilization = ((totalSpent / totalBudget) * 100).toFixed(1);

  const activeProjects = projects.filter(p => p.status === 'in-progress');
  const pendingApprovals = 3;
  const overdueTasks = tasks.filter(
    t => new Date(t.dueDate) < new Date() && t.status !== 'completed',
  ).length;

  return (
    <View style={{flex: 1}}>
      <Header
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name || ''}`}
        notifications={'3'}
      />
      <ScrollView style={styles.container}>
        {/* METRICS */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Budget"
            value={`$${(totalBudget / 1_000_000).toFixed(1)}M`}
            subtitle={`$${(totalSpent / 1_000_000).toFixed(
              1,
            )}M spent (${budgetUtilization}%)`}
            icon="dollar-sign"
            progress={budgetUtilization}
          />

          <MetricCard
            title="Active Projects"
            value={activeProjects.length}
            subtitle={`of ${projects.length} total projects`}
            icon="trending-up"
          />

          <MetricCard
            title="Pending Approvals"
            value={pendingApprovals}
            subtitle="Require your attention"
            icon="clock"
          />

          <MetricCard
            title="Overdue Tasks"
            value={overdueTasks}
            subtitle="Need immediate attention"
            icon="alert-circle"
            danger
          />
        </View>

        {/* PROJECT PORTFOLIO */}
        <SectionHeader
          title="Project Portfolio"
          action="View All"
          onPress={() => navigation.navigate('MyProjects')}
        />

        {projects.map(project => {
          const projectTasks = getTasksByProjectId(project.id);
          const completedTasks = projectTasks.filter(
            t => t.status === 'completed',
          ).length;

          const budgetPercentage = Math.round(
            (project.spent / project.budget) * 100,
          );

          const isOverBudget = project.spent > project.budget * 0.9;

          return (
            <View key={project.id} style={styles.projectCard}>
              <View style={styles.projectHeader}>
                <View>
                  <Text style={styles.projectTitle}>{project.name}</Text>
                  <Text style={styles.muted}>{project.location}</Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProjectDetail', {id: project.id})
                  }>
                  <Icon name="arrow-up-right" size={18} />
                </TouchableOpacity>
              </View>

              <ProgressBlock label="Progress" value={project.progress} />
              <ProgressBlock
                label="Budget"
                value={budgetPercentage}
                subtitle={`$${(project.spent / 1000).toFixed(0)}K of $${(
                  project.budget / 1000
                ).toFixed(0)}K`}
                danger={isOverBudget}
              />
              <ProgressBlock
                label="Tasks"
                value={(completedTasks / projectTasks.length) * 100}
                subtitle={`${completedTasks}/${projectTasks.length}`}
              />
            </View>
          );
        })}

        {/* CRITICAL TASKS */}
        <SectionHeader title="Critical & Overdue Tasks" />

        {tasks
          .filter(
            t => t.priority === 'urgent' || new Date(t.dueDate) < new Date(),
          )
          .slice(0, 5)
          .map(task => {
            const assignee = getUserById(task.assigneeId);
            const isOverdue =
              new Date(task.dueDate) < new Date() &&
              task.status !== 'completed';

            return (
              <View key={task.id} style={styles.taskCard}>
                <Icon
                  name={
                    task.status === 'completed'
                      ? 'check-circle'
                      : 'alert-circle'
                  }
                  size={16}
                  color={isOverdue ? '#ef4444' : '#22c55e'}
                />

                <View style={{flex: 1}}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.muted}>{task.description}</Text>

                  <Text style={styles.meta}>
                    {assignee?.name} • Due{' '}
                    {new Date(task.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
}

/* =====================
   COMPONENTS
===================== */

function MetricCard({title, value, subtitle, icon, progress, danger}) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Text style={styles.muted}>{title}</Text>
        <Icon name={icon} size={16} color={danger ? '#ef4444' : '#777'} />
      </View>

      <Text style={[styles.metricValue, danger && {color: '#ef4444'}]}>
        {value}
      </Text>

      {subtitle && <Text style={styles.muted}>{subtitle}</Text>}

      {progress && <ProgressBar value={progress} />}
    </View>
  );
}

function ProgressBlock({label, value, subtitle, danger}) {
  return (
    <View style={{marginTop: 10}}>
      <View style={styles.rowBetween}>
        <Text style={styles.muted}>{label}</Text>
        <Text style={[styles.bold, danger && {color: '#ef4444'}]}>
          {Math.round(value)}%
        </Text>
      </View>

      <ProgressBar value={value} danger={danger} />

      {subtitle && <Text style={styles.muted}>{subtitle}</Text>}
    </View>
  );
}

function ProgressBar({value, danger}) {
  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${value}%`,
            backgroundColor: danger ? '#ef4444' : '#6366f1',
          },
        ]}
      />
    </View>
  );
}

function SectionHeader({title, action, onPress}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.link}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* =====================
   STYLES
===================== */

const styles = StyleSheet.create({
  container: {padding: 16, backgroundColor: '#f8fafc'},

  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 6,
  },

  sectionHeader: {
    marginTop: 24,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {fontSize: 18, fontWeight: '700'},
  link: {color: '#2563eb', fontWeight: '600'},

  projectCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectTitle: {fontSize: 15, fontWeight: '700'},

  taskCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskTitle: {fontWeight: '600'},

  progressTrack: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    marginTop: 4,
  },
  progressFill: {
    height: 6,
    borderRadius: 6,
  },

  muted: {color: '#64748b', fontSize: 12},
  bold: {fontWeight: '700'},
  meta: {fontSize: 12, color: '#475569', marginTop: 4},
  rowBetween: {flexDirection: 'row', justifyContent: 'space-between'},
});
