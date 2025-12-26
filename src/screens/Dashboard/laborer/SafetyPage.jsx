import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/Feather';
import Header from '../../../components/layout/Header';
import {useAuth} from '../../../context/AuthContext';

const safetyProtocols = [
  {
    id: 'ppe',
    title: 'Personal Protective Equipment (PPE)',
    content: [
      'Hard hat must be worn at all times on site',
      'Safety glasses required in all work areas',
      'Steel-toed boots are mandatory',
      'High-visibility vest when working near vehicles',
      'Gloves appropriate for the task at hand',
      'Hearing protection in high-noise areas',
    ],
  },
  {
    id: 'fall',
    title: 'Fall Protection',
    content: [
      'Use guardrails on elevated platforms',
      'Safety harness required above 6 feet',
      'Secure ladders before climbing',
      'Never lean ladders against unstable surfaces',
      'Report damaged fall protection equipment immediately',
    ],
  },
  {
    id: 'electrical',
    title: 'Electrical Safety',
    content: [
      'Only qualified personnel work with electrical systems',
      'De-energize equipment before maintenance',
      'Use lockout/tagout procedures',
      'Keep electrical panels accessible',
      'Report frayed cords or damaged equipment',
    ],
  },
  {
    id: 'equipment',
    title: 'Equipment Operation',
    content: [
      'Only certified operators may use heavy machinery',
      'Perform daily equipment inspections',
      'Never exceed equipment load limits',
      'Maintain 3-point contact when climbing',
      'Use spotters when backing up',
    ],
  },
];

const emergencyContacts = [
  {name: 'Site Supervisor', phone: '(555) 123-4567', available: 'On-site'},
  {name: 'Safety Officer', phone: '(555) 234-5678', available: '24/7'},
  {name: 'Emergency Services', phone: '911', available: '24/7'},
  {
    name: 'Company Safety Line',
    phone: '(555) 345-6789',
    available: 'Business Hours',
  },
];

export default function SafetyPage() {
  const {user} = useAuth();
  const [activeProtocol, setActiveProtocol] = useState(null);

  const toggleProtocol = id => {
    setActiveProtocol(activeProtocol === id ? null : id);
  };

  return (
    <View style={styles.screen}>
      <Header
        title="Safety Information"
        subtitle="Safety protocols and emergency contacts"
      />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Safety Alert */}
        <View
          style={[
            styles.card,
            {backgroundColor: '#fff4e5', borderColor: '#f59e0b'},
          ]}>
          <View style={styles.cardContent}>
            <Icon
              name="alert-triangle"
              size={20}
              color="#f59e0b"
              style={{marginRight: 8}}
            />
            <View style={{flex: 1}}>
              <Text style={{fontWeight: '700', fontSize: 16}}>
                Daily Safety Reminder
              </Text>
              <Text style={{marginTop: 4, color: '#4b5563'}}>
                Always inspect your work area before starting. Report any
                hazards to your supervisor immediately. Your safety is our top
                priority.
              </Text>
            </View>
          </View>
        </View>

        {/* Safety Protocols */}
        <View style={[styles.card, {marginTop: 16}]}>
          <View style={styles.cardHeader}>
            <Icon
              name="shield"
              size={20}
              color="#10b981"
              style={{marginRight: 6}}
            />
            <Text style={{fontWeight: '700', fontSize: 16}}>
              Safety Protocols
            </Text>
          </View>

          {safetyProtocols.map(protocol => (
            <View key={protocol.id}>
              <TouchableOpacity
                onPress={() => toggleProtocol(protocol.id)}
                style={styles.accordionTitle}>
                <Icon
                  name="tool"
                  size={16}
                  color="#3b82f6"
                  style={{marginRight: 6}}
                />
                <Text style={styles.accordionText}>{protocol.title}</Text>
                <Icon
                  name={
                    activeProtocol === protocol.id
                      ? 'chevron-up'
                      : 'chevron-down'
                  }
                  size={16}
                  color="#6b7280"
                  style={{marginLeft: 'auto'}}
                />
              </TouchableOpacity>
              <Collapsible collapsed={activeProtocol !== protocol.id}>
                <View style={styles.accordionBody}>
                  {protocol.content.map((line, i) => (
                    <View key={i} style={styles.accordionItem}>
                      <Icon
                        name="check-circle"
                        size={16}
                        color="#10b981"
                        style={{marginRight: 6}}
                      />
                      <Text style={{color: '#6b7280'}}>{line}</Text>
                    </View>
                  ))}
                </View>
              </Collapsible>
            </View>
          ))}
        </View>

        {/* Emergency Contacts */}
        <View style={[styles.card, {marginTop: 16}]}>
          <View style={styles.cardHeader}>
            <Icon
              name="phone"
              size={20}
              color="#ef4444"
              style={{marginRight: 6}}
            />
            <Text style={{fontWeight: '700', fontSize: 16}}>
              Emergency Contacts
            </Text>
          </View>
          {emergencyContacts.map((contact, i) => (
            <View key={i} style={styles.contactCard}>
              <View style={styles.contactHeader}>
                <Text style={{fontWeight: '600'}}>{contact.name}</Text>
                <View style={styles.badge}>
                  <Text style={{fontSize: 12}}>{contact.available}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${contact.phone}`)}>
                <Text style={{color: '#3b82f6', marginTop: 2}}>
                  {contact.phone}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#f1f5f9'},
  container: {padding: 16, paddingBottom: 32},

  card: {borderWidth: 1, borderRadius: 12, padding: 8, borderColor: '#e5e7eb'},
  cardContent: {flexDirection: 'row', alignItems: 'flex-start'},
  cardHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},

  accordionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  accordionText: {fontWeight: '600', color: '#111827'},
  accordionBody: {paddingLeft: 24, paddingVertical: 8},
  accordionItem: {flexDirection: 'row', alignItems: 'center', marginBottom: 4},

  contactCard: {
    marginVertical: 6,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#d1d5db',
    borderRadius: 12,
  },
});
