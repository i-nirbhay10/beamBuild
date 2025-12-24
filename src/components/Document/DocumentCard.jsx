import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import {getProjectById} from '../../data/mockData';

/* ---------- Type Colors ---------- */
const typeColors = {
  plan: '#3b82f6',
  contract: '#f59e0b',
  permit: '#10b981',
  report: '#8b5cf6',
  other: '#64748b',
};

/* ---------- Component ---------- */
export function DocumentCard({document}) {
  const project = getProjectById(document.projectId);
  const color = typeColors[document.type] || typeColors.other;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.docIcon, {backgroundColor: `${color}22`}]}>
          <Icon name="description" size={20} color={color} />
        </View>

        <View style={{flex: 1}}>
          <Text style={styles.docName} numberOfLines={1}>
            {document.name}
          </Text>
          <Text style={styles.muted}>{project?.name}</Text>

          <View style={styles.metaRow}>
            <View style={[styles.badge, {borderColor: color}]}>
              <Text style={[styles.badgeText, {color}]}>{document.type}</Text>
            </View>
            <Text style={styles.sizeText}>{document.size}</Text>
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
}

/* ---------- Small Action Button ---------- */
const ActionBtn = ({icon, label}) => (
  <Pressable style={styles.actionBtn}>
    <FAIcon name={icon} size={13} color="#334155" />
    <Text style={styles.actionText}>{label}</Text>
  </Pressable>
);

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
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
  muted: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
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
