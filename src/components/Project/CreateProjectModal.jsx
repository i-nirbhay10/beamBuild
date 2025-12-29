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
  {label: 'Planning', color: '#F59E0B'},
  {label: 'Planning Complete', color: '#10B981'},
  {label: 'In Progress', color: '#3B82F6'},
  {label: 'On Hold', color: '#F97316'},
  {label: 'Completed', color: '#6366F1'},
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
            <TextInput
              style={styles.input}
              placeholder="Enter project name"
              placeholderTextColor="#6B7280"
            />

            {/* Location */}
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter location"
              placeholderTextColor="#6B7280"
            />

            {/* Description */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, {height: 40}]}
              multiline
              placeholder="Brief project description"
              placeholderTextColor="#6B7280"
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
                      {
                        backgroundColor: isActive ? s.color : '#1F2937',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        {color: isActive ? '#fff' : '#D1D5DB'},
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
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#6B7280"
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.label}>End Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#6B7280"
                />
              </View>
            </View>

            {/* Budget */}
            <Text style={styles.label}>Budget</Text>
            <TextInput
              style={styles.input}
              placeholder="Estimated budget"
              placeholderTextColor="#6B7280"
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
   Dark Theme Styles
------------------------------ */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000AA',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 16,
    maxHeight: '90%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  label: {
    marginTop: 12,
    color: '#9CA3AF',
    fontSize: 13,
  },
  input: {
    backgroundColor: '#1F2937',
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
    color: '#F9FAFB',
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
    color: '#9CA3AF',
  },
  createBtn: {
    backgroundColor: '#6366F1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
