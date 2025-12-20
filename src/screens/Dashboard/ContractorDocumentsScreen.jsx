import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Header from '../../components/layout/Header';
import {useAuth} from '../../context/AuthContext';
import {documents, projects} from '../../data/mockData';

/* -----------------------------
   Role Guard (dynamic)
------------------------------ */
function RoleGuard({allowedRoles, children}) {
  const {user} = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Access denied</Text>
      </View>
    );
  }

  return children;
}

/* -----------------------------
   Screen
------------------------------ */

export default function ContractorDocumentsScreen() {
  const {user} = useAuth();

  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  /* -----------------------------
     Filtered documents
  ------------------------------ */
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesProject =
        selectedProject === 'all' || doc.projectId === selectedProject;

      const matchesType = selectedType === 'all' || doc.type === selectedType;

      return matchesSearch && matchesProject && matchesType;
    });
  }, [search, selectedProject, selectedType]);

  /* -----------------------------
     Stats
  ------------------------------ */
  const stats = {
    total: documents.length,
    plan: documents.filter(d => d.type === 'plan').length,
    contract: documents.filter(d => d.type === 'contract').length,
    permit: documents.filter(d => d.type === 'permit').length,
  };

  /* -----------------------------
     Render document card
  ------------------------------ */
  const renderDoc = ({item}) => {
    const project = projects.find(p => p.id === item.projectId);

    return (
      <View style={styles.docCard}>
        <View style={styles.docHeader}>
          <Icon name="file-text" size={20} color="#0b74ff" />
          <Text style={styles.docTitle} numberOfLines={1}>
            {item.name}
          </Text>
        </View>

        <Text style={styles.muted}>{project?.name}</Text>

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.type}</Text>
          </View>
          <Text style={styles.muted}>{item.size}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Icon name="eye" size={14} />
            <Text style={styles.actionText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Icon name="download" size={14} />
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <RoleGuard allowedRoles={['contractor']}>
      <View style={{flex: 1}}>
        <Header title="Documents" subtitle={`Welcome back, ${user?.name}`} />

        <FlatList
          ListHeaderComponent={
            <>
              {/* Stats */}
              <View style={styles.statsRow}>
                <StatCard label="Total" value={stats.total} />
                <StatCard label="Plans" value={stats.plan} />
                <StatCard label="Contracts" value={stats.contract} />
                <StatCard label="Permits" value={stats.permit} />
              </View>

              {/* Search */}
              <View style={styles.searchRow}>
                <Icon name="search" size={16} color="#64748b" />
                <TextInput
                  placeholder="Search documents..."
                  value={search}
                  onChangeText={setSearch}
                  style={styles.searchInput}
                />
              </View>

              {/* Tabs */}
              <View style={styles.tabs}>
                {['all', 'plan', 'contract', 'permit', 'report'].map(type => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setSelectedType(type)}
                    style={[
                      styles.tab,
                      selectedType === type && styles.activeTab,
                    ]}>
                    <Text
                      style={[
                        styles.tabText,
                        selectedType === type && styles.activeTabText,
                      ]}>
                      {type.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          }
          data={filteredDocuments}
          keyExtractor={item => item.id}
          renderItem={renderDoc}
          contentContainerStyle={{padding: 12, paddingBottom: 120}}
          ListEmptyComponent={
            <View style={styles.center}>
              <Icon name="folder" size={40} color="#94a3b8" />
              <Text style={styles.muted}>No documents found</Text>
            </View>
          }
        />
      </View>
    </RoleGuard>
  );
}

/* -----------------------------
   Components
------------------------------ */

function StatCard({label, value}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/* -----------------------------
   Styles
------------------------------ */

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  muted: {
    color: '#6b7280', // gray-500
    fontSize: 12,
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8fafc', // light slate
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statValue: {
    color: '#0f172a', // dark text only
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 11,
    marginTop: 2,
  },

  /* Search */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    padding: 10,
    color: '#111827',
  },

  /* Tabs */
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 6,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  activeTab: {
    backgroundColor: '#2563eb', // blue-600
  },
  tabText: {
    fontSize: 11,
    color: '#475569',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },

  /* Document card */
  docCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  docTitle: {
    color: '#111827',
    fontWeight: '600',
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  badge: {
    backgroundColor: '#eff6ff', // light blue
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    color: '#2563eb',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
});
