import React, {useMemo, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import {useAuth} from '../../../context/AuthContext';
import {teams, documents} from '../../../data/mockData';
import Header from '../../../components/layout/Header';
import {DocumentCard} from '../../../components/Document/DocumentCard';

export default function EngineerDocumentsScreen() {
  const {user} = useAuth();
  const [search, setSearch] = useState('');

  // Only engineers can access this screen
  if (user?.role !== 'engineer') {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Access restricted</Text>
      </View>
    );
  }

  // Get teams the engineer is part of
  const memberTeams = useMemo(
    () => teams.filter(team => team.members.some(m => m.userId === user.id)),
    [user],
  );

  const assignedProjectIds = memberTeams.map(t => t.projectId);

  // Filter documents by project and search term
  const myDocuments = useMemo(
    () =>
      documents.filter(
        d =>
          assignedProjectIds.includes(d.projectId) &&
          d.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [assignedProjectIds, search],
  );

  return (
    <View style={styles.container}>
      <Header title="Documents" subtitle="View and upload project files" />

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.topRow}>
          <TextInput
            placeholder="Search documents..."
            placeholderTextColor="#64748b"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />

          <Pressable style={styles.uploadBtn}>
            <FAIcon name="upload" size={14} color="#fff" />
            <Text style={styles.uploadText}>Upload</Text>
          </Pressable>
        </View>

        {myDocuments.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.muted}>No documents found</Text>
          </View>
        ) : (
          myDocuments.map(doc => <DocumentCard key={doc.id} document={doc} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContainer: {
    padding: 5,
  },
  topRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#020617',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
    color: '#fff',
    fontSize: 13,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#643bf6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  uploadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  center: {
    alignItems: 'center',
    padding: 30,
  },
  muted: {
    color: '#94a3b8',
    fontSize: 13,
  },
});
