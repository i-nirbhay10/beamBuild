import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Switch} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {currentUser} from '../data/mockData';
import Header from '../components/Dashboard/Header';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [teamUpdates, setTeamUpdates] = useState(false);
  const [projectMilestones, setProjectMilestones] = useState(true);

  return (
    <View style={{flex: 1}}>
      <Header title="setting" subtitle={`Manage your construction projects`} />
      <ScrollView style={styles.container}>
        {/* Profile Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile</Text>
          <Text style={styles.cardDescription}>
            Update your personal information
          </Text>

          <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: currentUser.avatar || 'https://via.placeholder.com/100',
                }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraButton}>
                <Icon name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <Text style={styles.userRole}>{currentUser.role}</Text>
            </View>
          </View>

          <View style={styles.inputGrid}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              defaultValue={currentUser.name}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              defaultValue={currentUser.email}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              defaultValue={currentUser.phone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Company"
              defaultValue="BuildPro Construction"
            />
          </View>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about yourself..."
            defaultValue="Experienced contractor with over 15 years in commercial construction."
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notifications</Text>
          <Text style={styles.cardDescription}>
            Configure how you receive notifications
          </Text>

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Email Notifications</Text>
              <Text style={styles.switchSubtitle}>
                Receive email updates about your projects
              </Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
            />
          </View>

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Task Reminders</Text>
              <Text style={styles.switchSubtitle}>
                Get reminded about upcoming deadlines
              </Text>
            </View>
            <Switch value={taskReminders} onValueChange={setTaskReminders} />
          </View>

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Team Updates</Text>
              <Text style={styles.switchSubtitle}>
                Notifications when team members complete tasks
              </Text>
            </View>
            <Switch value={teamUpdates} onValueChange={setTeamUpdates} />
          </View>

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Project Milestones</Text>
              <Text style={styles.switchSubtitle}>
                Alerts for important project milestones
              </Text>
            </View>
            <Switch
              value={projectMilestones}
              onValueChange={setProjectMilestones}
            />
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Security</Text>
          <Text style={styles.cardDescription}>
            Manage your password and security settings
          </Text>

          <View style={styles.inputGrid}>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry
            />
            <View />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Change Password
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#f2f2f2'},
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {fontSize: 18, fontWeight: '700', marginBottom: 4},
  cardDescription: {fontSize: 14, color: '#666', marginBottom: 12},
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  avatarContainer: {position: 'relative'},
  avatar: {width: 80, height: 80, borderRadius: 40, marginRight: 12},
  cameraButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    padding: 4,
  },
  userName: {fontSize: 16, fontWeight: '600'},
  userRole: {fontSize: 12, color: '#888', textTransform: 'capitalize'},
  inputGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 6,
    flexGrow: 1,
    minWidth: '48%',
  },
  textArea: {height: 80, textAlignVertical: 'top', width: '100%'},
  button: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {color: '#fff', fontWeight: '600'},
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  secondaryButtonText: {color: '#3b82f6'},
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchTitle: {fontSize: 14, fontWeight: '600'},
  switchSubtitle: {fontSize: 12, color: '#666'},
});
