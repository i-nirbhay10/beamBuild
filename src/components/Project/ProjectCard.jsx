import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useAuth} from '../../context/AuthContext';

// mock data
import {teams, tasks} from '../../data/mockData';

export function ProjectCard({project}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = useNavigation();
  const {teamMemberInfo} = useAuth();

  // ✅ FIX: role must come from teamMemberInfo
  const role = teamMemberInfo?.role;

  const canViewProject =
    role === 'contractor' || role === 'admin' || role === 'project-manager';

  const canEdit = role === 'supervisor' || role === 'admin';

  const budgetPercent = project?.budget
    ? Math.round((project.spent / project.budget) * 100)
    : 0;

  // =====================
  // TEAM + TASK PROGRESS
  // =====================
  const team = teams.find(t => t.projectId === project.id);

  const teamMembersCount = team?.members?.length || 0;

  const projectTasks = tasks.filter(t => t.projectId === project.id);

  // ✅ FIX: Project Manager sees TEAM progress
  const myTasks =
    role === 'supervisor' || role === 'project-manager'
      ? projectTasks
      : projectTasks.filter(t => t.assigneeId === teamMemberInfo?.userId);

  const completedTasks = myTasks.filter(t => t.status === 'completed').length;

  const taskProgress =
    myTasks.length > 0
      ? Math.round((completedTasks / myTasks.length) * 100)
      : 0;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{project.name}</Text>

        {canEdit && (
          <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
            <Icon name="more-vertical" size={18} color="#444" />
          </TouchableOpacity>
        )}

        {menuOpen && canEdit && (
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                navigation.navigate('ProjectDetail', {id: project.id})
              }>
              <Icon name="eye" size={16} />
              <Text style={styles.menuText}>View Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                navigation.navigate('EditProject', {id: project.id})
              }>
              <Icon name="edit" size={16} />
              <Text style={styles.menuText}>Edit Project</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuItem,
                {borderTopWidth: 1, borderColor: '#eee'},
              ]}>
              <Icon name="trash" size={16} color="red" />
              <Text style={[styles.menuText, {color: 'red'}]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Location */}
      <View style={styles.locationRow}>
        <Icon name="map-pin" size={14} color="#777" />
        <Text style={styles.location}>{project.location}</Text>
      </View>

      {/* Description */}
      <Text style={styles.desc}>
        {project.description?.slice(0, 80) || 'No description'}
      </Text>

      {/* Project Progress */}
      <View style={{marginTop: 10}}>
        <View style={styles.progressRow}>
          <Text style={styles.muted}>Project Progress</Text>
          <Text style={styles.bold}>{project.progress}%</Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, {width: `${project.progress}%`}]}
          />
        </View>
      </View>

      {/* Task Progress */}
      {team && role !== 'admin' && (
        <View style={{marginTop: 14}}>
          <View style={styles.progressRow}>
            <Text style={styles.muted}>
              {role === 'supervisor' || role === 'project-manager'
                ? 'Team Task Progress'
                : 'My Task Progress'}
            </Text>
            <Text style={styles.bold}>{taskProgress}%</Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${taskProgress}%`,
                  backgroundColor: '#22c55e',
                },
              ]}
            />
          </View>

          {/* Team Info */}
          <View style={styles.teamInfoRow}>
            <Icon name="users" size={14} color="#555" />
            <Text style={styles.teamInfoText}>
              {team.name} • {teamMembersCount} members
            </Text>
          </View>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonRow}>
        {canViewProject && (
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() =>
              navigation.navigate('ProjectDetail', {id: project.id})
            }>
            <Text style={styles.viewBtnText}>View Project</Text>
          </TouchableOpacity>
        )}

        {role === 'contractor' && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('task', {id: project.id})}>
            <Icon name="check-square" size={16} color="#444" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 5,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 2,
  },
  header: {flexDirection: 'row', justifyContent: 'space-between'},
  menu: {
    position: 'absolute',
    right: 0,
    top: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    paddingVertical: 4,
    zIndex: 10,
  },
  menuItem: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    gap: 8,
  },
  menuText: {fontSize: 14},

  title: {fontSize: 16, fontWeight: '700', color: '#111'},
  desc: {fontSize: 13, color: '#777', marginTop: 6},

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {marginLeft: 4, fontSize: 13, color: '#777'},

  muted: {color: '#777'},
  bold: {fontWeight: '700'},

  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginTop: 4,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#6F1FFC',
    borderRadius: 6,
  },

  teamInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  teamInfoText: {
    fontSize: 12,
    color: '#555',
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  viewBtn: {
    flex: 1,
    backgroundColor: '#eef4ff',
    padding: 8,
    borderRadius: 6,
  },
  viewBtnText: {
    textAlign: 'center',
    color: '#0b74ff',
    fontWeight: '600',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// import {useNavigation} from '@react-navigation/native';
// import React, {useState} from 'react';
// import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import {useAuth} from '../../context/AuthContext';

// // mock data
// import {teams, tasks} from '../../data/mockData';

// export function ProjectCard({project}) {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const navigation = useNavigation();
//   const {teamMemberInfo, user} = useAuth();

//   const role = user?.role;

//   const canViewProject =
//     role === 'contractor' || role === 'admin' || role === 'project-manager';
//   const canEdit = role === 'supervisor' || role === 'admin';

//   const budgetPercent = Math.round((project.spent / project.budget) * 100);

//   // =====================
//   // TEAM + TASK PROGRESS
//   // =====================
//   const team = teams.find(t => t.projectId === project.id);

//   const teamMembersCount = team?.members?.length || 0;

//   const projectTasks = tasks.filter(t => t.projectId === project.id);

//   const myTasks =
//     role === 'supervisor'
//       ? projectTasks
//       : projectTasks.filter(t => t.assigneeId === teamMemberInfo?.userId);

//   const completedTasks = myTasks.filter(t => t.status === 'completed').length;

//   const taskProgress =
//     myTasks.length > 0
//       ? Math.round((completedTasks / myTasks.length) * 100)
//       : 0;

//   return (
//     <View style={styles.card}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.title}>{project.name}</Text>

//         {canEdit && (
//           <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
//             <Icon name="more-vertical" size={18} color="#444" />
//           </TouchableOpacity>
//         )}

//         {menuOpen && canEdit && (
//           <View style={styles.menu}>
//             <TouchableOpacity
//               style={styles.menuItem}
//               onPress={() =>
//                 navigation.navigate('ProjectDetail', {id: project.id})
//               }>
//               <Icon name="eye" size={16} />
//               <Text style={styles.menuText}>View Details</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.menuItem}
//               onPress={() =>
//                 navigation.navigate('EditProject', {id: project.id})
//               }>
//               <Icon name="edit" size={16} />
//               <Text style={styles.menuText}>Edit Project</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.menuItem,
//                 {borderTopWidth: 1, borderColor: '#eee'},
//               ]}>
//               <Icon name="trash" size={16} color="red" />
//               <Text style={[styles.menuText, {color: 'red'}]}>Delete</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>

//       {/* Location */}
//       <View style={styles.locationRow}>
//         <Icon name="map-pin" size={14} color="#777" />
//         <Text style={styles.location}>{project.location}</Text>
//       </View>

//       {/* Description */}
//       <Text style={styles.desc}>
//         {project.description?.slice(0, 80) || 'No description'}
//       </Text>

//       {/* Project Progress */}
//       <View style={{marginTop: 10}}>
//         <View style={styles.progressRow}>
//           <Text style={styles.muted}>Project Progress</Text>
//           <Text style={styles.bold}>{project.progress}%</Text>
//         </View>

//         <View style={styles.progressTrack}>
//           <View
//             style={[styles.progressFill, {width: `${project.progress}%`}]}
//           />
//         </View>
//       </View>

//       {/* Task Progress */}
//       {role !== 'admin' && team && (
//         <View style={{marginTop: 14}}>
//           <View style={styles.progressRow}>
//             <Text style={styles.muted}>
//               {role === 'supervisor'
//                 ? 'Team Task Progress'
//                 : 'My Task Progress'}
//             </Text>
//             <Text style={styles.bold}>{taskProgress}%</Text>
//           </View>

//           <View style={styles.progressTrack}>
//             <View
//               style={[
//                 styles.progressFill,
//                 {
//                   width: `${taskProgress}%`,
//                   backgroundColor: '#22c55e',
//                 },
//               ]}
//             />
//           </View>

//           {/* Team Info */}
//           <View style={styles.teamInfoRow}>
//             <Icon name="users" size={14} color="#555" />
//             <Text style={styles.teamInfoText}>
//               {team.name} • {teamMembersCount} members
//             </Text>
//           </View>
//         </View>
//       )}

//       {/* Buttons */}
//       <View style={styles.buttonRow}>
//         {canViewProject && (
//           <TouchableOpacity
//             style={styles.viewBtn}
//             onPress={() =>
//               navigation.navigate('ProjectDetail', {id: project.id})
//             }>
//             <Text style={styles.viewBtnText}>View Project</Text>
//           </TouchableOpacity>
//         )}

//         {role === 'contractor' && (
//           <TouchableOpacity
//             style={styles.iconBtn}
//             onPress={() => navigation.navigate('task', {id: project.id})}>
//             <Icon name="check-square" size={16} color="#444" />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     padding: 20,
//     margin: 5,
//     borderRadius: 12,
//     marginBottom: 14,
//     elevation: 2,
//   },
//   header: {flexDirection: 'row', justifyContent: 'space-between'},
//   menu: {
//     position: 'absolute',
//     right: 0,
//     top: 24,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     elevation: 3,
//     paddingVertical: 4,
//     zIndex: 10,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     padding: 8,
//     alignItems: 'center',
//     gap: 8,
//   },
//   menuText: {fontSize: 14},

//   title: {fontSize: 16, fontWeight: '700', color: '#111'},
//   desc: {fontSize: 13, color: '#777', marginTop: 6},

//   locationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   location: {marginLeft: 4, fontSize: 13, color: '#777'},

//   muted: {color: '#777'},
//   bold: {fontWeight: '700'},

//   progressRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   progressTrack: {
//     height: 6,
//     backgroundColor: '#eee',
//     borderRadius: 6,
//     marginTop: 4,
//   },
//   progressFill: {
//     height: 6,
//     backgroundColor: '#6F1FFC',
//     borderRadius: 6,
//   },

//   teamInfoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 6,
//     gap: 6,
//   },
//   teamInfoText: {
//     fontSize: 12,
//     color: '#555',
//   },

//   buttonRow: {
//     flexDirection: 'row',
//     marginTop: 12,
//     gap: 8,
//   },
//   viewBtn: {
//     flex: 1,
//     backgroundColor: '#eef4ff',
//     padding: 8,
//     borderRadius: 6,
//   },
//   viewBtnText: {
//     textAlign: 'center',
//     color: '#0b74ff',
//     fontWeight: '600',
//   },
//   iconBtn: {
//     width: 38,
//     height: 38,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
