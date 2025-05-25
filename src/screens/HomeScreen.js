import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Alert, ImageBackground, ScrollView,} from "react-native";
import { Input, Button, Text } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { auth, db, storage } from "../config/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function HomeScreen({ navigation }) {
  const [profile, setProfile] = useState({
    nombre: "",
    apellido: "",
    comidaFavorita: "",
    photoURL: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const docRef = doc(db, "usuarios", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      Alert.alert("Error al cargar perfil");
    }
  };

const uploadImage = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `profiles/${auth.currentUser.uid}`);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    await updateDoc(doc(db, 'usuarios', auth.currentUser.uid), { photoURL: url });
    setProfile((prev) => ({ ...prev, photoURL: url }));
    Alert.alert('Foto actualizada con éxito');
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    Alert.alert('Error subiendo la imagen');
  }
};

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso necesario", "Se requieren permisos para acceder a la galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
    await uploadImage(result.uri);
    }
  };

    const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permiso necesario', 'Se requieren permisos para acceder a la cámara');
        return;
    }

    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
    });

    if (!result.canceled) {
        await uploadImage(result.uri);
    }
    };

  const handleUpdate = async () => {
    try {
      await setDoc(doc(db, "usuarios", auth.currentUser.uid), profile);
      Alert.alert("Perfil actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      Alert.alert("Error al actualizar perfil");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error al cerrar sesión");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/cuadricula.png")}
      style={styles.background}
      resizeMode="repeat"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text h4 style={styles.title}>
          USUARIO: <Text style={{ color: "black" }}>{profile.nombre} {profile.apellido}</Text>
        </Text>

        <View style={styles.imageContainer}>
          {profile.photoURL ? (
            <Image source={{ uri: profile.photoURL }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.imagePlaceholder]}>
              <Text style={{ color: "#666" }}>Sin foto</Text>
            </View>
          )}
          <Button
            title="Elegir desde galería"
            onPress={pickImage}
            containerStyle={styles.button}
            buttonStyle={styles.primaryButton}
          />
          <Button
            title="Tomar foto"
            onPress={takePhoto}
            containerStyle={styles.button}
            buttonStyle={styles.primaryButton}
          />
        </View>

        <Input
          label="Nombre"
          labelStyle={{ fontWeight: "bold", fontSize: 18, color: "#800000" }}
          placeholder="Registra tu nombre"
          value={profile.nombre}
          onChangeText={(text) => setProfile({ ...profile, nombre: text })}
        />
        <Input
          label="Apellido"
          labelStyle={{ fontWeight: "bold", fontSize: 18, color: "#800000" }}
          placeholder="Registra tu apellido"
          value={profile.apellido}
          onChangeText={(text) => setProfile({ ...profile, apellido: text })}
        />
        <Input
          label="Comida Favorita"
          labelStyle={{ fontWeight: "bold", fontSize: 18, color: "#800000" }}
          placeholder="Registra tu comida favorita"
          value={profile.comidaFavorita}
          onChangeText={(text) => setProfile({ ...profile, comidaFavorita: text })}
        />
        <Button
          title="Actualizar Perfil"
          onPress={handleUpdate}
          containerStyle={styles.button}
          buttonStyle={styles.primaryButton}
        />
        <Button
          title="Cerrar Sesión"
          onPress={handleSignOut}
          containerStyle={styles.button}
          buttonStyle={{ backgroundColor: "#A9A9A9" }}
          titleStyle={{ color: "#ffffff" }}
        />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    padding: 20,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
    color: "#800000",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  imagePlaceholder: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginVertical: 5,
  },
  primaryButton: {
    backgroundColor: "#800000",
  },
});
