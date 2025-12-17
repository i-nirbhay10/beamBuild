import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
// import {ProgressBar} from '@react-native-community/progress-bar-android';
import {
  teams,
  getUserById,
  getTasksByAssigneeId,
  getProjectById,
} from '../../data/mockData';
import BackButton from '../../components/layout/BackButton';

const statusColors = {
  pending: '#fbbf24',
  'in-progress': '#3b82f6',
  completed: '#22c55e',
  blocked: '#ef4444',
};

const priorityColors = {
  low: '#94a3b8',
  medium: '#f59e0b',
  high: '#f97316',
  urgent: '#ef4444',
};

export default function TeamProfileScreen({route, navigation}) {
  const {userId} = route.params;
  const user = getUserById(userId);

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>User not found</Text>
      </View>
    );
  }

  const memberTasks = getTasksByAssigneeId(user.id);
  const completedTasks = memberTasks.filter(
    t => t.status === 'completed',
  ).length;
  const inProgressTasks = memberTasks.filter(
    t => t.status === 'in-progress',
  ).length;
  const pendingTasks = memberTasks.filter(t => t.status === 'pending').length;

  const completionRate =
    memberTasks.length > 0
      ? Math.round((completedTasks / memberTasks.length) * 100)
      : 0;

  const memberTeams = teams.filter(team =>
    team.members.some(m => m.userId === user.id),
  );

  const memberProjects = memberTeams
    .map(team => getProjectById(team.projectId))
    .filter(Boolean);

  const memberInfo = memberTeams[0]?.members.find(m => m.userId === user.id);

  return (
    <View style={{flex: 1}}>
      <BackButton navigation={navigation} />

      <ScrollView style={styles.container}>
        {/* Header */}
        {/* <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} />
          </Pressable>
          <Text style={styles.headerTitle}>
             View member details and performance
          </Text>
        </View> */}

        {/* Profile Card */}
        <View style={styles.card}>
          <Image
            source={{uri: user.avatar || undefined}}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.role.toUpperCase()}</Text>

          <View style={styles.infoRow}>
            <Icon name="email" size={16} />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>

          {user.phone && (
            <View style={styles.infoRow}>
              <Icon name="phone" size={16} />
              <Text style={styles.infoText}>{user.phone}</Text>
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{memberTasks.length}</Text>
              <Text style={styles.statLabel}>Tasks</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, {color: '#22c55e'}]}>
                {completedTasks}
              </Text>
              <Text style={styles.statLabel}>Done</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, {color: '#3b82f6'}]}>
                {inProgressTasks}
              </Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, {color: '#fbbf24'}]}>
                {pendingTasks}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>

          <View style={{marginTop: 12}}>
            <Text style={styles.statLabel}>Completion Rate</Text>
            {/* <ProgressBar
            styleAttr="Horizontal"
            indeterminate={false}
            progress={completionRate / 100}
            color="#3b82f6"
          /> */}
            <Text style={{textAlign: 'right', fontSize: 12}}>
              {completionRate}%
            </Text>
          </View>
        </View>

        {/* Permissions */}
        {memberInfo && (
          <View style={styles.card}>
            <View style={styles.sectionTitle}>
              <FAIcon name="shield" size={16} />
              <Text style={styles.sectionText}>Permissions</Text>
            </View>

            <View style={styles.badgeRow}>
              {memberInfo.permissions.map(p => (
                <View key={p} style={styles.badge}>
                  <Text style={styles.badgeText}>{p}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        <View style={styles.card}>
          <View style={styles.sectionTitle}>
            <Icon name="folder" size={18} />
            <Text style={styles.sectionText}>Projects</Text>
          </View>

          {memberProjects.length === 0 ? (
            <Text style={styles.muted}>No projects assigned</Text>
          ) : (
            memberProjects.map(project => {
              const team = memberTeams.find(t => t.projectId === project.id);
              return (
                <View key={project.id} style={styles.listItem}>
                  <Text style={styles.listTitle}>{project.name}</Text>
                  <Text style={styles.muted}>Team: {team?.name}</Text>
                  <Text style={styles.muted}>Location: {project.location}</Text>
                  <Text style={styles.progress}>
                    Progress: {project.progress}%
                  </Text>
                </View>
              );
            })
          )}
        </View>

        {/* Tasks */}
        <View style={styles.card}>
          <View style={styles.sectionTitle}>
            <Icon name="check-circle" size={18} />
            <Text style={styles.sectionText}>Assigned Tasks</Text>
          </View>

          {memberTasks.length === 0 ? (
            <View style={styles.center}>
              <Icon name="error-outline" size={28} />
              <Text style={styles.muted}>No tasks assigned</Text>
            </View>
          ) : (
            memberTasks.map(task => {
              const project = getProjectById(task.projectId);
              return (
                <View key={task.id} style={styles.listItem}>
                  <Text style={styles.listTitle}>{task.title}</Text>
                  <Text style={styles.muted}>
                    Project: {project?.name || 'N/A'}
                  </Text>
                  <Text style={styles.muted}>
                    Due: {new Date(task.dueDate).toDateString()}
                  </Text>
                  <View style={styles.taskMeta}>
                    <View
                      style={[
                        styles.badge,
                        {backgroundColor: priorityColors[task.priority]},
                      ]}>
                      <Text style={[styles.badgeText, {color: '#fff'}]}>
                        {task.priority}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.badge,
                        {backgroundColor: statusColors[task.status]},
                      ]}>
                      <Text style={[styles.badgeText, {color: '#fff'}]}>
                        {task.status.replace('-', ' ')}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f9fafb', padding: 5},
  center: {alignItems: 'center', justifyContent: 'center', padding: 24},
  header: {flexDirection: 'row', alignItems: 'center', marginBottom: 16},
  headerTitle: {fontSize: 20, fontWeight: '600', marginLeft: 12},
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: 'center',
    marginBottom: 12,
    backgroundColor: '#eee',
  },
  name: {fontSize: 18, fontWeight: '600', textAlign: 'center'},
  role: {fontSize: 12, color: '#6b7280', textAlign: 'center', marginBottom: 12},
  infoRow: {flexDirection: 'row', alignItems: 'center', marginVertical: 4},
  infoText: {fontSize: 14, marginLeft: 6},
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statBox: {alignItems: 'center', flex: 1},
  statValue: {fontSize: 18, fontWeight: '700'},
  statLabel: {fontSize: 12, color: '#6b7280'},
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionText: {fontSize: 16, fontWeight: '600'},
  badgeRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},

  badge: {
    borderWidth: 1,
    borderColor: '#cdd0d4ff',
    borderRadius: 40,
    paddingHorizontal: 10,
    paddingVertical: 2,
    // marginRight: 6,
    // marginBottom: 6,
  },
  badgeText: {fontSize: 12, fontWeight: '500'},
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 10,
  },
  listTitle: {fontSize: 14, fontWeight: '600'},
  muted: {fontSize: 12, color: '#6b7280'},
  progress: {fontSize: 12, marginTop: 4},
  taskMeta: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
});
