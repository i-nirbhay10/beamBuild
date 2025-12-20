import React, {use, useMemo} from 'react';
import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';

import {useAuth} from '../../../context/AuthContext';
import {projects, teams} from '../../../data/mockData';
import {ProjectCard} from '../../../components/Project/ProjectCard';
import Header from '../../../components/layout/Header';

export default function MyProjectsScreen({navigation}) {
  const {user, teamMemberInfo} = useAuth();

  const myProjects = useMemo(() => {
    if (!user || teamMemberInfo?.role !== 'supervisor') return [];

    const supervisedTeamProjectIds = teams
      .filter(team =>
        team.members.some(m => m.userId === user.id && m.role === 'supervisor'),
      )
      .map(team => team.projectId);

    return projects.filter(p => supervisedTeamProjectIds.includes(p.id));
  }, [user, teamMemberInfo]);

  if (teamMemberInfo?.role !== 'supervisor') {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>
          Projects are only visible to supervisors.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="My Projects"
        subtitle={`Projects you are supervising`}
        notifications={'3'}
      />
      <FlatList
        data={myProjects}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
        }
        // ListHeaderComponent={
        //   <View style={styles.header}>
        //     <Text style={styles.title}>My Projects</Text>
        //     <Text style={styles.subtitle}>Projects you are supervising</Text>
        //   </View>
        // }
        ListEmptyComponent={
          <Text style={styles.muted}>No projects assigned</Text>
        }
        renderItem={({item}) => (
          <ProjectCard
            project={item}
            onView={() => navigation.navigate('ProjectDetails', {id: item.id})}
            onTasks={() => navigation.navigate('ProjectTasks', {id: item.id})}
            onMore={() => navigation.navigate('ProjectActions', {id: item.id})}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  list: {
    padding: 5,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },

  subtitle: {
    color: '#94a3b8',
    marginTop: 4,
    fontSize: 13,
  },

  muted: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
  },
});
