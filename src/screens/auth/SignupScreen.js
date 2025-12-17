import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {signup} from './services/auth.api';

const SignupScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    await signup({name, company, email, password});
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Company Account</Text>
      <Text style={styles.subtitle}>Owner / Contractor Only</Text>

      <TextInput
        placeholder="Your Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Company Name"
        placeholderTextColor="#999"
        value={company}
        onChangeText={setCompany}
        style={styles.input}
      />

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

      <TouchableOpacity style={styles.primaryBtn} onPress={handleSignup}>
        <Text style={styles.primaryText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backLink}>← Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#020617',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#1e293b',
    color: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 14,
  },
  primaryBtn: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  primaryText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  backLink: {
    color: '#38bdf8',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
  },
});
