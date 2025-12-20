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
    width: SCREEN_WIDTH * 0.35,
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

// import React, {useMemo, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   Dimensions,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// import {
//   users,
//   teams,
//   getProjectById,
//   getTasksByAssigneeId,
// } from '../../../data/mockData';
// import Header from '../../../components/layout/Header';
// import {useAuth} from '../../../context/AuthContext';

// /* ---------- Constants ---------- */

// const roleColors = {
//   contractor: '#2563eb',
//   supervisor: '#f59e0b',
//   engineer: '#3b82f6',
//   laborer: '#10b981',
// };

// const SCREEN_WIDTH = Dimensions.get('window').width;

// /* ---------- Screen ---------- */

// export default function TeamListScreen() {
//   const {user} = useAuth();
//   const [selectedMember, setSelectedMember] = useState(null);

//   /* ================== FILTER TEAM MEMBERS ================== */
//   const teamMembers = useMemo(() => {
//     return users
//       .filter(u => u.id !== user?.id) // exclude logged-in user
//       .map(member => {
//         // Teams member belongs to
//         const memberTeams = teams.filter(team =>
//           team.members.some(m => m.userId === member.id),
//         );

//         // Projects involving this member AND logged-in user
//         const projectNames = memberTeams
//           .map(t => getProjectById(t.projectId))
//           .filter(
//             p =>
//               p &&
//               teams.some(
//                 team =>
//                   team.projectId === p.id &&
//                   team.members.some(m => m.userId === user.id),
//               ),
//           )
//           .map(p => p.name);

//         // Tasks assigned to this member
//         const tasks = getTasksByAssigneeId(member.id).filter(
//           t => t.assigneeId === user.id || t.assigneeId === member.id,
//         );

//         // Calculate productivity: completed / total tasks
//         const totalTasks = tasks.length;
//         const completedTasks = tasks.filter(
//           t => t.status === 'completed',
//         ).length;
//         const productivity = totalTasks
//           ? (completedTasks / totalTasks) * 100
//           : 0;

//         return {
//           ...member,
//           projects: projectNames,
//           activeTasks: tasks.filter(
//             t => t.status === 'in-progress' || t.status === 'pending',
//           ).length,
//           completedTasks,
//           productivity: Math.round(productivity),
//         };
//       })
//       .filter(
//         member =>
//           member.projects.length > 0 ||
//           member.activeTasks > 0 ||
//           member.completedTasks > 0,
//       );
//   }, [user]);

//   /* ================== Render Team Member Item ================== */
//   const renderItem = ({item}) => (
//     <View style={styles.card}>
//       {/* Header */}
//       <View style={styles.cardHeader}>
//         <View style={styles.memberRow}>
//           <Image source={{uri: item.avatar}} style={styles.avatar} />
//           <View>
//             <Text style={styles.name}>{item.name}</Text>
//             <Text style={styles.email}>{item.email}</Text>
//           </View>
//         </View>

//         <TouchableOpacity onPress={() => setSelectedMember(item)}>
//           <Ionicons name="ellipsis-vertical" size={18} color="#94a3b8" />
//         </TouchableOpacity>
//       </View>

//       {/* Role */}
//       <View
//         style={[
//           styles.roleBadge,
//           {backgroundColor: `${roleColors[item.role]}22`},
//         ]}>
//         <Text style={[styles.roleText, {color: roleColors[item.role]}]}>
//           {item.role}
//         </Text>
//       </View>

//       {/* Projects */}
//       <View style={styles.section}>
//         <Text style={styles.label}>Projects</Text>
//         <View style={styles.projectWrap}>
//           {item.projects.length > 0 ? (
//             item.projects.map((p, i) => (
//               <View key={`${item.id}-project-${i}`} style={styles.projectBadge}>
//                 <Text style={styles.projectText}>{p}</Text>
//               </View>
//             ))
//           ) : (
//             <Text style={styles.muted}>Unassigned</Text>
//           )}
//         </View>
//       </View>

//       {/* Task Stats */}
//       <View style={styles.statsRow}>
//         <View style={styles.stat}>
//           <Text style={styles.statValue}>{item.activeTasks}</Text>
//           <Text style={styles.statLabel}>Active</Text>
//         </View>

