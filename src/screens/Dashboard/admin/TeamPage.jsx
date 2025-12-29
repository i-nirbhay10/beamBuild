import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import TeamMemberCard from '../../../components/team/TeamMemberCard';
import Icon from 'react-native-vector-icons/Feather';
import {users} from '../../../data/mockData';
import {AddMemberDialog} from '../../../components/team/AddMemberDialog';
import Header from '../../../components/layout/Header';

export default function TeamPage() {
  const [filter, setFilter] = useState('all');
  const [addMemberVisible, setAddMemberVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Exclude current user
  const teamMembers = users.slice(1);

  // Correct role names (MATCH mockData)
  const supervisors = teamMembers.filter(u => u.role === 'supervisor');
  const engineers = teamMembers.filter(u => u.role === 'engineer');
  const laborers = teamMembers.filter(u => u.role === 'laborer');
  const projectManagers = teamMembers.filter(u => u.role === 'project-manager');

  const stats = [
    {title: 'Total', value: teamMembers.length, icon: 'users'},
    {
      title: 'PMs',
      value: projectManagers.length,
      icon: 'briefcase',
    },
    {title: 'Supervisors', value: supervisors.length, icon: 'shield'},
    {title: 'Engineers', value: engineers.length, icon: 'cpu'},
    {title: 'Laborers', value: laborers.length, icon: 'tool'},
  ];

  const getFilteredMembers = () => {
    let members = teamMembers;

    switch (filter) {
      case 'project-manager':
        members = projectManagers;
        break;
      case 'supervisors':
        members = supervisors;
        break;
      case 'engineers':
        members = engineers;
        break;
      case 'laborers':
        members = laborers;
        break;
      default:
        members = teamMembers;
    }

    return members.filter(member =>
      member.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  };

  const filterButtons = [
    {key: 'all', label: 'All', count: teamMembers.length},
    {
      key: 'project-manager',
      label: 'Project Managers',
      count: projectManagers.length,
    },
    {key: 'supervisors', label: 'Supervisors', count: supervisors.length},
    {key: 'engineers', label: 'Engineers', count: engineers.length},
    {key: 'laborers', label: 'Laborers', count: laborers.length},
  ];

  return (
    <View style={{flex: 1}}>
      <Header title="Team" subtitle="Manage your construction projects" />

      <ScrollView style={{flex: 1, padding: 12}}>
        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map(s => (
            <View key={s.title} style={styles.statBox}>
              <Icon name={s.icon} size={16} color="#6F1FFC" />
              <View>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statTitle}>{s.title}</Text>
              </View>
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersRow}>
            {filterButtons.map(f => (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterBtn,
                  filter === f.key && styles.filterBtnActive,
                ]}
                onPress={() => setFilter(f.key)}>
                <Text
                  style={[
                    styles.filterText,
                    filter === f.key && styles.filterTextActive,
                  ]}>
                  {f.label} ({f.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Members */}
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
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statBox: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,
    backgroundColor: '#F4F2FF',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6F1FFC',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  statTitle: {
    fontSize: 11,
    color: '#666',
  },

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
    borderWidth: 1,
    borderColor: '#6F1FFC',
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
    gap: 6,
    marginBottom: 12,
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
