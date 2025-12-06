import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {users, projects} from '../../data/mockData';

const permissions = [
  {id: 'view', label: 'View project details'},
  {id: 'edit', label: 'Edit tasks and updates'},
  {id: 'assign', label: 'Assign tasks to members'},
  {id: 'approve', label: 'Approve work and reports'},
  {id: 'report', label: 'Submit reports and issues'},
];

export function AddMemberDialog() {
  const [open, setOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([
    'view',
    'report',
  ]);

  return (
    <>
      <TouchableOpacity style={styles.addBtn} onPress={() => setOpen(true)}>
        <Icon name="user-plus" size={16} color="#fff" />
        <Text style={styles.addBtnText}>Add Member</Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView style={{flex: 1}}>
              <Text style={styles.title}>Add Team Member</Text>
              <Text style={styles.subtitle}>
                Add a new member to your team and assign them to a project.
              </Text>

              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} placeholder="e.g., John Smith" />

              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., john@company.com"
              />

              <Text style={styles.label}>Phone Number (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., +1 (555) 123-4567"
              />

              <Text style={styles.label}>Role</Text>
              <TextInput style={styles.input} placeholder="Select role" />

              <Text style={styles.label}>Assign to Project</Text>
              <TextInput style={styles.input} placeholder="Select project" />

              <Text style={styles.label}>Permissions</Text>
              {permissions.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.permissionItem}
                  onPress={() => {
                    if (selectedPermissions.includes(p.id)) {
                      setSelectedPermissions(
                        selectedPermissions.filter(x => x !== p.id),
                      );
                    } else {
                      setSelectedPermissions([...selectedPermissions, p.id]);
                    }
                  }}>
                  <Icon
                    name={
                      selectedPermissions.includes(p.id)
                        ? 'check-square'
                        : 'square'
                    }
                    size={18}
                  />
                  <Text style={styles.permissionText}>{p.label}</Text>
                </TouchableOpacity>
              ))}

              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setOpen(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={() => setOpen(false)}>
                  <Text style={styles.saveBtnText}>Add Member</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0b74ff',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  addBtnText: {color: '#fff', marginLeft: 6},

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '90%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  title: {fontSize: 18, fontWeight: '700', marginBottom: 4},
  subtitle: {fontSize: 12, color: '#555', marginBottom: 12},
  label: {marginTop: 12, fontSize: 12, color: '#555'},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  permissionText: {fontSize: 12},

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 8,
  },
  cancelBtn: {padding: 10, backgroundColor: '#eee', borderRadius: 6},
  cancelBtnText: {color: '#333'},
  saveBtn: {padding: 10, backgroundColor: '#0b74ff', borderRadius: 6},
  saveBtnText: {color: '#fff'},
});
