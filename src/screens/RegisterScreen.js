import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(password);
  };

  const validateForm = () => {
    if (!email) return 'El email es requerido';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Formato de email inválido';
    if (!password) return 'La contraseña es requerida';
    if (!validatePassword(password))
      return 'Debe tener 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial';
    if (password !== confirmPassword) return 'Las contraseñas no coinciden';
    return '';
  };

  const handleRegister = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.replace('Home');
    } catch (error) {
      setError('Error al registrarse: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/cuadricula.png')}
      style={styles.background}
      resizeMode="repeat"
    >
      <View style={styles.container}>
        <Text h3 style={styles.title}>Registro de Usuario</Text>

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Input
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {isLoading ? (
          <ActivityIndicator size="large" color="#800000" />
        ) : (
          <>
            <Button
              title="Registrarse"
              onPress={handleRegister}
              containerStyle={styles.button}
              buttonStyle={styles.primaryButton}
              disabled={isLoading}
            />
            <Button
              title="Volver al Login"
              onPress={() => navigation.navigate('Login')}
              containerStyle={styles.button}
              buttonStyle={styles.plomoButton}
              titleStyle={{ color: '#ffffff' }}
              disabled={isLoading}
            />
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#800000',
  },
  button: {
    marginVertical: 10,
  },
  primaryButton: {
    backgroundColor: '#800000',
  },
  plomoButton: {
    backgroundColor: '#A9A9A9',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
