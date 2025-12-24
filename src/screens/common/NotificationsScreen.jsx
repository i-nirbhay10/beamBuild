import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {notifications} from '../../data/mockData';

const iconMap = {
  task: 'check-square',
  project: 'folder',
  team: 'users',
  deadline: 'clock',
  message: 'message-circle',
};

const colorMap = {
  task: '#3b82f6', // blue
  project: '#2563eb', // darker blue
  team: '#10b981', // green
  deadline: '#f59e0b', // amber
  message: '#8b5cf6', // purple
};

export default function NotificationsScreen() {
  const [selectedTab, setSelectedTab] = useState('all');

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const renderNotification = notification => {
    const iconName = iconMap[notification.type] || 'bell';
    const iconColor = colorMap[notification.type] || '#000';

    return (
      <View
        key={notification.id}
        style={[
          styles.card,
          !notification.read && {borderColor: '#3b82f6', borderWidth: 1},
        ]}>
        <View style={styles.cardContent}>
          <View
            style={[styles.iconContainer, {backgroundColor: `${iconColor}33`}]}>
            <Icon name={iconName} size={20} color={iconColor} />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{notification.title}</Text>
              {!notification.read && (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>New</Text>
                </View>
              )}
            </View>
            <Text style={styles.message}>{notification.message}</Text>
            <Text style={styles.timestamp}>
              {new Date(notification.timestamp).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const getNotificationsByTab = () => {
    if (selectedTab === 'all') return notifications;
    if (selectedTab === 'unread') return unreadNotifications;
    return readNotifications;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Text style={styles.headerSubtitle}>Stay updated on your projects</Text>
      </View>

      {/* Header actions */}
      <View style={styles.headerActions}>
        <View style={styles.unreadBadge}>
          <Icon name="bell" size={16} color="#3b82f6" />
          <Text style={styles.unreadText}>
            {unreadNotifications.length} unread
          </Text>
        </View>
        <TouchableOpacity style={styles.markAllButton}>
          <Icon name="check-circle" size={16} color="#fff" />
          <Text style={styles.markAllText}>Mark All Read</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['all', 'unread', 'read'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}>
            <Text
              style={
                selectedTab === tab ? styles.tabTextActive : styles.tabText
              }>
              {tab === 'unread'
                ? `Unread (${unreadNotifications.length})`
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications list */}
      <ScrollView style={styles.notificationsList}>
        {getNotificationsByTab().map(renderNotification)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 5, backgroundColor: '#f3f4f6'},
  header: {marginBottom: 12},
  headerTitle: {fontSize: 24, fontWeight: 'bold', color: '#111827'},
  headerSubtitle: {fontSize: 14, color: '#6b7280', marginTop: 2},
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  unreadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    padding: 6,
    borderRadius: 8,
  },
  unreadText: {marginLeft: 4, color: '#3b82f6', fontWeight: '500'},
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    padding: 6,
    borderRadius: 8,
  },
  markAllText: {color: '#fff', marginLeft: 4, fontWeight: '500'},
  tabs: {flexDirection: 'row', marginBottom: 12},
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {borderBottomColor: '#3b82f6'},
  tabText: {color: '#6b7280'},
  tabTextActive: {color: '#3b82f6', fontWeight: '600'},
  notificationsList: {flex: 1},
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
  },
  cardContent: {flexDirection: 'row'},
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {flex: 1},
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {fontSize: 16, fontWeight: '600', color: '#111827'},
  newBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {color: '#fff', fontSize: 10},
  message: {color: '#6b7280', fontSize: 14, marginBottom: 2},
  timestamp: {fontSize: 12, color: '#9ca3af'},
});
