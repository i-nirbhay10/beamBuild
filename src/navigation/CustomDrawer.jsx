import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* -----------------------------
   Role-based navigation config
------------------------------ */

const getNavigationItems = role => {
  switch (role) {
    case 'contractor':
      return [
        {name: 'Dashboard', icon: 'grid', route: 'Dashboard'},
        {name: 'Projects', icon: 'folder', route: 'Projects'},
        {name: 'Team', icon: 'users', route: 'Team'},
        {name: 'Tasks', icon: 'check-square', route: 'Tasks'},
        {name: 'Documents', icon: 'file-text', route: 'Documents'},
        {name: 'Reports', icon: 'bar-chart-2', route: 'Reports'},
        // {name: 'Messages', icon: 'message-square', route: 'Messages', badge: 3},
      ];

    case 'supervisor':
      return [
        {name: 'Dashboard', icon: 'grid', route: 'SupervisorDashboard'},
        {name: 'My Projects', icon: 'folder', route: 'MyProjects'},
        {name: 'Team Management', icon: 'users', route: 'TeamManagement'},
        {name: 'Task Assignment', icon: 'clipboard', route: 'AssignTasks'},
        {name: 'Approvals', icon: 'check-circle', route: 'Approvals', badge: 2},
        {name: 'Documents', icon: 'file-text', route: 'Documents'},
        // {name: 'Messages', icon: 'message-square', route: 'Messages', badge: 3},
      ];

    case 'engineer':
      return [
        {name: 'My Projects', icon: 'folder', route: 'MyProjects'},
        {name: 'My Tasks', icon: 'check-square', route: 'MyTasks', badge: 3},
        {name: 'Technical Docs', icon: 'file-text', route: 'Documents'},
        {name: 'Report Progress', icon: 'bar-chart-2', route: 'Report'},
        {name: 'Issues', icon: 'alert-triangle', route: 'Issues'},
        // {name: 'Messages', icon: 'message-square', route: 'Messages', badge: 3},
      ];

    case 'laborer':
      return [
        {name: 'My Tasks', icon: 'check-square', route: 'MyTasks', badge: 2},
        {name: 'Daily Log', icon: 'clipboard', route: 'DailyLog'},
        {name: 'Report Issue', icon: 'alert-triangle', route: 'Issues'},
        {name: 'Safety Info', icon: 'shield', route: 'Safety'},
        // {name: 'Messages', icon: 'message-square', route: 'Messages', badge: 3},
      ];

    default:
      return [];
  }
};

/* -----------------------------
   Drawer Component
------------------------------ */

export default function CustomDrawer(props) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const json = await AsyncStorage.getItem('currentUser');
        if (json) setCurrentUser(JSON.parse(json));
      } catch (e) {
        console.log('Failed to load user:', e);
      }
    };
    loadUser();
  }, []);

  if (!currentUser) {
    return (
      <View style={styles.center}>
        <Text>Loading user...</Text>
      </View>
    );
  }

  const navigationItems = getNavigationItems(currentUser.role);
  const currentRoute = props.state.routes[props.state.index]?.name;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}>
      {/* Header */}
      <View>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Icon name="cpu" size={20} color="#fff" />
          </View>
          <Text style={styles.logoText}>Beam Build</Text>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          <Text style={styles.sectionTitle}>MAIN MENU</Text>

          {navigationItems.map(item => {
            const isActive = currentRoute === item.route;

            return (
              <TouchableOpacity
                key={item.route}
                onPress={() => props.navigation.navigate(item.route)}
                style={[styles.navItem, isActive && styles.activeNavItem]}>
                <Icon
                  name={item.icon}
                  size={20}
                  color={isActive ? '#0b74ff' : '#5a5f6e'}
                />

                <Text
                  style={[styles.navText, isActive && styles.activeNavText]}>
                  {item.name}
                </Text>

                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          <Text style={[styles.sectionTitle, {marginTop: 20}]}>SETTINGS</Text>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('CompanyProfile')}
            style={styles.navItem}>
            <Icon name="settings" size={20} color="#5a5f6e" />
            <Text style={styles.navText}>Company Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => props.navigation.navigate('Settings')}
            style={styles.navItem}>
            <Icon name="settings" size={20} color="#5a5f6e" />
            <Text style={styles.navText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Image
          source={{
            uri:
              currentUser.avatar ||
              'https://ui-avatars.com/api/?name=' +
                encodeURIComponent(currentUser.name),
          }}
          style={styles.avatar}
        />

        <View style={{flex: 1}}>
          <Text style={styles.userName}>{currentUser.name}</Text>
          <Text style={styles.userRole}>{currentUser.role}</Text>
        </View>

        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.removeItem('currentUser');
            props.navigation.reset({
              index: 0,
              routes: [{name: 'DummyLogin'}],
            });
          }}>
          <Icon name="log-out" size={18} color="#777" />
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

/* -----------------------------
   Styles
------------------------------ */

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fc',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e4e7ee',
  },
  logoIcon: {
    height: 36,
    width: 36,
    backgroundColor: '#0c0c0c',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1e2e',
  },
  menu: {
    paddingHorizontal: 12,
  },
  sectionTitle: {
    marginVertical: 10,
    fontSize: 11,
    fontWeight: '700',
    color: '#8a8f9e',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  navText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#1a1e2e',
    flex: 1,
  },
  activeNavItem: {
    backgroundColor: '#eaf3ff',
  },
  activeNavText: {
    color: '#0b74ff',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#0b74ff',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#e4e7ee',
    padding: 16,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 10,
    marginRight: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
  },
  userRole: {
    fontSize: 12,
    color: '#8a8f9e',
    textTransform: 'capitalize',
  },
});

