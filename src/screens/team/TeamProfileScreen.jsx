import React, {useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import {
  teams,
  getUserById,
  getTasksByAssigneeId,
  getProjectById,
} from '../../data/mockData';
import BackButton from '../../components/layout/BackButton';

/* ---------- Colors ---------- */

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

/* ---------- Progress Bar ---------- */

const ProgressBar = ({progress}) => (
  <View style={styles.progressContainer}>
    <View style={[styles.progressFill, {width: `${progress}%`}]} />
  </View>
);

/* ---------- Screen ---------- */

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

  /* ---------- Derived Data ---------- */

  const memberTasks = useMemo(() => getTasksByAssigneeId(user.id), [user.id]);

  const taskStats = useMemo(() => {
    const completed = memberTasks.filter(t => t.status === 'completed').length;
    const inProgress = memberTasks.filter(
      t => t.status === 'in-progress',
    ).length;
    const pending = memberTasks.filter(t => t.status === 'pending').length;

    return {completed, inProgress, pending};
  }, [memberTasks]);

  const completionRate = memberTasks.length
    ? Math.round((taskStats.completed / memberTasks.length) * 100)
    : 0;

  const memberTeams = teams.filter(team =>
    team.members.some(m => m.userId === user.id),
  );

  const memberProjects = memberTeams
    .map(t => getProjectById(t.projectId))
    .filter(Boolean);

  const memberInfo = memberTeams[0]?.members.find(m => m.userId === user.id);

  /* ---------- UI ---------- */

  return (
    <View style={{flex: 1}}>
      <BackButton
        title="View member details and performance"
        navigation={navigation}
      />

      <ScrollView style={styles.container}>
        {/* ---------- Profile ---------- */}
        <View style={styles.card}>
          <Image source={{uri: user.avatar}} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.role.toUpperCase()}</Text>

          <InfoRow icon="email" text={user.email} />
          {user.phone && <InfoRow icon="phone" text={user.phone} />}

          {/* Stats */}
          <View style={styles.statsRow}>
            <Stat label="Tasks" value={memberTasks.length} />
            <Stat label="Done" value={taskStats.completed} color="#22c55e" />
            <Stat
              label="In Progress"
              value={taskStats.inProgress}
              color="#3b82f6"
            />
            <Stat label="Pending" value={taskStats.pending} color="#fbbf24" />
          </View>

          {/* Completion */}
          <View style={{marginTop: 12}}>
            <Text style={styles.statLabel}>Completion Rate</Text>
            <ProgressBar progress={completionRate} />
            <Text style={styles.progressText}>{completionRate}%</Text>
          </View>
        </View>

        {/* ---------- Permissions ---------- */}
        {memberInfo && (
          <View style={styles.card}>
            <SectionTitle
              icon={<FAIcon name="shield" size={16} />}
              title="Permissions"
            />
            <View style={styles.badgeRow}>
              {memberInfo.permissions.map(p => (
                <Badge key={p} text={p} />
              ))}
            </View>
          </View>
        )}

        {/* ---------- Projects ---------- */}
        <View style={styles.card}>
          <SectionTitle
            icon={<Icon name="folder" size={18} />}
            title="Projects"
          />

          {memberProjects.length === 0 ? (
            <Text style={styles.muted}>No projects assigned</Text>
          ) : (
            memberProjects.map(project => {
              const team = memberTeams.find(t => t.projectId === project.id);
              return (
                <ListItem key={project.id}>
                  <Text style={styles.listTitle}>{project.name}</Text>
                  <Text style={styles.muted}>Team: {team?.name}</Text>
                  <Text style={styles.muted}>Location: {project.location}</Text>
                  <Text style={styles.muted}>
                    Progress: {project.progress}%
                  </Text>
                </ListItem>
              );
            })
          )}
        </View>

        {/* ---------- Tasks ---------- */}
        <View style={styles.card}>
          <SectionTitle
            icon={<Icon name="check-circle" size={18} />}
            title="Assigned Tasks"
          />

          {memberTasks.map(task => {
            const project = getProjectById(task.projectId);
            return (
              <ListItem key={task.id}>
                <Text style={styles.listTitle}>{task.title}</Text>
                <Text style={styles.muted}>Project: {project?.name}</Text>
                <Text style={styles.muted}>
                  Due: {new Date(task.dueDate).toDateString()}
                </Text>

                <View style={styles.taskMeta}>
                  <Badge
                    text={task.priority}
                    color={priorityColors[task.priority]}
                  />
                  <Badge
                    text={task.status.replace('-', ' ')}
                    color={statusColors[task.status]}
                  />
                </View>
              </ListItem>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- Small Components ---------- */

const InfoRow = ({icon, text}) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={16} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const Stat = ({label, value, color = '#111'}) => (
  <View style={styles.statBox}>
    <Text style={[styles.statValue, {color}]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const SectionTitle = ({icon, title}) => (
  <View style={styles.sectionTitle}>
    {icon}
    <Text style={styles.sectionText}>{title}</Text>
  </View>
);

const Badge = ({text, color}) => (
  <View style={[styles.badge, color && {backgroundColor: color}]}>
    <Text style={[styles.badgeText, color && {color: '#fff'}]}>{text}</Text>
  </View>
);

const ListItem = ({children}) => (
  <View style={styles.listItem}>{children}</View>
);

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f9fafb', padding: 8},
  center: {alignItems: 'center', justifyContent: 'center', padding: 24},

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: 'center',
    marginBottom: 10,
  },

  name: {fontSize: 18, fontWeight: '600', textAlign: 'center'},
  role: {fontSize: 12, color: '#6b7280', textAlign: 'center', marginBottom: 12},

  infoRow: {flexDirection: 'row', alignItems: 'center', marginVertical: 4},
  infoText: {marginLeft: 6, fontSize: 14},

  statsRow: {flexDirection: 'row', marginTop: 16},
  statBox: {flex: 1, alignItems: 'center'},
  statValue: {fontSize: 18, fontWeight: '700'},
  statLabel: {fontSize: 12, color: '#6b7280'},

  progressContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  progressText: {fontSize: 12, textAlign: 'right', marginTop: 4},

  sectionTitle: {flexDirection: 'row', alignItems: 'center', gap: 8},
  sectionText: {fontSize: 16, fontWeight: '600'},

  badgeRow: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 8},
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: '#f3f4f6',
  },
  badgeText: {fontSize: 12, fontWeight: '500'},

  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 10,
  },
  listTitle: {fontSize: 14, fontWeight: '600'},
  muted: {fontSize: 12, color: '#6b7280'},

  taskMeta: {flexDirection: 'row', marginTop: 6},
});

// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Image,
//   Pressable,
//   TouchableOpacity,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import FAIcon from 'react-native-vector-icons/FontAwesome';
// // import {ProgressBar} from '@react-native-community/progress-bar-android';
// import {
//   teams,
//   getUserById,
//   getTasksByAssigneeId,
//   getProjectById,
// } from '../../data/mockData';
// import BackButton from '../../components/layout/BackButton';

// const statusColors = {
//   pending: '#fbbf24',
//   'in-progress': '#3b82f6',
//   completed: '#22c55e',
//   blocked: '#ef4444',
// };

// const priorityColors = {
//   low: '#94a3b8',
//   medium: '#f59e0b',
//   high: '#f97316',
//   urgent: '#ef4444',
// };

// export default function TeamProfileScreen({route, navigation}) {
//   const {userId} = route.params;
//   const user = getUserById(userId);

//   if (!user) {
//     return (
//       <View style={styles.center}>
//         <Text>User not found</Text>
//       </View>
//     );
//   }

//   const memberTasks = getTasksByAssigneeId(user.id);
//   const completedTasks = memberTasks.filter(
//     t => t.status === 'completed',
//   ).length;
//   const inProgressTasks = memberTasks.filter(
//     t => t.status === 'in-progress',
//   ).length;
//   const pendingTasks = memberTasks.filter(t => t.status === 'pending').length;

//   const completionRate =
//     memberTasks.length > 0
//       ? Math.round((completedTasks / memberTasks.length) * 100)
//       : 0;

//   const memberTeams = teams.filter(team =>
//     team.members.some(m => m.userId === user.id),
//   );

//   const memberProjects = memberTeams
//     .map(team => getProjectById(team.projectId))
//     .filter(Boolean);

//   const memberInfo = memberTeams[0]?.members.find(m => m.userId === user.id);

//   return (
//     <View style={{flex: 1}}>
//       <BackButton
//         title=" View member details and performance"
//         navigation={navigation}
//       />

//       <ScrollView style={styles.container}>
//         {/* Profile Card */}
//         <View style={styles.card}>
//           <Image
//             source={{uri: user.avatar || undefined}}
//             style={styles.avatar}
//           />
//           <Text style={styles.name}>{user.name}</Text>
//           <Text style={styles.role}>{user.role.toUpperCase()}</Text>

//           <View style={styles.infoRow}>
//             <Icon name="email" size={16} />
//             <Text style={styles.infoText}>{user.email}</Text>
//           </View>

//           {user.phone && (
//             <View style={styles.infoRow}>
//               <Icon name="phone" size={16} />
//               <Text style={styles.infoText}>{user.phone}</Text>
//             </View>
//           )}

//           {/* Stats */}
//           <View style={styles.statsRow}>
//             <View style={styles.statBox}>
//               <Text style={styles.statValue}>{memberTasks.length}</Text>
//               <Text style={styles.statLabel}>Tasks</Text>
//             </View>
//             <View style={styles.statBox}>
//               <Text style={[styles.statValue, {color: '#22c55e'}]}>
//                 {completedTasks}
//               </Text>
//               <Text style={styles.statLabel}>Done</Text>
//             </View>
//             <View style={styles.statBox}>
//               <Text style={[styles.statValue, {color: '#3b82f6'}]}>
//                 {inProgressTasks}
//               </Text>
//               <Text style={styles.statLabel}>In Progress</Text>
//             </View>
//             <View style={styles.statBox}>
//               <Text style={[styles.statValue, {color: '#fbbf24'}]}>
//                 {pendingTasks}
//               </Text>
//               <Text style={styles.statLabel}>Pending</Text>
//             </View>
//           </View>

//           <View style={{marginTop: 12}}>
//             <Text style={styles.statLabel}>Completion Rate</Text>
//             {/* <ProgressBar
//             styleAttr="Horizontal"
//             indeterminate={false}
//             progress={completionRate / 100}
//             color="#3b82f6"
//           /> */}
//             <Text style={{textAlign: 'right', fontSize: 12}}>
//               {completionRate}%
//             </Text>
//           </View>
//         </View>

//         {/* Permissions */}
//         {memberInfo && (
//           <View style={styles.card}>
//             <View style={styles.sectionTitle}>
//               <FAIcon name="shield" size={16} />
//               <Text style={styles.sectionText}>Permissions</Text>
//             </View>

//             <View style={styles.badgeRow}>
//               {memberInfo.permissions.map(p => (
//                 <View key={p} style={styles.badge}>
//                   <Text style={styles.badgeText}>{p}</Text>
//                 </View>
//               ))}
//             </View>
//           </View>
//         )}

//         {/* Projects */}
//         <View style={styles.card}>
//           <View style={styles.sectionTitle}>
//             <Icon name="folder" size={18} />
//             <Text style={styles.sectionText}>Projects</Text>
//           </View>

//           {memberProjects.length === 0 ? (
//             <Text style={styles.muted}>No projects assigned</Text>
//           ) : (
//             memberProjects.map(project => {
//               const team = memberTeams.find(t => t.projectId === project.id);
//               return (
//                 <View key={project.id} style={styles.listItem}>
//                   <Text style={styles.listTitle}>{project.name}</Text>
//                   <Text style={styles.muted}>Team: {team?.name}</Text>
//                   <Text style={styles.muted}>Location: {project.location}</Text>
//                   <Text style={styles.progress}>
//                     Progress: {project.progress}%
//                   </Text>
//                 </View>
//               );
//             })
//           )}
//         </View>

//         {/* Tasks */}
//         <View style={styles.card}>
//           <View style={styles.sectionTitle}>
//             <Icon name="check-circle" size={18} />
//             <Text style={styles.sectionText}>Assigned Tasks</Text>
//           </View>

//           {memberTasks.length === 0 ? (
//             <View style={styles.center}>
//               <Icon name="error-outline" size={28} />
//               <Text style={styles.muted}>No tasks assigned</Text>
//             </View>
//           ) : (
//             memberTasks.map(task => {
//               const project = getProjectById(task.projectId);
//               return (
//                 <View key={task.id} style={styles.listItem}>
//                   <Text style={styles.listTitle}>{task.title}</Text>
//                   <Text style={styles.muted}>
//                     Project: {project?.name || 'N/A'}
//                   </Text>
//                   <Text style={styles.muted}>
//                     Due: {new Date(task.dueDate).toDateString()}
//                   </Text>
//                   <View style={styles.taskMeta}>
//                     <View
//                       style={[
//                         styles.badge,
//                         {backgroundColor: priorityColors[task.priority]},
//                       ]}>
//                       <Text style={[styles.badgeText, {color: '#fff'}]}>
//                         {task.priority}
//                       </Text>
//                     </View>
//                     <View
//                       style={[
//                         styles.badge,
//                         {backgroundColor: statusColors[task.status]},
//                       ]}>
//                       <Text style={[styles.badgeText, {color: '#fff'}]}>
//                         {task.status.replace('-', ' ')}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               );
//             })
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: '#f9fafb', padding: 5},
//   center: {alignItems: 'center', justifyContent: 'center', padding: 24},
//   header: {flexDirection: 'row', alignItems: 'center', marginBottom: 16},
//   headerTitle: {fontSize: 20, fontWeight: '600', marginLeft: 12},
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 2,
//   },
//   avatar: {
//     width: 96,
//     height: 96,
//     borderRadius: 48,
//     alignSelf: 'center',
//     marginBottom: 12,
//     backgroundColor: '#eee',
//   },
//   name: {fontSize: 18, fontWeight: '600', textAlign: 'center'},
//   role: {fontSize: 12, color: '#6b7280', textAlign: 'center', marginBottom: 12},
//   infoRow: {flexDirection: 'row', alignItems: 'center', marginVertical: 4},
//   infoText: {fontSize: 14, marginLeft: 6},
//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 16,
//   },
//   statBox: {alignItems: 'center', flex: 1},
//   statValue: {fontSize: 18, fontWeight: '700'},
//   statLabel: {fontSize: 12, color: '#6b7280'},
//   sectionTitle: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//     gap: 8,
//   },
//   sectionText: {fontSize: 16, fontWeight: '600'},
//   badgeRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},

//   badge: {
//     borderWidth: 1,
//     borderColor: '#cdd0d4ff',
//     borderRadius: 40,
//     paddingHorizontal: 10,
//     paddingVertical: 2,
//     marginRight: 6,
//     marginBottom: 6,
//   },
//   badgeText: {fontSize: 12, fontWeight: '500'},
//   listItem: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//     paddingVertical: 10,
//   },
//   listTitle: {fontSize: 14, fontWeight: '600'},
//   muted: {fontSize: 12, color: '#6b7280'},
//   progress: {fontSize: 12, marginTop: 4},
//   taskMeta: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
// });
