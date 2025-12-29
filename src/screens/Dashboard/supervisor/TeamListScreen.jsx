import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  users,
  teams,
  projects,
  getProjectById,
  getUserById,
} from '../../../data/mockData';
import Header from '../../../components/layout/Header';
import {useAuth} from '../../../context/AuthContext';
import TeamMemberCard from '../../../components/team/TeamMemberCard';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function TeamListScreen({navigation}) {
  const {user} = useAuth();

  /* ===== SUPERVISOR ONLY ===== */
  if (user?.role !== 'supervisor') {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Access restricted to supervisors only</Text>
      </View>
    );
  }

  /* ===== Teams where supervisor is a member ===== */
  const supervisorTeams = useMemo(() => {
    return teams.filter(team => team.members.some(m => m.userId === user.id));
  }, [user]);

  /* ===== Projects under supervisor ===== */
  const supervisorProjects = useMemo(() => {
    return supervisorTeams
      .map(t => getProjectById(t.projectId))
      .filter(Boolean);
  }, [supervisorTeams]);

  /* ===== Unique team members ===== */
  const teamMembers = useMemo(() => {
    const memberIds = supervisorTeams.flatMap(t =>
      t.members.map(m => m.userId),
    );
    return [...new Set(memberIds)]
      .map(id => getUserById(id))
      .filter(u => u && u.id !== user.id);
  }, [supervisorTeams, user]);

  /* ===== Status Cards ===== */
  const statusCards = [
    {label: 'Team Members', value: teamMembers.length},
    {label: 'Teams', value: supervisorTeams.length},
    {label: 'Projects', value: supervisorProjects.length},
  ];

  return (
    <View style={{flex: 1}}>
      <Header
        title="Supervisor Dashboard"
        subtitle={`Welcome, ${user.name}`}
        notifications={'3'}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ===== STATUS CARDS ===== */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusCards.map((card, index) => (
            <View key={index} style={styles.statusCard}>
              <Text style={styles.statusValue}>{card.value}</Text>
              <Text style={styles.statusLabel}>{card.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ===== PROJECT-WISE TEAMS ===== */}
        {supervisorProjects.map(project => {
          const team = supervisorTeams.find(t => t.projectId === project.id);

          const members = team.members
            .map(m => getUserById(m.userId))
            .filter(Boolean);

          {
            members.map(user => <TeamMemberCard key={user.id} user={user} />);
          }

          return (
            <View key={project.id} style={styles.projectCard}>
              <Text style={styles.projectTitle}>{project.name}</Text>

              {members.map(member => (
                <View key={member.id} style={styles.memberRow}>
                  <View style={styles.memberInfo}>
                    <Image
                      source={{uri: member.avatar}}
                      style={styles.avatar}
                    />
                    <View>
                      <Text style={styles.name}>{member.name}</Text>
                      <Text style={styles.role}>{member.role}</Text>
                    </View>
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('TeamProfile', {
                          userId: member.id,
                        })
                      }
                      style={styles.viewBtn}>
                      <Text style={styles.btnText}>View Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.assignBtn}>
                      <Text style={styles.btnText}>Assign Task</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          );
        })}

        {/* ===== TEAM NAMES ===== */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Your Teams</Text>
          {supervisorTeams.map(team => (
            <View key={team.id} style={styles.teamBadge}>
              <Text style={styles.teamText}>{team.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* ===== STYLES ===== */

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a',
    padding: 10,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#020617',
  },

  statusCard: {
    backgroundColor: '#020617',
    width: SCREEN_WIDTH * 0.3,
    marginRight: 10,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },

  statusValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  statusLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },

  projectCard: {
    backgroundColor: '#020617',
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
  },

  projectTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 10,
  },

  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#1e293b',
  },

  memberInfo: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  name: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  role: {
    color: '#94a3b8',
    fontSize: 11,
    textTransform: 'capitalize',
  },

  actions: {
    flexDirection: 'row',
    gap: 8,
  },

  viewBtn: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  assignBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  btnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },

  footer: {
    marginTop: 20,
    paddingBottom: 40,
  },

  footerTitle: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 8,
  },

  teamBadge: {
    backgroundColor: '#020617',
    padding: 10,
    borderRadius: 10,
    marginBottom: 6,
  },

  teamText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  muted: {
    color: '#94a3b8',
  },
});