// import React, {useEffect, useState} from 'react';
// import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
// import {DrawerContentScrollView} from '@react-navigation/drawer';
// import Icon from 'react-native-vector-icons/Feather';
// import {useNavigation, useRoute} from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // -----------------------------
// // Role-based navigation config
// // -----------------------------
// const getNavigationItems = role => {
//   const items = [];

//   // Everyone
//   // items.push({
//   //   name: 'Dashboard',
//   //   icon: 'grid',
//   //   route: 'Dashboard',
//   // });

//   if (role === 'contractor') {
//     items.push(
//       {name: 'Dashboard', icon: 'grid', route: 'Dashboard'},
//       {name: 'Projects', icon: 'folder', route: 'Projects'},
//       {name: 'Team', icon: 'users', route: 'Team'},
//       {name: 'Tasks', icon: 'check-square', route: 'Tasks'},
//       {name: 'Documents', icon: 'file-text', route: 'Documents'},
//       {name: 'Reports', icon: 'bar-chart-2', route: 'Reports'},
//       // {name: 'Messages', icon: 'message-square', route: 'Messages', badge: 3},
//     );
//   }

//   if (role === 'supervisor') {
//     items.push(
//       {name: 'Dashboard', icon: 'grid', route: 'SupervisorDashboard'},
//       {name: 'My Projects', icon: 'folder', route: 'MyProjects'},
//       {name: 'Team Management', icon: 'users', route: 'TeamManagement'},
//       {name: 'Task Assignment', icon: 'clipboard', route: 'AssignTasks'},
//       {name: 'Approvals', icon: 'check-circle', route: 'Approvals', badge: 2},
//       {name: 'Documents', icon: 'file-text', route: 'Documents'},
//       // // {name: 'Messages', icon: 'message-square', route: 'Messages', badge: 3},
//     );
//   }

//   if (role === 'engineer') {
//     items.push(
//       {name: 'My Projects', icon: 'folder', route: 'MyProjects'},
//       {name: 'My Tasks', icon: 'check-square', route: 'MyTasks', badge: 3},
//       {name: 'Technical Docs', icon: 'file-text', route: 'Documents'},
//       {name: 'Report Progress', icon: 'bar-chart-2', route: 'Report'},
//       {name: 'Issues', icon: 'alert-triangle', route: 'Issues'},
//       // // {name: 'Messages', icon: 'message-square', route: 'Messages'},
//     );
//   }

//   if (role === 'laborer') {
//     items.push(
//       {name: 'My Tasks', icon: 'check-square', route: 'MyTasks', badge: 2},
//       {name: 'Daily Log', icon: 'clipboard', route: 'DailyLog'},
//       {name: 'Report Issue', icon: 'alert-triangle', route: 'Issues'},
//       {name: 'Safety Info', icon: 'tool', route: 'Safety'},
//       // {name: 'Messages', icon: 'message-square', route: 'Messages'},
//     );
//   }

//   return items;
// };

// // -----------------------------
// // Drawer Component
// // -----------------------------

// export default function CustomDrawer(props) {
//   const navigation = useNavigation();
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const json = await AsyncStorage.getItem('currentUser');

//         console.log(json, 'jsonjsonjsonjsonjson');

