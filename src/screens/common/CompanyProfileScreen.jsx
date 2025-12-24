import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useAuth} from '../../context/AuthContext';
import {
  companyProfile as initialProfile,
  projects,
  users,
} from '../../data/mockData';
import Header from '../../components/layout/Header';

/* -----------------------------
   Role + Owner Guard
------------------------------ */
function useCanEditCompany(profile) {
  const {user} = useAuth();
  return user?.role === 'contractor' && user?.id === profile.ownerId;
}

/* -----------------------------
   Screen
------------------------------ */
export default function CompanyProfileScreen() {
  const {user} = useAuth();
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [newExpertise, setNewExpertise] = useState('');

  const canEdit = useCanEditCompany(profile);

  const addExpertise = () => {
    if (!newExpertise.trim()) return;
    setProfile(prev => ({
      ...prev,
      expertise: [...prev.expertise, newExpertise.trim()],
    }));
    setNewExpertise('');
  };

  const removeExpertise = index => {
    setProfile(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index),
    }));
  };

  return (
    <View style={{flex: 1}}>
      <Header title="Company Profile" subtitle={profile.name} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Edit Actions */}
        {user?.role === 'contractor' && (
          <View style={styles.editActions}>
            {isEditing ? (
              <>
                <TouchableOpacity
                  style={styles.outlineBtn}
                  onPress={() => setIsEditing(false)}>
                  <Icon name="x" size={16} />
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => setIsEditing(false)}>
                  <Icon name="save" size={16} color="#fff" />
                  <Text style={{color: '#fff'}}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => setIsEditing(true)}>
                <Icon name="edit-2" size={16} color="#fff" />
                <Text style={{color: '#fff'}}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Company Card */}
        <View style={styles.card}>
          <Image source={{uri: profile.logo}} style={styles.logo} />
          <Text style={styles.companyName}>{profile.name}</Text>
          <Text style={styles.muted}>{profile.description}</Text>

          <View style={styles.infoRow}>
            <Icon name="mail" size={14} />
            <Text>{profile.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="phone" size={14} />
            <Text>{profile.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="map-pin" size={14} />
            <Text>{profile.address}</Text>
          </View>

          <View style={styles.statsRow}>
            <Stat label="Employees" value={profile.employeeCount} />
            <Stat label="Active" value={projects.length} />
            <Stat label="Completed" value={profile.completedProjects} />
          </View>
        </View>

        {/* Editable Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Company Info</Text>

          <Input
            label="Company Name"
            value={profile.name}
            editable={isEditing}
            onChangeText={v => setProfile({...profile, name: v})}
          />
          <Input
            label="Email"
            value={profile.email}
            editable={isEditing}
            onChangeText={v => setProfile({...profile, email: v})}
          />
          <Input
            label="Phone"
            value={profile.phone}
            editable={isEditing}
            onChangeText={v => setProfile({...profile, phone: v})}
          />
          <Input
            label="Established"
            value={profile.established}
            editable={isEditing}
            onChangeText={v => setProfile({...profile, established: v})}
          />
        </View>

        {/* Expertise */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Expertise</Text>
          <View style={styles.badgeRow}>
            {profile.expertise.map((e, i) => (
              <View key={i} style={styles.badge}>
                <Text>{e}</Text>
                {isEditing && (
                  <TouchableOpacity onPress={() => removeExpertise(i)}>
                    <Icon name="x" size={12} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {isEditing && (
            <View style={styles.addRow}>
              <TextInput
                value={newExpertise}
                onChangeText={setNewExpertise}
                placeholder="Add expertise"
                style={styles.input}
              />
              <TouchableOpacity onPress={addExpertise}>
                <Icon name="plus" size={20} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Team Preview */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Team</Text>
          {users.slice(0, 6).map(u => (
            <View key={u.id} style={styles.userRow}>
              <Image source={{uri: u.avatar}} style={styles.avatar} />
              <View>
                <Text>{u.name}</Text>
                <Text style={styles.muted}>{u.role}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Projects */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {projects.map(p => (
            <View key={p.id} style={styles.projectRow}>
              <View>
                <Text>{p.name}</Text>
                <Text style={styles.muted}>{p.location}</Text>
              </View>
              <Text>{p.progress}%</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* -----------------------------
   Small Components
------------------------------ */
function Input({label, ...props}) {
  return (
    <View style={{marginBottom: 10}}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...props} />
    </View>
  );
}

function Stat({label, value}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

/* -----------------------------
   Styles
------------------------------ */
const styles = StyleSheet.create({
  container: {padding: 5, paddingBottom: 10, backgroundColor: '#382f2fff'},
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 10,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  muted: {color: '#6b7280', fontSize: 12},
  infoRow: {flexDirection: 'row', gap: 8, marginTop: 6},
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  stat: {alignItems: 'center'},
  statValue: {fontSize: 18, fontWeight: '700'},
  sectionTitle: {fontSize: 16, fontWeight: '600', marginBottom: 10},
  badgeRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 6},
  badge: {
    flexDirection: 'row',
    gap: 6,
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  addRow: {flexDirection: 'row', alignItems: 'center', gap: 10},
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 8,
    flex: 1,
  },
  label: {fontSize: 12, marginBottom: 4},
  userRow: {flexDirection: 'row', gap: 10, marginBottom: 10},
  avatar: {width: 36, height: 36, borderRadius: 8},
  projectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginBottom: 10,
  },
  primaryBtn: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#0b74ff',
    padding: 10,
    borderRadius: 10,
  },
  outlineBtn: {
    flexDirection: 'row',
    gap: 6,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
});
