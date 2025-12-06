import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';

export function CreateProjectModal({visible, onClose}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Create New Project</Text>

          <ScrollView style={{marginTop: 10}}>
            <Text style={styles.label}>Project Name</Text>
            <TextInput style={styles.input} />

            <Text style={styles.label}>Location</Text>
            <TextInput style={styles.input} />

            <Text style={styles.label}>Description</Text>
            <TextInput style={[styles.input, {height: 80}]} multiline />

            <View style={styles.row}>
              <View style={{flex: 1}}>
                <Text style={styles.label}>Start Date</Text>
                <TextInput style={styles.input} />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.label}>End Date</Text>
                <TextInput style={styles.input} />
              </View>
            </View>

            <Text style={styles.label}>Budget</Text>
            <TextInput style={styles.input} />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.createBtn} onPress={onClose}>
              <Text style={styles.createText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

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
  title: {fontSize: 18, fontWeight: '700'},
  label: {marginTop: 12, color: '#444', fontSize: 13},
  input: {
    backgroundColor: '#f2f4f7',
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  row: {flexDirection: 'row', gap: 10},
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
    gap: 12,
  },
  cancelBtn: {paddingVertical: 8, paddingHorizontal: 12},
  cancelText: {color: '#777'},
  createBtn: {
    backgroundColor: '#6F1FFC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createText: {color: '#fff', fontWeight: '600'},
});
