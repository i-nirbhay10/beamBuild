import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {login} from './services/auth.api';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const res = await login({email, password});

    const role = res.user?.teams?.[0]?.role;

    if (role === 'project_manager') {
      navigation.replace('ContractorDashboard');
    } else if (role === 'supervisor') {
      navigation.replace('MainDrawer');
    } else if (role === 'engineer') {
      navigation.replace('EngineerDashboard');
    } else {
      navigation.replace('LaborerDashboard');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>BuildTrack</Text>
      <Text style={styles.subtitle}>Construction Management</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
        <Text style={styles.primaryText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Owner / Company?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0f172a',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#1e293b',
    color: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  primaryText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#94a3b8',
  },
  link: {
    color: '#38bdf8',
    marginTop: 4,
    fontWeight: '600',
  },
});
