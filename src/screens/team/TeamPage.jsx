import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import TeamMemberCard from '../../components/team/TeamMemberCard';
// import AddMemberDialog from '../../components/team/AddMemberDialog';
import Icon from 'react-native-vector-icons/Feather';
import {users} from '../../data/mockData';
import {AddMemberDialog} from '../../components/team/AddMemberDialog';
import Header from '../../components/Dashboard/Header';

export default function TeamPage() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filter, setFilter] = useState('all');
  const [addMemberVisible, setAddMemberVisible] = useState(false);

  const teamMembers = users.slice(1); // exclude contractor
  const supervisors = teamMembers.filter(u => u.role === 'supervisor');
  const engineers = teamMembers.filter(u => u.role === 'engineer');
  const laborers = teamMembers.filter(u => u.role === 'laborer');

  const stats = [
    {title: 'Total Members', value: teamMembers.length},
    {title: 'Supervisors', value: supervisors.length},
    {title: 'Engineers', value: engineers.length},
    {title: 'Laborers', value: laborers.length},
  ];

  const getFilteredMembers = () => {
    switch (filter) {
      case 'supervisors':
        return supervisors;
      case 'engineers':
        return engineers;
      case 'laborers':
        return laborers;
      default:
        return teamMembers;
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header title="Team" subtitle={`Manage your construction projects`} />
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
        {/* Filters + Add Member */}
        <View style={styles.filterRow}>
          <View
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filters}>
            {['all', 'supervisors', 'engineers', 'laborers'].map(f => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterBtn,
                  filter === f && styles.filterBtnActive,
                ]}
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
          </View>

          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                viewMode === 'grid' && styles.toggleBtnActive,
              ]}
              onPress={() => setViewMode('grid')}>
              <Icon name="grid" size={18} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                viewMode === 'list' && styles.toggleBtnActive,
              ]}
              onPress={() => setViewMode('list')}>
              <Icon name="list" size={18} />
            </TouchableOpacity>
          </View>

          <AddMemberDialog
            visible={addMemberVisible}
            onClose={() => setAddMemberVisible(false)}
          />
        </View>
        Team Members
        {getFilteredMembers().map(user => (
          <TeamMemberCard key={user.id} user={user} />
        ))}
        {/* <View
          style={[
            styles.membersContainer,
            viewMode === 'grid' && styles.membersGrid,
          ]}>
          {getFilteredMembers().map(user =>
            viewMode === 'grid' ? (
              <TeamMemberCard key={user.id} user={user} />
            ) : (
              <TeamMemberCard key={user.id} user={user} />
            ),
          )}
        </View> */}
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

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  filters: {flexDirection: 'row', flexWrap: 'wrap', gap: 6},
  filterBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#eee',
    marginRight: 6,
    marginBottom: 4,
  },
  filterBtnActive: {backgroundColor: '#0b74ff'},
  filterText: {fontSize: 12, color: '#333'},
  filterTextActive: {color: '#fff'},

  viewToggle: {flexDirection: 'row', gap: 6},
  toggleBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  toggleBtnActive: {backgroundColor: '#0b74ff', color: '#fff'},

  membersContainer: {flexDirection: 'column'},
  // membersGrid: {
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   justifyContent: 'space-between',
  // },
});