//         <View style={styles.stat}>
//           <Text style={styles.statValue}>{item.completedTasks}</Text>
//           <Text style={styles.statLabel}>Completed</Text>
//         </View>

//         <View style={styles.stat}>
//           <Text style={styles.statValue}>{item.productivity}%</Text>
//           <Text style={styles.statLabel}>Productivity</Text>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={{flex: 1}}>
//       <Header
//         title="Team Managment"
//         subtitle={`Welcome back, ${user?.name || ''}`}
//         notifications={'3'}
//       />

//       {/* Team Members List */}
//       <View style={styles.container}>
//         <FlatList
//           data={teamMembers}
//           keyExtractor={item => item.id}
//           renderItem={renderItem}
//           contentContainerStyle={{paddingBottom: 140}}
//           showsVerticalScrollIndicator={false}
//         />
//       </View>
//     </View>
//   );
// }

// /* ---------- Styles ---------- */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0f172a',
//     padding: 5,
//   },

//   /* Status Cards */
//   statusRow: {
//     paddingVertical: 10,
//     backgroundColor: '#1e293b',
//   },
//   statusCard: {
//     backgroundColor: '#020617',
//     padding: 10,
//     borderRadius: 12,
//     marginRight: 10,
//     width: SCREEN_WIDTH * 0.4,
//     alignItems: 'center',
//   },
//   cardAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginBottom: 6,
//   },
//   cardName: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 13,
//     textAlign: 'center',
//   },
//   cardProjects: {
//     color: '#94a3b8',
//     fontSize: 11,
//     marginTop: 2,
//     textAlign: 'center',
//   },
//   cardProductivity: {
//     color: '#10b981',
//     fontWeight: '600',
//     fontSize: 12,
//     marginTop: 4,
//     textAlign: 'center',
//   },

//   /* Team Member Cards */
//   card: {
//     backgroundColor: '#020617',
//     padding: 14,
//     borderRadius: 16,
//     marginBottom: 12,
//   },

//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   memberRow: {
//     flexDirection: 'row',
//     gap: 10,
//     alignItems: 'center',
//   },

//   avatar: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//   },

//   name: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 14,
//   },

//   email: {
//     color: '#94a3b8',
//     fontSize: 12,
//   },

//   roleBadge: {
//     alignSelf: 'flex-start',
//     marginTop: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },

//   roleText: {
//     fontSize: 12,
//     textTransform: 'capitalize',
//   },

//   section: {
//     marginTop: 12,
//   },

//   label: {
//     color: '#64748b',
//     fontSize: 11,
//     marginBottom: 6,
//   },

//   projectWrap: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 6,
//   },

//   projectBadge: {
//     backgroundColor: '#0f172a',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },

//   projectText: {
//     color: '#fff',
//     fontSize: 11,
//   },

//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 14,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderColor: '#1e293b',
//   },

//   stat: {
//     alignItems: 'center',
//   },

//   statValue: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 16,
//   },

//   statLabel: {
//     color: '#94a3b8',
//     fontSize: 11,
//     marginTop: 2,
//   },

//   muted: {
//     color: '#64748b',
//     fontSize: 12,
//   },
// });

// // import React, {useMemo, useState} from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   FlatList,
// //   TouchableOpacity,
// //   Image,
// //   ScrollView,
// //   Dimensions,
// // } from 'react-native';
// // import Ionicons from 'react-native-vector-icons/Ionicons';

// // import {
// //   users,
// //   teams,
// //   getProjectById,
// //   getTasksByAssigneeId,
// // } from '../../../data/mockData';
// // import Header from '../../../components/layout/Header';
// // import {useAuth} from '../../../context/AuthContext';

// // /* ---------- Constants ---------- */

// // const roleColors = {
// //   contractor: '#2563eb',
// //   supervisor: '#f59e0b',
// //   engineer: '#3b82f6',
// //   laborer: '#10b981',
// // };

// // const SCREEN_WIDTH = Dimensions.get('window').width;

// // /* ---------- Screen ---------- */

// // export default function TeamListScreen() {
// //   const {user} = useAuth();
// //   const [selectedMember, setSelectedMember] = useState(null);

