import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import Slider from "../components/Slider";

const SettingsMenu = ({ visible, onClose, currentSettings, setSettings, theme }) => {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const [loginSaved, setLoginSaved] = useState(false);

    const handleClose = () => {
        AsyncStorage.setItem("Settings", JSON.stringify(currentSettings));
        onClose();
    };


    const onSettingChange = (key, value) => {
        setSettings(prev => {
            const updated = {
                ...prev,
                [key]: value,
            };
            return updated;
        });
    };

    const handleLoginSave = async () => {
        try {
            await SecureStore.setItemAsync("user_email", email);
            await SecureStore.setItemAsync("user_pass", pass);
            setEmail("");
            setPass("");

            setLoginSaved(true);
            await delay(2000);
            setLoginSaved(false);
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

      {/* BACKGROUND */}
      <Pressable
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        onPress={handleClose}
      />

      {/* CONTENT */}
      <View style={{
        width: "90%",
        height: "60%",
        backgroundColor: theme === "dark" ? "#222" : "#fff",
        padding: 20,
        borderRadius: 10,
        zIndex: 2
      }}>
        
        <View style={styles.TitleContainer}>
  
            <Text style={[styles.Title, theme === "light" && styles.darkFont]}>
                Einstellungen
            </Text>

            <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close-outline" size={30} color="red" />
            </TouchableOpacity>

        </View>

        {/*Basics*/}
        <Text style={[styles.Header, theme === "light" && styles.darkFont]}>
          Allgemein
        </Text>

        <Text style={[styles.SubHeader, theme === "light" && styles.darkFont]}>
          Thema
        </Text>

        <Slider
            value={currentSettings.theme}
            onChange={(value) => onSettingChange("theme", value)}
            theme={theme}
            options={[
                {
                value: "light",
                icon: (active) => (
                    <Ionicons name="sunny" size={18} color={active ? "#fafe00" : theme === "dark" ? "#9CA3AF" : "#fff"} />
                ),
                },
                {
                value: "dark",
                icon: (active) => (
                    <Ionicons name="moon" size={18} color={active ? "#b0a3e1" : theme === "dark" ? "#9CA3AF" : "#fff"} />
                ),
                },
                {
                value: "system",
                icon: (active) => (
                    <Ionicons name="settings" size={18} color={active ? "#ffffff" : theme === "dark" ? "#9CA3AF" : "#fff"} />
                ),
                },
            ]}
        />

        {/*Login*/}
        <Text style={[styles.Header, theme === "light" && styles.darkFont]}>
          Login
        </Text>

        <Text style={[styles.SubHeader, theme === "light" && styles.darkFont]}>E-Mail oder Benutzername</Text>
        <TextInput
            style={[styles.LoginInput, theme === "light" && styles.darkFont]}
            value={email}
            onChangeText={setEmail}
            autoCapitalize='none'
            autoComplete='email'
        />

        <Text style={[styles.SubHeader, theme === "light" && styles.darkFont]} >Passwort:</Text>
        <TextInput
            style={[styles.LoginInput, theme === "light" && styles.darkFont]}
            value={pass}
            secureTextEntry
            onChangeText={setPass}
            autoCapitalize='none'
            autoComplete='password'
        />

        <TouchableOpacity
            style={[styles.LoginButton, loginSaved && {backgroundColor : 'green'}]}
            onPress={handleLoginSave}
            activeOpacity={0.5}
        >
            <Text style={styles.LoginButtonText}>
                {loginSaved ? "Login Daten gespeichert!" : "Login Daten speichern"}
            </Text>
        </TouchableOpacity>


      </View>

    </View>
  );
};

export default SettingsMenu;

const styles = StyleSheet.create({
    darkFont: {
        color: "black",
        borderColor: "black",
    },
    TitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },
    Title: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold"
    },

    Header: {
        color: "white",
        fontSize: 20,
        marginTop: 10,
    },
    SubHeader: {
        color: "white",
        fontSize: 15,
        marginTop: 5,
    },

    LoginInput: {
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