import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, ImageBackground } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    if (!email) return 'El email es requerido';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Formato de email inválido';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'La contraseña es requerida';
    return '';
  };

  const validateLoginForm = () => {
    return validateEmail(email) === '' && validatePassword(password) === '';
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Home');
    } catch (error) {
      setError('Error al iniciar sesión: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/cuadricula.png")}
      style={styles.background}
      resizeMode="repeat"
    >
      <View style={styles.container}>
        <Text h3 style={styles.title}>Mi Comida Favorita</Text>

        <Image
          source={require('../../assets/Univalle.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Input
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError(validateEmail(text));
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          errorMessage={emailError}
        />
        <Input
          placeholder="Contraseña"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError(validatePassword(text));
          }}
          secureTextEntry
          errorMessage={passwordError}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {isLoading ? (
          <ActivityIndicator size="large" color="#800000" />
        ) : (
          <>
            <Button
              title="Iniciar Sesión"
              onPress={handleLogin}
              containerStyle={styles.button}
              buttonStyle={styles.primaryButton}
              disabled={!validateLoginForm() || isLoading}
            />
            <Button
              title="Registrarse"
              onPress={() => navigation.navigate('Register')}
              containerStyle={styles.button}
              buttonStyle={styles.plomoButton}
              titleStyle={{ color: '#ffffff' }}
              disabled={isLoading}
            />
            <Text style={styles.footerText}>Elaborado por: Carlos E. Mamani</Text>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#800000',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
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
  footerText: {
    fontSize: 14,
    textAlign: "center",
    color: '#800000',
    marginTop: 40,
  },
});
