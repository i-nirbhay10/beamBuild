import React, {useMemo} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {useAuth} from '../../../context/AuthContext';
import {
  teams,
  tasks,
  users,
  getUserById,
  getProjectById,
} from '../../../data/mockData';
// import ProgressBar from 'react-native-progress/Bar';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SupervisorTeamScreen() {
  const {user} = useAuth();

  // Teams supervised by this user
  const supervisedTeams = useMemo(() => {
    return teams.filter(team =>
      team.members.some(m => m.userId === user?.id && m.role === 'supervisor'),
    );
  }, [user]);

  // Unique team members (excluding the supervisor)
  const uniqueTeamMembers = useMemo(() => {
    const memberIds = supervisedTeams.flatMap(t =>
      t.members.map(m => m.userId),
    );
    const uniqueIds = [...new Set(memberIds)].filter(id => id !== user?.id);

    return uniqueIds.map(id => {
      const memberUser = getUserById(id);
      const memberInfo = supervisedTeams
        .flatMap(t => t.members)
        .find(m => m.userId === id);

      const memberTasks = tasks.filter(t => t.assigneeId === id);
      const completedTasks = memberTasks.filter(t => t.status === 'completed');
      const progress =
        memberTasks.length > 0 ? completedTasks.length / memberTasks.length : 0;

      return {
        user: memberUser,
        info: memberInfo,
        tasks: memberTasks,
        completedTasks: completedTasks,
        progress,
      };
    });
  }, [supervisedTeams]);

  // Average productivity
  const avgProductivity =
    uniqueTeamMembers.length > 0
      ? Math.round(
          (uniqueTeamMembers.reduce((sum, m) => sum + m.progress, 0) /
            uniqueTeamMembers.length) *
            100,
        )
      : 0;

  /* ===== Render Team Member Card ===== */
  const renderTeamMember = ({item}) => {
    const {user: member, info, tasks, completedTasks, progress} = item;
    return (
      <View style={styles.memberCard}>
        <View style={styles.memberHeader}>
          <Image source={{uri: member.avatar}} style={styles.avatar} />
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberEmail}>{member.email}</Text>
            <Text style={styles.memberRole}>{info?.role}</Text>
          </View>
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
        </View>
        <View style={{marginTop: 8}}>
          <Text style={styles.label}>
            Task Progress ({completedTasks.length}/{tasks.length})
          </Text>
          {/* <ProgressBar
            progress={progress}
            width={SCREEN_WIDTH - 60}
            height={8}
          /> */}
        </View>
        <View style={styles.memberActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>Assign Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /* ===== Render Teams by Project ===== */
  const renderTeamProject = ({item}) => {
    const project = getProjectById(item.projectId);
    return (
      <View style={styles.projectCard}>
        <Text style={styles.projectName}>{item.name}</Text>
        <Text style={styles.projectSubtitle}>{project?.name}</Text>
        <View style={styles.projectMembers}>
          {item.members.slice(0, 4).map(m => {
            const memberUser = getUserById(m.userId);
            return (
              <Image
                key={m.userId}
                source={{uri: memberUser?.avatar}}
                style={styles.projectAvatar}
              />
            );
          })}
          <Text style={styles.projectMemberCount}>
            {item.members.length} members
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{uniqueTeamMembers.length}</Text>
          <Text style={styles.statLabel}>Team Members</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{supervisedTeams.length}</Text>
          <Text style={styles.statLabel}>Teams</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{avgProductivity}%</Text>
          <Text style={styles.statLabel}>Avg Productivity</Text>
        </View>
      </View>

      {/* Team Members */}
      <Text style={styles.sectionTitle}>Team Members</Text>
      <FlatList
        data={uniqueTeamMembers}
        keyExtractor={item => item.user.id}
        renderItem={renderTeamMember}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 10}}
      />

      {/* Teams by Project */}
      <Text style={styles.sectionTitle}>Teams by Project</Text>
      <FlatList
        data={supervisedTeams}
        keyExtractor={item => item.id}
        renderItem={renderTeamProject}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 10}}
      />
    </ScrollView>
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f7f7fb', paddingTop: 10},
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statCard: {
    width: SCREEN_WIDTH / 3 - 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  statValue: {fontSize: 18, fontWeight: 'bold', color: '#222'},
  statLabel: {fontSize: 12, color: '#666'},
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 14,
    marginVertical: 8,
  },
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: SCREEN_WIDTH * 0.8,
  },
  memberHeader: {flexDirection: 'row', alignItems: 'center'},
  avatar: {width: 50, height: 50, borderRadius: 25},
  memberName: {fontWeight: '600', color: '#222'},
  memberEmail: {fontSize: 12, color: '#888'},
  memberRole: {fontSize: 12, color: '#666', marginTop: 2},
  progressBadge: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  progressText: {fontSize: 12, fontWeight: '600'},
  label: {fontSize: 12, color: '#666', marginBottom: 4},
  memberActions: {flexDirection: 'row', marginTop: 10, gap: 10},
  actionBtn: {
    flex: 1,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#6F1FFC',
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: {color: '#6F1FFC', fontWeight: '600'},
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: SCREEN_WIDTH * 0.6,
  },
  projectName: {fontWeight: '600', fontSize: 14, color: '#222'},
  projectSubtitle: {fontSize: 12, color: '#666', marginTop: 2},
  projectMembers: {flexDirection: 'row', alignItems: 'center', marginTop: 8},
  projectAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: -8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  projectMemberCount: {fontSize: 12, color: '#888', marginLeft: 8},
});
