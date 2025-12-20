import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';

import {
  tasks,
  teams,
  getUserById,
  getProjectById,
} from '../../../data/mockData';
import Header from '../../../components/layout/Header';
import {useAuth} from '../../../context/AuthContext';

/* ---------- Screen ---------- */

export default function SupervisorApprovalsScreen() {
  const {user} = useAuth();
  const [activeTab, setActiveTab] = useState('pending');

  if (user?.role !== 'supervisor') {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Access restricted</Text>
      </View>
    );
  }

  /* ---------- Data ---------- */

  const supervisedTeams = useMemo(
    () =>
      teams.filter(team =>
        team.members.some(m => m.userId === user.id && m.role === 'supervisor'),
      ),
    [user],
  );

  const supervisedProjects = useMemo(
    () => supervisedTeams.map(t => getProjectById(t.projectId)).filter(Boolean),
    [supervisedTeams],
  );

  const supervisedTasks = useMemo(
    () => tasks.filter(t => supervisedProjects.some(p => p.id === t.projectId)),
    [supervisedProjects],
  );

  const pendingTasks = supervisedTasks.filter(t => t.status === 'completed');

  /* ---------- Stats ---------- */

  const stats = [
    {
      label: 'Pending',
      value: pendingTasks.length,
      icon: 'schedule',
      color: '#f59e0b',
    },
    {
      label: 'Approved',
      value: 12,
      icon: 'check-circle',
      color: '#22c55e',
    },
    {
      label: 'Rejected',
      value: 2,
      icon: 'cancel',
      color: '#ef4444',
    },
  ];

  /* ---------- UI ---------- */

  return (
    <View style={{flex: 1}}>
      <Header title="Approvals" subtitle="Review and approve completed tasks" />

      <ScrollView style={styles.container}>
        {/* ---------- Stats ---------- */}
        <View style={styles.statsRow}>
          {stats.map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <View
                style={[styles.statIcon, {backgroundColor: `${stat.color}22`}]}>
                <Icon name={stat.icon} size={22} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ---------- Tabs ---------- */}
        <View style={styles.tabs}>
          {['pending', 'approved', 'rejected'].map(tab => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.tabActive]}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}>
                {tab.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ---------- Pending ---------- */}
        {activeTab === 'pending' && (
          <>
            {pendingTasks.length === 0 ? (
              <View style={styles.center}>
                <Icon name="check-circle" size={40} color="#94a3b8" />
                <Text style={styles.muted}>No pending approvals</Text>
              </View>
            ) : (
              pendingTasks.map(task => {
                const assignee = getUserById(task.assigneeId);
                const project = getProjectById(task.projectId);

                return (
                  <View key={task.id} style={styles.taskCard}>
                    <View style={styles.taskHeader}>
                      <Image
                        source={{uri: assignee?.avatar}}
                        style={styles.avatar}
                      />
                      <View style={{flex: 1}}>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        <Text style={styles.muted}>{task.description}</Text>
                        <View style={styles.metaRow}>
                          <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                              {project?.name}
                            </Text>
                          </View>
                          <Text style={styles.metaText}>
                            By {assignee?.name}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.actionsRow}>
                      <ActionBtn icon="eye" label="Review" />
                      <ActionBtn icon="comment" label="Comment" />
                      <ActionBtn
                        icon="check-circle"
                        label="Approve"
                        color="#22c55e"
                      />
                      <ActionBtn
                        icon="times-circle"
                        label="Reject"
                        color="#ef4444"
                      />
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}

        {/* ---------- Approved / Rejected ---------- */}
        {activeTab !== 'pending' && (
          <View style={styles.center}>
            <Icon
              name={activeTab === 'approved' ? 'check-circle' : 'cancel'}
              size={42}
              color={activeTab === 'approved' ? '#22c55e' : '#ef4444'}
            />
            <Text style={styles.muted}>
              {activeTab === 'approved'
                ? '12 tasks approved this week'
                : '2 tasks rejected this week'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ---------- Small Components ---------- */

const ActionBtn = ({icon, label, color = '#334155'}) => (
  <Pressable
    style={styles.actionBtn}
    onPress={() => {
      console.log('press');
    }}>
    <FAIcon name={icon} size={14} color={color} />
    <Text style={[styles.actionText, {color}]}>{label}</Text>
  </Pressable>
);

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a',
    padding: 10,
  },

  center: {
    alignItems: 'center',
    padding: 30,
  },

  muted: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 8,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  statCard: {
    backgroundColor: '#020617',
    borderRadius: 14,
    padding: 12,
    width: '32%',
    alignItems: 'center',
  },

  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  statLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },

  tabs: {
    flexDirection: 'row',
    backgroundColor: '#020617',
    borderRadius: 12,
    marginBottom: 12,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },

  tabActive: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
  },

  tabText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },

  tabTextActive: {
    color: '#fff',
  },

  taskCard: {
    backgroundColor: '#020617',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },

  taskHeader: {
    flexDirection: 'row',
    gap: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  taskTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },

  badge: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  badgeText: {
    color: '#fff',
    fontSize: 11,
  },

  metaText: {
    color: '#94a3b8',
    fontSize: 11,
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  actionBtn: {
    alignItems: 'center',
    gap: 2,
  },

  actionText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