//         if (json) setCurrentUser(JSON.parse(json));
//       } catch (e) {
//         console.log('Failed to load user:', e);
//       }
//     };

//     loadUser();
//   }, []);

//   if (!currentUser) {
//     return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <Text>Loading user...</Text>
//       </View>
//     );
//   }

//   const navigationItems = getNavigationItems(currentUser.role);

//   return (
//     <DrawerContentScrollView
//       {...props}
//       contentContainerStyle={styles.container}>
//       {/* Header */}
//       <View>
//         <View style={styles.logoContainer}>
//           <View style={styles.logoIcon}>
//             <Icon name="cpu" size={20} color="#fff" />
//           </View>
//           <Text style={styles.logoText}>Beam Build</Text>
//         </View>

//         {/* Main Menu */}
//         <View style={styles.menu}>
//           <Text style={styles.sectionTitle}>MAIN MENU</Text>

//           {navigationItems.map(item => {
//             const isActive =
//               props.state.routeNames[props.state.index] === item.route;

//             return (
//               <TouchableOpacity
//                 key={item.name}
//                 activeOpacity={0.5}
//                 onPress={() => props.navigation.navigate(item.route)}
//                 style={[styles.navItem, isActive && styles.activeNavItem]}>
//                 <Icon
//                   name={item.icon}
//                   size={20}
//                   color={isActive ? '#0b74ff' : '#5a5f6e'}
//                 />
//                 <Text
//                   style={[styles.navText, isActive && styles.activeNavText]}>
//                   {item.name}
//                 </Text>
//                 {item.badge && (
//                   <View style={styles.badge}>
//                     <Text style={styles.badgeText}>{item.badge}</Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//             );
//           })}

//           {/* Settings */}
//           <Text style={[styles.sectionTitle, {marginTop: 20}]}>SETTINGS</Text>
//           <TouchableOpacity
//             onPress={() => props.navigation.navigate('Settings')}
//             style={styles.navItem}>
//             <Icon name="settings" size={20} color="#5a5f6e" />
//             <Text style={styles.navText}>Settings</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Footer */}
//       <View style={styles.footer}>
//         <Image source={{uri: currentUser.avatar}} style={styles.avatar} />
//         <View style={{flex: 1}}>
//           <Text style={styles.userName}>{currentUser.name}</Text>
//           <Text style={styles.userRole}>{currentUser.role}</Text>
//         </View>
//         <TouchableOpacity
//           onPress={async () => {
//             await AsyncStorage.removeItem('currentUser'); // clear storage on logout
//             navigation.reset({
//               index: 0,
//               routes: [{name: 'DummyLogin'}],
//             });
//           }}>
//           <Icon name="log-out" size={18} color="#777" />
//         </TouchableOpacity>
//       </View>
//     </DrawerContentScrollView>
//   );
// }

