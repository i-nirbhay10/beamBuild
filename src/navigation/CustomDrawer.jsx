import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Feather';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {NAV_ITEMS} from './roleNavigationConfig';

/* -----------------------------
   Helpers
------------------------------ */

const getNavigationItems = role => NAV_ITEMS[role] || [];

/* -----------------------------
   Custom Drawer
------------------------------ */

export default function CustomDrawer(props) {
  const [currentUser, setCurrentUser] = useState(null);

  /* Load user from storage */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const json = await AsyncStorage.getItem('currentUser');
        if (json) setCurrentUser(JSON.parse(json));
      } catch (error) {
        console.log('Failed to load user:', error);
      }
    };

    loadUser();
  }, []);

  /* Loading state */
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
      {/* ================= HEADER ================= */}
      <View>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Icon name="cpu" size={20} color="#fff" />
          </View>
          <Text style={styles.logoText}>Beam Build</Text>
        </View>

        {/* ================= MAIN MENU ================= */}
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

                <Icon
                  name="chevron-right"
                  size={18}
                  color={isActive ? '#0b74ff' : '#9ca3af'}
                />
              </TouchableOpacity>
            );
          })}

          {/* ================= SETTINGS ================= */}
          <Text style={[styles.sectionTitle, {marginTop: 20}]}>SETTINGS</Text>

          <TouchableOpacity
            onPress={() => props.navigation.navigate('CompanyProfile')}
            style={styles.navItem}>
            <FontIcon name="building-o" size={20} color="#5a5f6e" />
            <Text style={styles.navText}>Company Profile</Text>
            <Icon name="chevron-right" size={18} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => props.navigation.navigate('Settings')}
            style={styles.navItem}>
            <Icon name="settings" size={20} color="#5a5f6e" />
            <Text style={styles.navText}>Settings</Text>
            <Icon name="chevron-right" size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ================= FOOTER ================= */}
      <View style={styles.footer}>
        <Image
          source={{
            uri:
              currentUser.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                currentUser.name,
              )}`,
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

  /* Header */
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e4e7ee',
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0c0c0c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1e2e',
  },

  /* Menu */
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
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#1a1e2e',
  },
  activeNavItem: {
    backgroundColor: '#eaf3ff',
  },
  activeNavText: {
    color: '#0b74ff',
    fontWeight: '600',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0b74ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  /* Footer */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e4e7ee',
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
// import FontIcon from 'react-native-vector-icons/FontAwesome';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {NAV_ITEMS} from './roleNavigationConfig';

// /* -----------------------------
//    Role-based navigation config
// ------------------------------ */

// const getNavigationItems = role => NAV_ITEMS[role] || [];

// /* -----------------------------
//    Drawer Component
// ------------------------------ */

// export default function CustomDrawer(props) {
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const json = await AsyncStorage.getItem('currentUser');
//         if (json) setCurrentUser(JSON.parse(json));
//       } catch (e) {
//         console.log('Failed to load user:', e);
//       }
//     };
//     loadUser();
//   }, []);

//   if (!currentUser) {
//     return (
//       <View style={styles.center}>
//         <Text>Loading user...</Text>
//       </View>
//     );
//   }

//   const navigationItems = getNavigationItems(currentUser.role);
//   const currentRoute = props.state.routes[props.state.index]?.name;

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

//         {/* Menu */}
//         <View style={styles.menu}>
//           <Text style={styles.sectionTitle}>MAIN MENU</Text>

//           {navigationItems.map(item => {
//             const isActive = currentRoute === item.route;

//             return (
//               <TouchableOpacity
//                 key={item.route}
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

//                 {/* RIGHT ARROW */}
//                 <Icon
//                   name="chevron-right"
//                   size={18}
//                   color={isActive ? '#0b74ff' : '#9ca3af'}
//                 />
//               </TouchableOpacity>
//             );
//           })}

//           <Text style={[styles.sectionTitle, {marginTop: 20}]}>SETTINGS</Text>
//           <TouchableOpacity
//             onPress={() => props.navigation.navigate('CompanyProfile')}
//             style={styles.navItem}>
//             <FontIcon name="building-o" size={20} color="#5a5f6e" />
//             <Text style={styles.navText}>Company Profile</Text>
//             <Icon name="chevron-right" size={18} color="#9ca3af" />
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => props.navigation.navigate('Settings')}
//             style={styles.navItem}>
//             <Icon name="settings" size={20} color="#5a5f6e" />
//             <Text style={styles.navText}>Settings</Text>
//             <Icon name="chevron-right" size={18} color="#9ca3af" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Footer */}
//       <View style={styles.footer}>
//         <Image
//           source={{
//             uri:
//               currentUser.avatar ||
//               'https://ui-avatars.com/api/?name=' +
//                 encodeURIComponent(currentUser.name),
//           }}
//           style={styles.avatar}
//         />

//         <View style={{flex: 1}}>
//           <Text style={styles.userName}>{currentUser.name}</Text>
//           <Text style={styles.userRole}>{currentUser.role}</Text>
//         </View>

//         <TouchableOpacity
//           onPress={async () => {
//             await AsyncStorage.removeItem('currentUser');
//             props.navigation.reset({
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

// /* -----------------------------
//    Styles
// ------------------------------ */

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: 'space-between',
//     backgroundColor: '#f8f9fc',
//   },
//   center: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
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
