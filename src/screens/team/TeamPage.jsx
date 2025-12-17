import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';
import TeamMemberCard from '../../components/team/TeamMemberCard';
import Icon from 'react-native-vector-icons/Feather';
import {users} from '../../data/mockData';
import {AddMemberDialog} from '../../components/team/AddMemberDialog';
import Header from '../../components/layout/Header';

export default function TeamPage() {
  const [filter, setFilter] = useState('all');
  const [addMemberVisible, setAddMemberVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const teamMembers = users?.slice(1) || []; // safe fallback
  const supervisors = teamMembers.filter(u => u.role === 'supervisor');
  const engineers = teamMembers.filter(u => u.role === 'engineer');
  const laborers = teamMembers.filter(u => u.role === 'laborer');
  const projectManagers = teamMembers.filter(u => u.role === 'project_manager');

  const stats = [
    {title: 'Total Members', value: teamMembers.length},
    {title: 'Project Managers', value: projectManagers.length},
    {title: 'Supervisors', value: supervisors.length},
    {title: 'Engineers', value: engineers.length},
    {title: 'Laborers', value: laborers.length},
  ];

  // Filter members based on role + search text
  const getFilteredMembers = () => {
    let members = teamMembers;
    switch (filter) {
      case 'supervisors':
        members = supervisors;
        break;
      case 'engineers':
        members = engineers;
        break;
      case 'laborers':
        members = laborers;
        break;
      case 'project_manager':
        members = projectManagers;
        break;
      default:
        members = teamMembers;
    }

    if (!members) return [];
    return members.filter(member =>
      member.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  };

  return (
    <View style={{flex: 1}}>
      <Header title="Team" subtitle="Manage your construction projects" />

      <ScrollView style={{flex: 1, padding: 12}}>
        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map(s => (
            <View key={s.title} style={styles.statBox}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statTitle}>{s.title}</Text>
            </View>
          ))}
        </View>

        {/* Search + Add Member */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Icon name="search" size={16} color="#777" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search members..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <AddMemberDialog
            visible={addMemberVisible}
            onClose={() => setAddMemberVisible(false)}
          />
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersRow}>
          {[
            'all',
            'project_manager',
            'supervisors',
            'engineers',
            'laborers',
          ].map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}>
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}>
                {f.charAt(0).toUpperCase() + f.slice(1)} (
                {getFilteredMembers().length})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Team Members List */}
        {getFilteredMembers().map(user => (
          <TeamMemberCard key={user.id} user={user} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    backgroundColor: '#7a8fd671',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  statValue: {fontSize: 18, fontWeight: '700'},
  statTitle: {fontSize: 12, color: '#555'},

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 40,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6F1FFC',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    gap: 4,
  },
  addText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },

  filtersRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 6,
  },
  filterBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  filterBtnActive: {backgroundColor: '#6F1FFC'},
  filterText: {fontSize: 12, color: '#333'},
  filterTextActive: {color: '#fff'},
});