// // -----------------------------
// // Styles
// // -----------------------------
// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: 'space-between',
//     backgroundColor: '#f8f9fc',
//   },
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderColor: '#e4e7ee',
//   },
//   logoIcon: {
//     height: 36,
//     width: 36,
//     backgroundColor: '#0c0c0c',
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logoText: {
//     marginLeft: 10,
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1a1e2e',
//   },
//   menu: {
//     paddingHorizontal: 12,
//   },
//   sectionTitle: {
//     marginVertical: 10,
//     fontSize: 11,
//     fontWeight: '700',
//     color: '#8a8f9e',
//   },
//   navItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 6,
//     borderRadius: 10,
//   },
//   navText: {
//     marginLeft: 12,
//     fontSize: 15,
//     color: '#1a1e2e',
//     flex: 1,
//   },
//   activeNavItem: {
//     backgroundColor: '#eaf3ff',
//   },
//   activeNavText: {
//     color: '#0b74ff',
//     fontWeight: '600',
//   },
//   badge: {
//     backgroundColor: '#0b74ff',
//     minWidth: 20,
//     height: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: 11,
//     fontWeight: '700',
//   },
//   footer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderColor: '#e4e7ee',
//     padding: 16,
//   },
//   avatar: {
//     width: 42,
//     height: 42,
//     borderRadius: 10,
//     marginRight: 10,
//   },
//   userName: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   userRole: {
//     fontSize: 12,
//     color: '#8a8f9e',
//     textTransform: 'capitalize',
//   },
// });

// import React from 'react';
// import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
// import {DrawerContentScrollView} from '@react-navigation/drawer';
// import Icon from 'react-native-vector-icons/Feather';
// import {useNavigation} from '@react-navigation/native';

// const navigationItems = [
//   {name: 'Dashboard', icon: 'grid', route: 'Dashboard'},
//   {name: 'Projects', icon: 'folder', route: 'Projects'},
//   {name: 'Team', icon: 'users', route: 'Team'},
//   {name: 'Tasks', icon: 'check-square', route: 'Tasks'},
//   {name: 'Report', icon: 'bar-chart', route: 'Reports'},
// ];

// const secondaryItems = [
//   {name: 'Settings', icon: 'settings', route: 'Settings'},
// ];

// export default function CustomDrawer(props) {
//   const navigation = useNavigation();

//   const currentUser = {
//     name: 'Nirbhay',
//     role: 'project manager',
//     avatar:
//       'https://www.devoutgrowth.com/admin/team_uploads/1763707290_6920099a27a61_WhatsApp%20Image%202025-11-21%20at%2012.08.10%20PM.jpeg',
//   };

//   return (
//     <DrawerContentScrollView
//       {...props}
//       style={{backgroundColor: '#f8f9fc'}}
//       contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
//       <View>
//         {/* Logo */}
//         <View style={styles.logoContainer}>
//           <View style={styles.logoIcon}>
//             <Icon name="cpu" color="#fff" size={20} />
//           </View>
//           <Text style={styles.logoText}>Beam Build</Text>
//         </View>

//         {/* Main Menu */}
//         <View style={{paddingHorizontal: 12}}>
//           <Text style={styles.sectionTitle}>MAIN MENU</Text>

//           {navigationItems.map(item => {
//             const isActive =
//               props.state.routeNames[props.state.index] === item.route;

//             return (
//               <TouchableOpacity
//                 key={item.name}
//                 onPress={() => props.navigation.navigate(item.route)}
//                 style={[styles.navItem, isActive && styles.activeNavItem]}>
//                 <Icon
//                   name={item.icon}
//                   size={20}
//                   color={isActive ? '#0b74ff' : '#5a5f6e'}
//                 />
//                 <Text
//                   style={[styles.navText, isActive && styles.activeNavText]}>
//                   {item.name}
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}

//           {/* Settings */}
//           <Text style={[styles.sectionTitle, {marginTop: 20}]}>SETTINGS</Text>

//           {secondaryItems.map(item => (
//             <TouchableOpacity
//               key={item.name}
//               onPress={() => props.navigation.navigate(item.route)}
//               style={styles.navItem}>
//               <Icon name={item.icon} size={20} color="#5a5f6e" />
//               <Text style={styles.navText}>{item.name}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* Footer — User Profile */}
//       <View style={styles.footer}>
//         <Image source={{uri: currentUser.avatar}} style={styles.avatar} />
//         <View style={{flex: 1}}>
//           <Text style={styles.userName}>{currentUser.name}</Text>
//           <Text style={styles.userRole}>{currentUser.role}</Text>
//         </View>

//         <TouchableOpacity
//           onPress={() => {
//             navigation.reset({
//               index: 0,
//               routes: [{name: 'Login'}],
//             });
//             console.log('Logout pressed');
//           }}>
//           <Icon name="log-out" size={18} color="#777" />
//         </TouchableOpacity>
//       </View>
//     </DrawerContentScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderColor: '#e4e7ee',
//   },
//   logoIcon: {
//     height: 36,
//     width: 36,
//     backgroundColor: '#0c0c0cff',
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logoText: {
//     marginLeft: 10,
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1a1e2e',
//   },
//   sectionTitle: {
//     marginVertical: 10,
//     fontSize: 11,
//     fontWeight: '700',
//     color: '#8a8f9e',
//   },
//   navItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 6,
//     borderRadius: 10,
//   },
//   navText: {
//     marginLeft: 12,
//     fontSize: 15,
//     color: '#1a1e2e',
//   },
//   activeNavItem: {
//     backgroundColor: '#eaf3ff',
//   },
//   activeNavText: {
//     color: '#0b74ff',
//     fontWeight: '600',
//   },
//   footer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderColor: '#e4e7ee',
//     padding: 16,
//   },
//   avatar: {
//     width: 42,
//     height: 42,
//     borderRadius: 10,
//     marginRight: 10,
//   },
//   userName: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   userRole: {
//     fontSize: 12,
//     color: '#8a8f9e',
//     textTransform: 'capitalize',
//   },
// });
