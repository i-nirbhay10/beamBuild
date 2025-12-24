import React, {useMemo} from 'react';
import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';

import {useAuth} from '../../../context/AuthContext';
import {projects, teams} from '../../../data/mockData';
import {ProjectCard} from '../../../components/Project/ProjectCard';
import Header from '../../../components/layout/Header';

export default function ProjectsScreenBase({
  navigation,
  title = 'My Projects',
}) {
  const {user, teamMemberInfo} = useAuth();
  const role = teamMemberInfo?.role;

  const visibleProjects = useMemo(() => {
    if (!user || !role) return [];

    // ───────────────── SUPERVISOR ─────────────────
    if (role === 'supervisor') {
      const supervisedIds = teams
        .filter(team =>
          team.members.some(
            m => m.userId === user.id && m.role === 'supervisor',
          ),
        )
        .map(team => team.projectId);

      return projects.filter(p => supervisedIds.includes(p.id));
    }

    // ─────────────── PROJECT MANAGER ───────────────
    if (role === 'project-manager') {
      // Managers see all projects they are assigned to (or all projects)
      const managerProjectIds = teams
        .filter(team => team.members.some(m => m.userId === user.id))
        .map(team => team.projectId);

      return projects.filter(p => managerProjectIds.includes(p.id));
    }

    // ───────────────── ENGINEER / OTHERS ─────────────────
    const memberProjectIds = teams
      .filter(team => team.members.some(m => m.userId === user.id))
      .map(team => team.projectId);

    return projects.filter(p => memberProjectIds.includes(p.id));
  }, [user, role]);

  const subtitleMap = {
    supervisor: 'Projects you are supervising',
    'project-manager': 'Projects you are managing',
    engineer: 'Projects you are assigned to',
  };

  return (
    <View style={styles.container}>
      <Header title={title} subtitle={subtitleMap[role] || 'Your projects'} />

      <FlatList
        data={visibleProjects}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
        }
        ListEmptyComponent={
          <Text style={styles.muted}>No projects available for your role.</Text>
        }
        renderItem={({item}) => <ProjectCard project={item} />}
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
  muted: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
  },
});
