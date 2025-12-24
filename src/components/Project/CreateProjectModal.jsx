import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';

/* -----------------------------
   Project Status Options with Colors
------------------------------ */
const PROJECT_STATUSES = [
  {label: 'Planning', color: '#F59E0B'}, // Amber
  {label: 'Planning Complete', color: '#10B981'}, // Green
  {label: 'In Progress', color: '#3B82F6'}, // Blue
  {label: 'On Hold', color: '#F97316'}, // Orange
  {label: 'Completed', color: '#6366F1'}, // Indigo
];

/* -----------------------------
   Modal Component
------------------------------ */
export function CreateProjectModal({visible, onClose}) {
  const [status, setStatus] = useState('Draft');

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Create New Project</Text>

          <ScrollView
            style={{marginTop: 10}}
            showsVerticalScrollIndicator={false}>
            {/* Project Name */}
            <Text style={styles.label}>Project Name</Text>
            <TextInput style={styles.input} placeholder="Enter project name" />

            {/* Location */}
            <Text style={styles.label}>Location</Text>
            <TextInput style={styles.input} placeholder="Enter location" />

            {/* Description */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, {height: 80}]}
              multiline
              placeholder="Brief project description"
            />

            {/* Status */}
            <Text style={styles.label}>Project Status</Text>
            <View style={styles.statusRow}>
              {PROJECT_STATUSES.map(s => {
                const isActive = status === s.label;
                return (
                  <TouchableOpacity
                    key={s.label}
                    onPress={() => setStatus(s.label)}
                    style={[
                      styles.statusChip,
                      {backgroundColor: isActive ? s.color : '#f2f4f7'},
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        {color: isActive ? '#fff' : '#444'},
                      ]}>
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Dates */}
            <View style={styles.row}>
              <View style={{flex: 1}}>
                <Text style={styles.label}>Start Date</Text>
                <TextInput style={styles.input} placeholder="YYYY-MM-DD" />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.label}>End Date</Text>
                <TextInput style={styles.input} placeholder="YYYY-MM-DD" />
              </View>
            </View>

            {/* Budget */}
            <Text style={styles.label}>Budget</Text>
            <TextInput
              style={styles.input}
              placeholder="Estimated budget"
              keyboardType="numeric"
            />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.createBtn}
              onPress={() => {
                console.log('Selected status:', status);
                onClose();
              }}>
              <Text style={styles.createText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* -----------------------------
   Styles
------------------------------ */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxHeight: '90%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  label: {
    marginTop: 12,
    color: '#444',
    fontSize: 13,
  },
  input: {
    backgroundColor: '#f2f4f7',
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  statusChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    color: '#444',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelText: {
    color: '#777',
  },
  createBtn: {
    backgroundColor: '#6F1FFC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createText: {
    color: '#fff',
    fontWeight: '600',
  },
});
