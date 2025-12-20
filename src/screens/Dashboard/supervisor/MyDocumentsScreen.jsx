import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';

import {teams, documents, getProjectById} from '../../../data/mockData';
import Header from '../../../components/layout/Header';
import {useAuth} from '../../../context/AuthContext';

/* ---------- Type Colors ---------- */

const typeColors = {
  plan: '#3b82f6',
  contract: '#f59e0b',
  permit: '#10b981',
  report: '#8b5cf6',
  other: '#64748b',
};

/* ---------- Screen ---------- */

export default function MyDocumentsScreen() {
  const {user} = useAuth();
  const [search, setSearch] = useState('');

  if (!['supervisor', 'engineer'].includes(user?.role)) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Access restricted</Text>
      </View>
    );
  }

  /* ---------- Data ---------- */

  const memberTeams = useMemo(
    () => teams.filter(team => team.members.some(m => m.userId === user.id)),
    [user],
  );

  const assignedProjectIds = memberTeams.map(t => t.projectId);

  const myDocuments = useMemo(
    () =>
      documents.filter(
        d =>
          assignedProjectIds.includes(d.projectId) &&
          d.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [assignedProjectIds, search],
  );

  /* ---------- UI ---------- */

  return (
    <View style={{flex: 1}}>
      <Header title="Documents" subtitle="Project documents and files" />

      <ScrollView style={styles.container}>
        {/* ---------- Search & Upload ---------- */}
        <View style={styles.topRow}>
          <View style={styles.searchBox}>
            <Icon name="search" size={18} color="#64748b" />
            <TextInput
              placeholder="Search documents..."
              placeholderTextColor="#64748b"
              style={styles.input}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {user.role === 'engineer' && (
            <Pressable style={styles.uploadBtn}>
              <FAIcon name="upload" size={14} color="#fff" />
              <Text style={styles.uploadText}>Upload</Text>
            </Pressable>
          )}
        </View>

        {/* ---------- Documents ---------- */}
        {myDocuments.length === 0 ? (
          <View style={styles.center}>
            <Icon name="folder-off" size={36} color="#94a3b8" />
            <Text style={styles.muted}>No documents found</Text>
          </View>
        ) : (
          myDocuments.map(doc => {
            const project = getProjectById(doc.projectId);
            const color = typeColors[doc.type] || typeColors.other;

            return (
              <View key={doc.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View
                    style={[styles.docIcon, {backgroundColor: `${color}22`}]}>
                    <Icon name="description" size={20} color={color} />
                  </View>

                  <View style={{flex: 1}}>
                    <Text style={styles.docName} numberOfLines={1}>
                      {doc.name}
                    </Text>
                    <Text style={styles.muted}>{project?.name}</Text>

                    <View style={styles.metaRow}>
                      <View style={[styles.badge, {borderColor: color}]}>
                        <Text style={[styles.badgeText, {color}]}>
                          {doc.type}
                        </Text>
                      </View>
                      <Text style={styles.sizeText}>{doc.size}</Text>
                    </View>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.actionsRow}>
                  <ActionBtn icon="eye" label="View" />
                  <ActionBtn icon="download" label="Download" />
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

/* ---------- Small Components ---------- */

const ActionBtn = ({icon, label}) => (
  <Pressable style={styles.actionBtn}>
    <FAIcon name={icon} size={13} color="#334155" />
    <Text style={styles.actionText}>{label}</Text>
  </Pressable>
);

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a',
    padding: 10,
  },

  center: {
    alignItems: 'center',
    padding: 30,
  },

  muted: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 6,
  },

  /* Search */
  topRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#020617',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
  },

  input: {
    flex: 1,
    marginLeft: 6,
    color: '#fff',
    fontSize: 13,
  },

  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  uploadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  /* Cards */
  card: {
    backgroundColor: '#020617',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },

  cardHeader: {
    flexDirection: 'row',
    gap: 10,
  },

  docIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  docName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },

  badge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  sizeText: {
    color: '#94a3b8',
    fontSize: 11,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingVertical: 6,
    borderRadius: 8,
  },

  actionText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '600',
  },
});
