// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "../firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const login = () => {
    signInWithEmailAndPassword(auth, email, pass).catch(() => setError("Login gagal"));
  };

  const register = () => {
    createUserWithEmailAndPassword(auth, email, pass).catch(() => setError("Registrasi gagal"));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Sign in or create an account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={pass}
          onChangeText={setPass}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={login} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={register} activeOpacity={0.8}>
          <Text style={[styles.buttonText, { color: "#4fc3f7" }]}>Register</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>© 2025 MyApp. All rights reserved.</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#4fc3f7",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 25,
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 35,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    fontSize: 16,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#4fc3f7",
    paddingVertical: 15,
    borderRadius: 35,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#4fc3f7",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  registerButton: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#4fc3f7",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  footerText: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 12,
    marginTop: 30,
  },
});