// //   /* ================== FILTER TEAM MEMBERS ================== */
// //   const teamMembers = useMemo(() => {
// //     return users
// //       .filter(u => u.id !== user?.id) // exclude logged-in user
// //       .map(member => {
// //         // Teams member belongs to
// //         const memberTeams = teams.filter(team =>
// //           team.members.some(m => m.userId === member.id),
// //         );

// //         // Projects involving this member AND logged-in user
// //         const projectNames = memberTeams
// //           .map(t => getProjectById(t.projectId))
// //           .filter(
// //             p =>
// //               p &&
// //               teams.some(
// //                 team =>
// //                   team.projectId === p.id &&
// //                   team.members.some(m => m.userId === user.id),
// //               ),
// //           )
// //           .map(p => p.name);

// //         // Tasks assigned to this member
// //         const tasks = getTasksByAssigneeId(member.id).filter(
// //           t => t.assigneeId === user.id || t.assigneeId === member.id,
// //         );

// //         // Calculate productivity: completed / total tasks
// //         const totalTasks = tasks.length;
// //         const completedTasks = tasks.filter(
// //           t => t.status === 'completed',
// //         ).length;
// //         const productivity = totalTasks
// //           ? (completedTasks / totalTasks) * 100
// //           : 0;

// //         return {
// //           ...member,
// //           projects: projectNames,
// //           activeTasks: tasks.filter(
// //             t => t.status === 'in-progress' || t.status === 'pending',
// //           ).length,
// //           completedTasks,
// //           productivity: Math.round(productivity),
// //         };
// //       })
// //       .filter(
// //         member =>
// //           member.projects.length > 0 ||
// //           member.activeTasks > 0 ||
// //           member.completedTasks > 0,
// //       );
// //   }, [user]);

// //   /* ================== Render Status Cards ================== */
// //   // const renderStatusCard = member => (
// //   //   <View key={member.id} style={styles.statusCard}>
// //   //     <Image source={{uri: member.avatar}} style={styles.cardAvatar} />
// //   //     <Text style={styles.cardName}>{member.name}</Text>
// //   //     <Text style={styles.cardProjects}>
// //   //       {member.projects.join(', ') || 'No projects'}
// //   //     </Text>
// //   //     <Text style={styles.cardProductivity}>
// //   //       Productivity: {member.productivity}%
// //   //     </Text>
// //   //   </View>
// //   // );

// //   /* ================== Render Team Member Item ================== */
// //   const renderItem = ({item}) => (
// //     <View style={styles.card}>
// //       {/* Header */}
// //       <View style={styles.cardHeader}>
// //         <View style={styles.memberRow}>
// //           <Image source={{uri: item.avatar}} style={styles.avatar} />
// //           <View>
// //             <Text style={styles.name}>{item.name}</Text>
// //             <Text style={styles.email}>{item.email}</Text>
// //           </View>
// //         </View>

// //         <TouchableOpacity onPress={() => setSelectedMember(item)}>
// //           <Ionicons name="ellipsis-vertical" size={18} color="#94a3b8" />
// //         </TouchableOpacity>
// //       </View>

// //       {/* Role */}
// //       <View
// //         style={[
// //           styles.roleBadge,
// //           {backgroundColor: `${roleColors[item.role]}22`},
// //         ]}>
// //         <Text style={[styles.roleText, {color: roleColors[item.role]}]}>
// //           {item.role}
// //         </Text>
// //       </View>

// //       {/* Projects */}
// //       <View style={styles.section}>
// //         <Text style={styles.label}>Projects</Text>
// //         <View style={styles.projectWrap}>
// //           {item.projects.length > 0 ? (
// //             item.projects.map((p, i) => (
// //               <View key={`${item.id}-project-${i}`} style={styles.projectBadge}>
// //                 <Text style={styles.projectText}>{p}</Text>
// //               </View>
// //             ))
// //           ) : (
// //             <Text style={styles.muted}>Unassigned</Text>
// //           )}
// //         </View>
// //       </View>

// //       {/* Task Stats */}
// //       <View style={styles.statsRow}>
// //         <View style={styles.stat}>
// //           <Text style={styles.statValue}>{item.activeTasks}</Text>
// //           <Text style={styles.statLabel}>Active</Text>
// //         </View>

// //         <View style={styles.stat}>
// //           <Text style={styles.statValue}>{item.completedTasks}</Text>
// //           <Text style={styles.statLabel}>Completed</Text>
// //         </View>

