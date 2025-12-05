import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { addDoc, serverTimestamp, query, orderBy, onSnapshot } from './firebase';
import { messagesCollection } from './firebase';

type MessageType = {
  id: string;
  text: string;
  user: string;
  imageBase64?: string; // Tambah field untuk Base64
  createdAt: any;
};

export default function ChatScreen({ route }: any) {
  const { name } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // Fungsi pilih gambar
  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5, // Kurangi kualitas untuk ukuran lebih kecil
      maxWidth: 800,
      maxHeight: 800,
      includeBase64: true, // Ini yang penting!
    });

    if (result.assets && result.assets[0]) {
      setImageBase64(result.assets[0].base64 || null);
    }
  };

  // Fungsi kirim pesan
  const sendMessage = async () => {
    if (!message.trim() && !imageBase64) return;

    await addDoc(messagesCollection, {
      text: message,
      user: name,
      imageBase64: imageBase64, // Simpan Base64 di Firestore
      createdAt: serverTimestamp(),
    });

    setMessage('');
    setImageBase64(null);
  };

  // Render item chat
  const renderItem = ({ item }: { item: MessageType }) => (
    <View style={[
      styles.msgBox,
      item.user === name ? styles.myMsg : styles.otherMsg
    ]}>
      <Text style={styles.sender}>{item.user}</Text>
      {item.imageBase64 && (
        <Image 
          source={{ uri: `data:image/jpeg;base64,${item.imageBase64}` }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
      {item.text ? <Text>{item.text}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      
      {/* Preview gambar sebelum dikirim */}
      {imageBase64 && (
        <View style={styles.imagePreview}>
          <Image 
            source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
            style={styles.previewImage}
          />
          <Button title="Hapus Gambar" onPress={() => setImageBase64(null)} />
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
          <Text>📷</Text>
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Ketik pesan..."
          value={message}
          onChangeText={setMessage}
        />
        
        <Button title="Kirim" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  msgBox: {
    padding: 10,
    margin: 5,
    borderRadius: 8,
    maxWidth: '80%',
  },
  myMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  otherMsg: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginVertical: 5,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  imagePreview: {
    padding: 10,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#CCC',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 10,
  },
  uploadButton: {
    padding: 10,
    backgroundColor: '#EEE',
    borderRadius: 20,
  },
});