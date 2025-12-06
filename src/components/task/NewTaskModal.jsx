import React, {useCallback, useRef, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {projects, users} from '../../data/mockData';

export default function NewTaskBottomSheet({isVisible, onClose}) {
  const bottomSheetRef = useRef(null);
  const mountedRef = useRef(false);

  // Snap points for bottom sheet
  const snapPoints = useMemo(() => ['50%', '80%'], []);

  // Track if mounted to prevent auto-close on initial render
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Handle BottomSheet index changes
  const handleSheetChanges = useCallback(
    index => {
      if (index === -1 && mountedRef.current) {
        onClose();
      }
    },
    [onClose],
  );

  if (!isVisible) return null;

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose>
        <BottomSheetView style={styles.sheetContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sheetTitle}>Create New Task</Text>

            <TextInput placeholder="Task Title" style={styles.input} />

            <TextInput
              placeholder="Description"
              style={[styles.input, {height: 100}]}
              multiline
            />

            <Text style={styles.label}>Project</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.selectorScroll}>
              {projects.map(p => (
                <TouchableOpacity key={p.id} style={styles.selectBtn}>
                  <Text style={styles.selectBtnText}>{p.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Assign To</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.selectorScroll}>
              {users.map(u => (
                <TouchableOpacity key={u.id} style={styles.selectBtn}>
                  <Text style={styles.selectBtnText}>{u.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.addBtn, {flex: 1, marginRight: 8}]}
                onPress={onClose}>
                <Text style={styles.addBtnText}>Create</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.addBtn, {flex: 1, backgroundColor: '#aaa'}]}
                onPress={onClose}>
                <Text style={styles.addBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    ...StyleSheet.absoluteFillObject, // fills the entire screen
    zIndex: 10,
  },
  sheetContent: {
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 14,
    color: '#333',
  },
  selectorScroll: {
    marginBottom: 16,
  },
  selectBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f2f2f2',
  },
  selectBtnText: {
    fontSize: 14,
    color: '#222',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 12,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#0b74ff',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
