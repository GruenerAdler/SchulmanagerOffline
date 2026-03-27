import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SettingsMenu = ({ visible, onClose }) => {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    const handleLoginSave = async () => {
    try {
        await SecureStore.setItemAsync("user_email", email);
        await SecureStore.setItemAsync("user_pass", pass);
        setEmail("");
        setPass("");
        Alert.alert("Login Daten gespeichert!", "Deine Login Daten wurde erfolgreich sicher gespeichert.");
    } catch (e) {
        console.log("Save error:", e);
    }
    };

    if (!visible) return;
  return (
    <View style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.8)",
      justifyContent: "center",
      alignItems: "center"
    }}>

      {/* BACKDROP (nur dieser reagiert auf Klicks) */}
      <Pressable
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        onPress={onClose}
      />

      {/* CONTENT */}
      <View style={{
        width: "90%",
        height: "60%",
        backgroundColor: "#222",
        padding: 20,
        borderRadius: 10,
        zIndex: 2
      }}>
        
        <View style={styles.HeaderContainer}>
  
            <Text style={styles.Header}>
                Einstellungen
            </Text>

            <TouchableOpacity onPress={onClose}>
                <Ionicons name="close-outline" size={30} color="red" />
            </TouchableOpacity>

        </View>

        <Text style={styles.SubHeader}>
          Login
        </Text>

        <Text style={styles.LoginEmail}>E-Mail oder Benutzername</Text>
        <TextInput
            style={styles.LoginEmailInput}
            value={email}
            onChangeText={setEmail}
        />

        <Text style={styles.LoginPass} >Passwort:</Text>
        <TextInput
            style={styles.LoginPassInput}
            value={pass}
            secureT
            onChangeText={setPass}
        />

        <TouchableOpacity
            style={styles.LoginButton}
            onPress={handleLoginSave}
        >
            <Text style={styles.LoginButtonText}>
                Login Daten speichern
            </Text>
        </TouchableOpacity>


      </View>

    </View>
  );
};

export default SettingsMenu;

const styles = StyleSheet.create({
    HeaderContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },
    Header: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold"
    },
    SubHeader: {
        color: "white",
        fontSize: 20,
        marginTop: 10,
    },
    LoginEmail: {
        color: "white",
        fonzSize: 15,
        marginTop: 5,
    },
    LoginEmailInput: {
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 15,
        color: "white",
        marginTop: 5,
    },
    LoginPass: {
        color: "white",
        fonzSize: 15,
        marginTop: 5,
    },
    LoginPassInput: {
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 15,
        color: "white",
        marginTop: 5,
    },
    LoginButton: {
        backgroundColor: "#2f608b",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        height: 35,
        paddingHorizontal: 15,
        marginTop: 10,
    },
    LoginButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600"
    }
})