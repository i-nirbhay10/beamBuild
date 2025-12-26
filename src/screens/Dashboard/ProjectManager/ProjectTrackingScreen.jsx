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

import {projects, teams, getTasksByProjectId} from '../../../data/mockData';
import Header from '../../../components/layout/Header';
import {useAuth} from '../../../context/AuthContext';

export function ProjectTrackingScreen() {
  const navigation = useNavigation();
  const {user} = useAuth();

  // Metrics calculation
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    p => p.status === 'in-progress',
  ).length;
  const planningProjects = projects.filter(p => p.status === 'planning').length;
  const completedProjects = projects.filter(
    p => p.status === 'completed',
  ).length;

  return (
    <View style={{flex: 1}}>
      <Header
        title="Project Tracking"
        subtitle={`Welcome back, ${user?.name || ''}`}
        notifications="3"
      />

      <ScrollView style={styles.container}>
        {/* METRICS */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Active Projects"
            value={activeProjects}
            subtitle={`of ${totalProjects}`}
            icon="clock"
          />
          <MetricCard
            title="Planning"
            value={planningProjects}
            subtitle={`of ${totalProjects}`}
            icon="target"
          />
          <MetricCard
            title="Completed"
            value={completedProjects}
            subtitle={`of ${totalProjects}`}
            icon="check-circle"
          />
        </View>

        {/* PROJECT LIST */}
        <SectionHeader title="Projects" />

        {projects.map(project => {
          const projectTasks = getTasksByProjectId(project.id);
          const completedTasks = projectTasks.filter(
            t => t.status === 'completed',
          ).length;
          const inProgressTasks = projectTasks.filter(
            t => t.status === 'in-progress',
          ).length;
          const blockedTasks = projectTasks.filter(
            t => t.status === 'blocked',
          ).length;
          const team = teams.find(t => t.projectId === project.id);

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

              {/* Progress Metrics */}
              <ProgressBlock
                label="Overall Progress"
                value={project.progress}
              />
              <ProgressBlock
                label="Budget"
                value={budgetPercentage}
                subtitle={`$${(project.spent / 1000).toFixed(0)}K of $${(
                  project.budget / 1000
                ).toFixed(0)}K`}
                danger={isOverBudget}
              />
              <ProgressBlock
                label="Tasks Completed"
                value={(completedTasks / projectTasks.length) * 100}
                subtitle={`${completedTasks}/${projectTasks.length}`}
              />

              {/* Task & Team Info */}
              <View style={styles.taskRow}>
                <TaskInfo label="Completed" value={completedTasks} />
                <TaskInfo label="In Progress" value={inProgressTasks} />
                <TaskInfo label="Blocked" value={blockedTasks} danger />
                <TaskInfo
                  label="Team Members"
                  value={team?.members.length || 0}
                />
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
function MetricCard({title, value, subtitle, icon, danger}) {
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

function TaskInfo({label, value, danger}) {
  return (
    <View style={[styles.taskCardSmall, danger && {borderColor: '#ef4444'}]}>
      <Text style={[styles.taskValue, danger && {color: '#ef4444'}]}>
        {value}
      </Text>
      <Text style={styles.taskLabel}>{label}</Text>
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
  metricsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12},
  metricCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
  },
  metricHeader: {flexDirection: 'row', justifyContent: 'space-between'},
  metricValue: {fontSize: 22, fontWeight: '700', marginVertical: 6},

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
  projectHeader: {flexDirection: 'row', justifyContent: 'space-between'},
  projectTitle: {fontSize: 15, fontWeight: '700'},

  progressTrack: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    marginTop: 4,
  },
  progressFill: {height: 6, borderRadius: 6},

  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  taskCardSmall: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  taskValue: {fontSize: 14, fontWeight: '600'},
  taskLabel: {fontSize: 12, color: '#6b7280'},

  muted: {color: '#64748b', fontSize: 12},
  bold: {fontWeight: '700'},
  rowBetween: {flexDirection: 'row', justifyContent: 'space-between'},
});