// //         <View style={styles.stat}>
// //           <Text style={styles.statValue}>{item.productivity}%</Text>
// //           <Text style={styles.statLabel}>Productivity</Text>
// //         </View>
// //       </View>
// //     </View>
// //   );

// //   return (
// //     <View style={{flex: 1}}>
// //       <Header
// //         title="Team Managment"
// //         subtitle={`Welcome back, ${user?.name || ''}`}
// //         notifications={'3'}
// //       />

// //       {/* Status Cards Row */}
// //       {/* <View style={styles.statusRow}>
// //         <ScrollView
// //           horizontal
// //           showsHorizontalScrollIndicator={false}
// //           contentContainerStyle={{paddingHorizontal: 5}}>
// //           {teamMembers.map(renderStatusCard)}
// //         </ScrollView>
// //       </View> */}

// //       {/* Team Members List */}
// //       <View style={styles.container}>
// //         <FlatList
// //           data={teamMembers}
// //           keyExtractor={item => item.id}
// //           renderItem={renderItem}
// //           contentContainerStyle={{paddingBottom: 140}}
// //           showsVerticalScrollIndicator={false}
// //         />
// //       </View>
// //     </View>
// //   );
// // }

// // /* ---------- Styles ---------- */

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#0f172a',
// //     padding: 5,
// //   },

// //   /* Status Cards */
// //   statusRow: {
// //     paddingVertical: 10,
// //     backgroundColor: '#1e293b',
// //   },
// //   statusCard: {
// //     backgroundColor: '#020617',
// //     padding: 10,
// //     borderRadius: 12,
// //     marginRight: 10,
// //     width: SCREEN_WIDTH * 0.4,
// //     alignItems: 'center',
// //   },
// //   cardAvatar: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     marginBottom: 6,
// //   },
// //   cardName: {
// //     color: '#fff',
// //     fontWeight: '600',
// //     fontSize: 13,
// //     textAlign: 'center',
// //   },
// //   cardProjects: {
// //     color: '#94a3b8',
// //     fontSize: 11,
// //     marginTop: 2,
// //     textAlign: 'center',
// //   },
// //   cardProductivity: {
// //     color: '#10b981',
// //     fontWeight: '600',
// //     fontSize: 12,
// //     marginTop: 4,
// //     textAlign: 'center',
// //   },

// //   /* Team Member Cards */
// //   card: {
// //     backgroundColor: '#020617',
// //     padding: 14,
// //     borderRadius: 16,
// //     marginBottom: 12,
// //   },

// //   cardHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },

// //   memberRow: {
// //     flexDirection: 'row',
// //     gap: 10,
// //     alignItems: 'center',
// //   },

// //   avatar: {
// //     width: 42,
// //     height: 42,
// //     borderRadius: 21,
// //   },

// //   name: {
// //     color: '#fff',
// //     fontWeight: '600',
// //     fontSize: 14,
// //   },

// //   email: {
// //     color: '#94a3b8',
// //     fontSize: 12,
// //   },

// //   roleBadge: {
// //     alignSelf: 'flex-start',
// //     marginTop: 8,
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderRadius: 8,
// //   },

// //   roleText: {
// //     fontSize: 12,
// //     textTransform: 'capitalize',
// //   },

// //   section: {
// //     marginTop: 12,
// //   },

// //   label: {
// //     color: '#64748b',
// //     fontSize: 11,
// //     marginBottom: 6,
// //   },

// //   projectWrap: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     gap: 6,
// //   },

// //   projectBadge: {
// //     backgroundColor: '#0f172a',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 8,
// //   },

// //   projectText: {
// //     color: '#fff',
// //     fontSize: 11,
// //   },

// //   statsRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     marginTop: 14,
// //     paddingTop: 12,
// //     borderTopWidth: 1,
// //     borderColor: '#1e293b',
// //   },

// //   stat: {
// //     alignItems: 'center',
// //   },

// //   statValue: {
// //     color: '#fff',
// //     fontWeight: '700',
// //     fontSize: 16,
// //   },

// //   statLabel: {
// //     color: '#94a3b8',
// //     fontSize: 11,
// //     marginTop: 2,
// //   },

// //   muted: {
// //     color: '#64748b',
// //     fontSize: 12,
// //   },
// // });
