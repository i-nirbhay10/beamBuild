import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useRoute, useNavigation} from '@react-navigation/native';
import {
  getProjectById,
  getTeamByProjectId,
  getTasksByProjectId,
  getUserById,
} from '../../../data/mockData';

export default function ProjectDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {id} = route.params;

  const project = getProjectById(id);

  if (!project) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Project not found</Text>
      </View>
    );
  }

  const team = getTeamByProjectId(project.id);
  const tasks = getTasksByProjectId(project.id);
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const blockedTasks = tasks.filter(t => t.status === 'blocked').length;
  const budgetPercent = Math.round((project.spent / project.budget) * 100);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#333" />
        <Text style={styles.backText}>Back to Projects</Text>
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.title}>{project.name}</Text>
      <Text style={styles.subtitle}>{project.location}</Text>

      {/* Status + Alerts */}
      <View style={styles.tagRow}>
        <View style={[styles.badge, getStatusColor(project.status)]}>
          <Text style={styles.badgeText}>{project.status}</Text>
        </View>

        {blockedTasks > 0 && (
          <View style={[styles.badge, styles.badgeDanger]}>
            <Icon name="alert-triangle" size={14} color="#ff4d4f" />
            <Text style={[styles.badgeText, {color: '#ff4d4f'}]}>
              {blockedTasks} blocked
            </Text>
          </View>
        )}
      </View>

      {/* Description Card */}
      <View style={styles.card}>
        <Text style={styles.cardText}>{project.description}</Text>

        <View style={styles.cardButtonsRow}>
          <TouchableOpacity style={styles.btnOutline}>
            <Icon name="file-text" size={16} color="#70510dff" />
            <Text style={styles.btnOutlineText}>Documents</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnPrimary}>
            <Text style={styles.btnPrimaryText}>Edit Project</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatBox
          icon="calendar"
          label="Timeline"
          value={`${formatDate(project.startDate)} - ${formatDateFull(
            project.endDate,
          )}`}
        />

        <StatBox
          icon="dollar-sign"
          label="Budget"
          value={`$${(project.spent / 1_000_000).toFixed(2)}M / $${(
            project.budget / 1_000_000
          ).toFixed(2)}M`}
        />

        <StatBox
          icon="users"
          label="Team Size"
          value={`${team?.members.length || 0} members`}
        />

        <StatBox
          icon="check-square"
          label="Tasks"
          value={`${completedTasks} / ${tasks.length} completed`}
        />
      </View>

      {/* Progress Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Project Progress</Text>

        <ProgressBar label="Overall Completion" value={project.progress} />
        <ProgressBar
          label="Budget Utilization"
          value={budgetPercent}
          danger={budgetPercent > 80}
        />
      </View>

      {/* Team Members */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Team Members</Text>

        {team?.members?.map(member => {
          const user = getUserById(member.userId);
          if (!user) return null;

          return (
            <View key={member.id} style={styles.teamRow}>
              <Image
                source={
                  user?.avatar ? {uri: user.avatar} : '' //require('../../../assets/avatar-placeholder.png')
                }
                style={styles.avatar}
              />

              <View style={{flex: 1}}>
                <Text style={styles.teamName}>
                  {user?.name ?? 'Unknown User'}
                </Text>
                <Text style={styles.teamRole}>{member.role}</Text>
              </View>

              <View style={[styles.badgeSmall, getStatusColor(member.role)]}>
                <Text style={styles.badgeTextSmall}>{member.role}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Recent Tasks */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Recent Tasks</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>View All</Text>
          </TouchableOpacity>
        </View>

        {tasks.slice(0, 4).map(task => {
          const assignee = getUserById(task.assigneeId);

          return (
            <View key={task.id} style={styles.taskRow}>
              <Image
                source={
                  assignee?.avatar ? {uri: assignee.avatar} : '' //require('../../../assets/avatar-placeholder.png')
                }
                style={styles.avatarSmall}
              />

              <View style={{flex: 1}}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDue}>
                  <Icon name="clock" size={12} /> {formatDate(task.dueDate)}
                </Text>
              </View>

              <View style={[styles.badgeSmall, getTaskColor(task.status)]}>
                <Text style={styles.badgeTextSmall}>
                  {task.status.replace('-', ' ')}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

/* Helpers */
const formatDate = date =>
  new Date(date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
const formatDateFull = date =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

function StatBox({icon, label, value}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <Icon name={icon} size={20} color="#70510dff" />
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
}

function ProgressBar({label, value, danger}) {
  return (
    <View style={{marginBottom: 14}}>
      <View style={styles.rowBetween}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={[styles.progressValue, danger && {color: '#ff4d4f'}]}>
          {value}%
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {width: `${value}%`},
            danger && {backgroundColor: '#ff4d4f'},
          ]}
        />
      </View>
    </View>
  );
}

/* Status Colors */
function getStatusColor(status) {
  return (
    {
      planning: styles.statusPlanning,
      'in-progress': styles.statusActive,
      'on-hold': styles.statusHold,
      completed: styles.statusCompleted,
      supervisor: styles.statusActive,
      engineer: styles.statusPlanning,
      'project-manager': styles.statusHold,
      blocked: styles.statusBlocked,
    }[status] || styles.statusDefault
  );
}

function getTaskColor(status) {
  return (
    {
      pending: styles.statusPlanning,
      'in-progress': styles.statusActive,
      completed: styles.statusCompleted,
      blocked: styles.statusBlocked,
    }[status] || styles.statusDefault
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: {flex: 1, padding: 5, backgroundColor: '#0a0f1e'}, // darker background
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  muted: {color: '#94a3b8', fontSize: 14},

  /* Header */
  backBtn: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  backText: {marginLeft: 6, fontSize: 15, color: '#94a3b8'},
  title: {fontSize: 22, fontWeight: '700', color: '#f8fafc', marginBottom: 2},
  subtitle: {color: '#cbd5e1', fontSize: 14, marginBottom: 12},

  /* Badges */
  tagRow: {flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap'},
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  badgeText: {fontSize: 12, fontWeight: '600', color: '#0a0f1e'},
  badgeDanger: {backgroundColor: '#ff4d4f33'}, // red alert
  statusPlanning: {backgroundColor: '#ffe4b5'}, // amber
  statusActive: {backgroundColor: '#38bdf8'}, // teal blue
  statusHold: {backgroundColor: '#fca5a5'}, // soft red
  statusCompleted: {backgroundColor: '#6ee7b7'}, // green
  statusBlocked: {backgroundColor: '#f87171'}, // stronger red
  statusDefault: {backgroundColor: '#64748b33'}, // gray transparent

  /* Cards */
  card: {
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardText: {fontSize: 14, color: '#e2e8f0', marginBottom: 12},

  /* Card Buttons */
  cardButtonsRow: {flexDirection: 'row', gap: 10},
  btnOutline: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#38bdf8',
    padding: 8,
    borderRadius: 8,
    gap: 6,
    alignItems: 'center',
  },
  btnOutlineText: {fontWeight: '500', color: '#38bdf8'},
  btnPrimary: {
    backgroundColor: '#f59e0b', // amber
    padding: 8,
    borderRadius: 8,
    flex: 1,
  },
  btnPrimaryText: {color: '#fff', textAlign: 'center', fontWeight: '600'},

  /* Stats */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  statIcon: {backgroundColor: '#38bdf8', padding: 8, borderRadius: 8},
  statLabel: {color: '#cbd5e1', fontSize: 12},
  statValue: {fontSize: 13, fontWeight: '600', color: '#f8fafc', marginTop: 2},

  /* Progress */
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#f8fafc',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {color: '#cbd5e1', fontSize: 13},
  progressValue: {fontWeight: '700', color: '#f8fafc'},
  progressTrack: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 8,
    marginTop: 6,
  },
  progressFill: {height: 8, backgroundColor: '#38bdf8', borderRadius: 8},

  /* Team */
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  avatar: {width: 40, height: 40, borderRadius: 20, backgroundColor: '#64748b'},
  teamName: {fontWeight: '700', color: '#f8fafc', fontSize: 14},
  teamRole: {color: '#cbd5e1', fontSize: 12},
  badgeSmall: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeTextSmall: {fontSize: 11, fontWeight: '600', color: '#f8fafc'},

  /* Tasks */
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  avatarSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#64748b',
  },
  taskTitle: {fontWeight: '600', color: '#f8fafc', fontSize: 14},
  taskDue: {fontSize: 11, color: '#cbd5e1'},
  linkText: {color: '#f59e0b', fontWeight: '600'}, // amber links
});
