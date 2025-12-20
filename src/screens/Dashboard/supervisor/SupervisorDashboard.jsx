import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  teams,
  tasks,
  getProjectById,
  getUserById,
} from '../../../data/mockData';
import Header from '../../../components/layout/Header';
import {useAuth} from '../../../context/AuthContext';

export default function SupervisorDashboard() {
  const {user} = useAuth();

  const {
    supervisedProjects,
    supervisedTasks,
    pendingApprovals,
    blockedTasks,
    urgentTasks,
    uniqueTeamMembers,
  } = useMemo(() => {
    const supervisedTeams = teams.filter(team =>
      team.members.some(m => m.userId === user.id && m.role === 'supervisor'),
    );

    const projects = supervisedTeams
      .map(t => getProjectById(t.projectId))
      .filter(Boolean);

    const projectTasks = tasks.filter(t =>
      projects.some(p => p.id === t.projectId),
    );

    const teamMemberIds = supervisedTeams.flatMap(t =>
      t.members.map(m => m.userId),
    );

    const members = [...new Set(teamMemberIds)]
      .map(id => getUserById(id))
      .filter(Boolean)
      .filter(u => u.id !== user.id);

    return {
      supervisedProjects: projects,
      supervisedTasks: projectTasks,
      pendingApprovals: projectTasks.filter(t => t.status === 'completed'),
      blockedTasks: projectTasks.filter(t => t.status === 'blocked'),
      urgentTasks: projectTasks.filter(t => t.priority === 'urgent'),
      uniqueTeamMembers: members,
    };
  }, [user.id]);

  return (
    <View style={{flex: 1}}>
      <Header
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name || ''}`}
        notifications="3"
      />

      <ScrollView style={styles.container}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            icon="people"
            title="Team Members"
            value={uniqueTeamMembers.length}
          />
          <StatCard
            icon="briefcase"
            title="Projects"
            value={supervisedProjects.length}
          />
          <StatCard
            icon="time"
            title="Approvals"
            value={pendingApprovals.length}
          />
          <StatCard
            icon="warning"
            title="Issues"
            value={blockedTasks.length}
            danger
          />
        </View>

        {/* Pending Approvals */}
        <Section title="Pending Approvals">
          {pendingApprovals.length === 0 ? (
            <EmptyText text="No pending approvals" />
          ) : (
            pendingApprovals.slice(0, 3).map(task => {
              const assignee = getUserById(task.assigneeId);
              const project = getProjectById(task.projectId);

              return (
                <Card key={task.id}>
                  <UserRow
                    user={assignee}
                    subtitle={project?.name}
                    right={
                      <View style={styles.actionRow}>
                        <IconBtn icon="checkmark-circle" color="#22c55e" />
                        <IconBtn icon="close-circle" color="#ef4444" />
                      </View>
                    }
                  />
                  <Text style={styles.taskTitle}>{task.title}</Text>
                </Card>
              );
            })
          )}
        </Section>

        {/* Team Overview */}
        <Section title="Team Overview">
          {uniqueTeamMembers.slice(0, 4).map(member => {
            const memberTasks = tasks.filter(t => t.assigneeId === member.id);
            const completed = memberTasks.filter(t => t.status === 'completed');

            return (
              <Card key={member.id}>
                <UserRow
                  user={member}
                  subtitle={`${completed.length}/${memberTasks.length} tasks completed`}
                  badge={member.role}
                />
              </Card>
            );
          })}
        </Section>

        {/* Project Progress */}
        <Section title="Project Progress">
          {supervisedProjects.map(project => (
            <Card key={project.id}>
              <Text style={styles.projectName}>{project.name}</Text>
              <Text style={styles.muted}>{project.location}</Text>

              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, {width: `${project.progress}%`}]}
                />
              </View>

              <Text style={styles.progressText}>
                {project.progress}% completed
              </Text>
            </Card>
          ))}
        </Section>

        {/* Needs Attention */}
        {(urgentTasks.length > 0 || blockedTasks.length > 0) && (
          <Section title="Needs Attention" danger>
            {[...blockedTasks, ...urgentTasks]
              // Deduplicate tasks by ID
              .filter(
                (task, index, self) =>
                  self.findIndex(t => t.id === task.id) === index,
              )
              .slice(0, 5)
              .map(task => {
                const assignee = getUserById(task.assigneeId);

                // Combine status and priority for display
                const badgeText = `${task.status}${
                  task.priority ? ` • ${task.priority}` : ''
                }`;

                return (
                  <Card key={task.id} danger>
                    <UserRow
                      user={assignee}
                      subtitle={task.title}
                      badge={badgeText}
                    />
                  </Card>
                );
              })}
          </Section>
        )}
      </ScrollView>
    </View>
  );
}

/* ---------- Reusable Components ---------- */

const StatCard = ({icon, title, value, danger}) => (
  <View style={[styles.statCard, danger && styles.dangerCard]}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Ionicons name={icon} size={22} color={danger ? '#ef4444' : '#2563eb'} />
      <Text style={styles.statValue}>{value}</Text>
    </View>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const Section = ({title, children, danger}) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, danger && styles.dangerText]}>
      {title}
    </Text>
    {children}
  </View>
);

const Card = ({children, danger}) => (
  <View style={[styles.card, danger && styles.cardDanger]}>{children}</View>
);

const UserRow = ({user, subtitle, badge, right}) => (
  <View style={styles.userRow}>
    <Image source={{uri: user?.avatar}} style={styles.avatar} />

    <View style={{flex: 1}}>
      <Text style={styles.userName}>{user?.name}</Text>
      <Text style={styles.muted}>{subtitle}</Text>
    </View>

    {badge && (
      <Text style={[styles.badge, {marginRight: right ? 8 : 0}]}>{badge}</Text>
    )}
    {right && <View>{right}</View>}
  </View>
);

const IconBtn = ({icon, color}) => (
  <TouchableOpacity style={styles.iconBtn}>
    <Ionicons name={icon} size={22} color={color} />
  </TouchableOpacity>
);

const EmptyText = ({text}) => <Text style={styles.empty}>{text}</Text>;

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0f172a', padding: 5},

  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  statCard: {
    width: '48%',
    backgroundColor: '#020617',
    padding: 16,
    borderRadius: 12,
    marginBottom: 6,
  },

  dangerCard: {borderColor: '#ef4444', borderWidth: 1},

  statValue: {fontSize: 22, color: '#fff', fontWeight: '700'},
  statTitle: {color: '#94a3b8', marginTop: 4},

  section: {marginTop: 16},
  sectionTitle: {color: '#fff', fontSize: 18, marginBottom: 12},
  dangerText: {color: '#ef4444'},

  card: {
    backgroundColor: '#020617',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardDanger: {borderColor: '#ef4444', borderWidth: 1},

  userRow: {flexDirection: 'row', alignItems: 'center', gap: 10},

  avatar: {width: 40, height: 40, borderRadius: 20},

  userName: {color: '#fff', fontWeight: '600'},
  muted: {color: '#94a3b8', fontSize: 12},

  badge: {
    backgroundColor: '#1e293b',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 11,
    textTransform: 'capitalize',
  },

  actionRow: {flexDirection: 'row', gap: 10},
  iconBtn: {padding: 4},

  taskTitle: {color: '#fff', marginTop: 6},

  projectName: {color: '#fff', fontWeight: '600'},

  progressBar: {
    height: 6,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    marginTop: 10,
  },

  progressFill: {
    height: 6,
    backgroundColor: '#22c55e',
    borderRadius: 6,
  },

  progressText: {color: '#94a3b8', marginTop: 6},

  empty: {color: '#64748b', fontStyle: 'italic'},
});
