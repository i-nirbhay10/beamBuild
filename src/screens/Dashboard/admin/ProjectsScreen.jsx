import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Header from '../../../components/layout/Header';
import {CreateProjectModal} from '../../../components/Project/CreateProjectModal';
import {ProjectCard} from '../../../components/Project/ProjectCard';
import {projects} from '../../../data/mockData';

const TABS = [
  {key: 'all', label: 'All'},
  {key: 'active', label: 'Active', status: 'in-progress'},
  {key: 'planning', label: 'Planning', status: 'planning'},
  {key: 'completed', label: 'Completed', status: 'completed'},
];

export default function ProjectsScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);

  const filteredProjects = useMemo(() => {
    const tab = TABS.find(t => t.key === activeTab);
    if (!tab?.status) return projects;
    return projects.filter(p => p.status === tab.status);
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <Header title="Projects" subtitle="Manage your construction projects" />

      <TouchableOpacity
        style={styles.newBtn}
        onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={16} color="#fff" />
        <Text style={styles.newBtnText}>New Project</Text>
      </TouchableOpacity>

      {/* Tabs */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabRow}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            const count =
              tab.key === 'all'
                ? projects.length
                : projects.filter(p => p.status === tab.status).length;

            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => setActiveTab(tab.key)}>
                <Text
                  style={[styles.tabText, isActive && styles.activeTabText]}>
                  {tab.label} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filteredProjects}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => <ProjectCard project={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No projects in this category.</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#f8f9fc',
  },
  tabRow: {
    paddingHorizontal: 5,
    paddingBottom: 5,
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
    color: '#fff',
    fontWeight: '500',
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    marginVertical: 8,
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
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
  },
});
