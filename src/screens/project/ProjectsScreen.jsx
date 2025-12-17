import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {CreateProjectModal} from '../../components/Project/CreateProjectModal';
import {ProjectCard} from '../../components/Project/ProjectCard';
import {projects} from '../../data/mockData';
import Header from '../../components/layout/Header';

export default function ProjectsScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);

  const activeProjects = projects.filter(p => p.status === 'in-progress');
  const planningProjects = projects.filter(p => p.status === 'planning');
  const completedProjects = projects.filter(p => p.status === 'completed');

  const getProjectsToShow = () => {
    if (activeTab === 'active') return activeProjects;
    if (activeTab === 'planning') return planningProjects;
    if (activeTab === 'completed') return completedProjects;
    return projects;
  };

  return (
    <View style={styles.container}>
      {/* Header */}

      <Header title="Projects" subtitle={`Manage your construction projects`} />
      <TouchableOpacity
        style={styles.newBtn}
        onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={16} color="#fff" />
        <Text style={styles.newBtnText}>New Project</Text>
      </TouchableOpacity>
      {/* Tabs + New Project Button */}
      <View style={styles.tabRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'all' && styles.activeTabText,
              ]}>
              All ({projects.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'active' && styles.activeTab]}
            onPress={() => setActiveTab('active')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'active' && styles.activeTabText,
              ]}>
              Active ({activeProjects.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'planning' && styles.activeTab]}
            onPress={() => setActiveTab('planning')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'planning' && styles.activeTabText,
              ]}>
              Planning ({planningProjects.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'completed' && styles.activeTabText,
              ]}>
              Completed ({completedProjects.length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Project List */}
      <FlatList
        data={getProjectsToShow()}
        keyExtractor={item => item.id.toString()}
        // numColumns={2}
        // columnWrapperStyle={{gap: 12}}
        // contentContainerStyle={{padding: 12}}
        renderItem={({item}) => <ProjectCard project={item} />}
        ListEmptyComponent={
          <View style={{padding: 40, alignItems: 'center'}}>
            <Text style={{color: '#888'}}>No projects in this category.</Text>
          </View>
        }
      />

      <CreateProjectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f8f9fc'},
  tabRow: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingBottom: 5,
    justifyContent: 'space-between',
  },
  tab: {
    backgroundColor: '#f0f2f5',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#0a2d5aff',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeTabText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    justifyContent: 'space-between',
    backgroundColor: '#000',
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  newBtnText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
});
