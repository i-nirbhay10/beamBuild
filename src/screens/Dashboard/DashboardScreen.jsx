import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import Header from '../../components/Dashboard/Header';
import StatsCards from '../../components/Dashboard/StatsCards';
import ProjectOverview from '../../components/Dashboard/ProjectOverview';
import RecentTasks from '../../components/Dashboard/RecentTasks';
import TeamActivity from '../../components/Dashboard/TeamActivity';
import ProjectDetail from '../../components/Dashboard/ProjectDetail';
import {DataProvider, useData} from '../../context/DataContext';
import {useNavigation} from '@react-navigation/native';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [openProjectId, setOpenProjectId] = useState(null);

  // function openProject(id) {
  //    setOpenProjectId(id);
  // }

  function openProject() {
    console.log('Opening project...');
    navigation.navigate('Projects');
  }

  function closeProject() {
    setOpenProjectId(null);
  }

  const {currentUser} = useData() || {}; // for subtitle

  return (
    <DataProvider>
      <SafeAreaView style={styles.container}>
        <Header
          title="Dashboard"
          subtitle={`Welcome back, ${currentUser?.name || ''}`}
        />

        <ScrollView contentContainerStyle={styles.content}>
          <StatsCards />

          <View style={styles.grid}>
            <ProjectOverview onOpenProject={openProject} />
          </View>
          <RecentTasks />

          <TeamActivity />
        </ScrollView>

        {/* Project Detail Modal */}
        {openProjectId && (
          <View style={styles.projectModal}>
            <TouchableOpacity onPress={closeProject} style={styles.modalClose}>
              <Text style={{color: '#fff'}}>Close</Text>
            </TouchableOpacity>
            <ProjectDetail projectId={openProjectId} />
          </View>
        )}
      </SafeAreaView>
    </DataProvider>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f7fb'},
  content: {padding: 16, paddingBottom: 120},
  grid: {flexDirection: 'row', gap: 12, justifyContent: 'space-between'},
  projectModal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 90,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    elevation: 5,
  },
  modalClose: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: '#111',
    padding: 8,
    borderRadius: 8,
  },
});
