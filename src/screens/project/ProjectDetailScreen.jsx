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
} from '../../data/mockData';

export default function ProjectDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {id} = route.params;

  const project = getProjectById(id);

  if (!project) {
    return (
      <View style={styles.center}>
        <Text>Project not found</Text>
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
        <Icon name="arrow-left" size={20} />
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
            <Icon name="file-text" size={16} />
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

          if (!user) return null; // ✅ prevent crash

          return (
            <View key={member.id} style={styles.teamRow}>
              <Image
                source={
                  user?.avatar ? {uri: user.avatar} : ' ' // require('../assets/avatar-placeholder.png')
                }
                style={styles.avatar}
              />

              <View style={{flex: 1}}>
                <Text style={styles.teamName}>
                  {user?.name ?? 'Unknown User'}
                </Text>
                <Text style={styles.teamRole}>{member.role}</Text>
              </View>

              <View style={styles.badgeSmall}>
                <Text>{member.role}</Text>
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
            <Text style={{color: '#70510dff'}}>View All</Text>
          </TouchableOpacity>
        </View>

        {tasks.slice(0, 4).map(task => {
          const assignee = getUserById(task.assigneeId);

          return (
            <View key={task.id} style={styles.taskRow}>
              <Image
                source={
                  assignee.avatar ? {uri: assignee.avatar} : ' ' // require('../assets/avatar-placeholder.png')
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

/* Helpers for date formatting */
const formatDate = date =>
  new Date(date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'});

const formatDateFull = date =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

/* Reusable Box Component */
function StatBox({icon, label, value}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <Icon name={icon} size={20} color="#611ffcff" />
      </View>
      <View>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
}

/* Progress Bars */
function ProgressBar({label, value, danger}) {
  return (
    <View style={{marginBottom: 14}}>
      <View style={styles.rowBetween}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={[styles.progressValue, danger && {color: 'red'}]}>
          {value}%
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {width: `${value}%`},
            danger && {backgroundColor: 'red'},
          ]}
        />
      </View>
    </View>
  );
}

/* Colors & Styles */
function getStatusColor(status) {
  return {
    planning: styles.statusPlanning,
    'in-progress': styles.statusActive,
    'on-hold': styles.statusHold,
    completed: styles.statusCompleted,
  }[status];
}

function getTaskColor(status) {
  return {
    pending: styles.statusPlanning,
    'in-progress': styles.statusActive,
    completed: styles.statusCompleted,
    blocked: styles.statusBlocked,
  }[status];
}

/* Styles */
const styles = StyleSheet.create({
  container: {flex: 1, padding: 5, backgroundColor: '#f8f9fc'},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},

  /* Header */
  backBtn: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  backText: {marginLeft: 6, fontSize: 15},
  title: {fontSize: 24, fontWeight: '700'},
  subtitle: {color: '#777', marginBottom: 16},

  /* Badges */
  tagRow: {flexDirection: 'row', gap: 8, marginBottom: 12},
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  badgeText: {fontSize: 13, fontWeight: '600'},
  badgeDanger: {backgroundColor: '#ff4d4f20'},

  statusPlanning: {backgroundColor: '#ffeccc'},
  statusActive: {backgroundColor: '#d9e8ff'},
  statusHold: {backgroundColor: '#ffe1e1'},
  statusCompleted: {backgroundColor: '#d1f8d1'},
  statusBlocked: {backgroundColor: '#ffd6d6'},

  /* Cards */
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 1,
  },
  cardText: {fontSize: 14, color: '#555', marginBottom: 12},

  /* Card Buttons */
  cardButtonsRow: {flexDirection: 'row', gap: 10},
  btnOutline: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 8,
    gap: 6,
  },
  btnOutlineText: {fontWeight: '500'},
  btnPrimary: {
    backgroundColor: '#70510dff',
    padding: 8,
    borderRadius: 8,
    flex: 1,
  },
  btnPrimaryText: {color: '#fff', textAlign: 'center'},

  /* Stats */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    elevation: 1,
    flexDirection: 'row',
    gap: 10,
    overflow: 'hidden',
  },
  statIcon: {
    backgroundColor: '#e5efff',
    padding: 8,
    borderRadius: 8,
  },
  statLabel: {color: '#777'},
  statValue: {fontSize: 12, fontWeight: '400', marginTop: 2},

  /* Progress */
  sectionTitle: {fontSize: 18, fontWeight: '600', marginBottom: 12},
  rowBetween: {flexDirection: 'row', justifyContent: 'space-between'},
  progressLabel: {color: '#777'},
  progressValue: {fontWeight: '700'},
  progressTrack: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginTop: 6,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#70510dff',
    borderRadius: 8,
  },

  /* Team */
  teamRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    gap: 12,
  },
  avatar: {width: 40, height: 40, borderRadius: 20, backgroundColor: '#ddd'},
  teamName: {fontWeight: '700'},
  teamRole: {color: '#777', fontSize: 13},
  badgeSmall: {
    backgroundColor: '#eee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  /* Tasks */
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  avatarSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ddd',
  },
  taskTitle: {fontWeight: '600'},
  taskDue: {fontSize: 12, color: '#777'},
  badgeTextSmall: {fontSize: 12, fontWeight: '600'},
});
