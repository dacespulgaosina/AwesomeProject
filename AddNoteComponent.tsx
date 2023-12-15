import {React, useState} from 'react';
import {Text, StyleSheet, SafeAreaView, Pressable, View, TextInput} from 'react-native';
import { Picker } from '@react-native-picker/picker';


interface AddNoteProps {
  hideAddNote: () => void;
}

const AddNoteComponent: React.FC<AddNoteProps> = ({hideAddNote, db}) => {

  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('');
 

// const addNote2 = () => {
//     console.log('add note2');
//     db.transaction(function (txn) {
//       txn.executeSql('INSERT INTO note (Priority, Text, Image, NotificationTime, Title, CreationTime) VALUES (:Priority, :Text, null, :selectedDate, :Title, CURRENT_TIMESTAMP)', [priority, text, selectedDate, title]);
//     });

//     hideAddNote();
// };

const saveNote = () => {
  console.log('add note2');
  
  db.transaction(function (txn) {
    txn.executeSql(
      'INSERT INTO `note` (Priority, Text, Image, NotificationTime, Title, CreationTime) VALUES (:Priority, :Text, null, CURRENT_TIMESTAMP, :Title, CURRENT_TIMESTAMP)',
      [priority, text, title],
      (_, result) => {
        // Success callback
        console.log('Query executed successfully');
        // Check result.rowsAffected to see the number of affected rows
        const rowsAffected = result.rowsAffected;
        if (rowsAffected > 0) {
          console.log('Insert successful. Rows affected:', rowsAffected);
        } else {
          console.log('Insert failed. No rows affected.');
        }
      },
      (_, error) => {
        // Error callback
        console.error('Error executing query', error);
      }
    );
  });

  hideAddNote();
};



const cancel = () => {
  console.log('cancel');
  hideAddNote();
}




  return <>
    <Text>Hello World</Text>

    <View style={styles.inputRow}>
      <Text>Title</Text><TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
      />
    </View>
    <View style={styles.inputRow}>
      <Text>Text</Text><TextInput
        style={styles.input}
        placeholder="Enter text"
        value={text}
        onChangeText={setText}
      />

    </View>

    <View style={styles.inputRow}>
        <Text>Priority</Text>
        <Picker
          selectedValue={priority}
          onValueChange={setPriority}
          style={styles.picker}
        >
          <Picker.Item label="1" value={1} />
          <Picker.Item label="2" value={2} />
          <Picker.Item label="3" value={3} />
          <Picker.Item label="no priority" value={4} />
        </Picker>
      </View>

      


    <View style={styles.inputRow}>
      <Pressable style={[styles.button, { backgroundColor: '#509EFB', width: '38%' }]} onPress={saveNote}>
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>
      <Pressable style={[styles.button, { backgroundColor: '#509EFB', width: '28%' }]} onPress={cancel}>
        <Text style={styles.buttonText}>Cancel</Text>
      </Pressable>
    </View>

  </>
    ;
}

const styles = StyleSheet.create({
    button: {
      marginBottom: 10,
      marginLeft: 0,
      height: 26,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 2,
      paddingVertical: 2,
      borderRadius: 6,
      elavation: 3,
      backroundColor: 'black',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },

    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 8,
      width: '70%',
    },

    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    container: {
      //flex: 1,
      padding: 20,
      justifyContent: 'center',
      paddingTop: Platform.OS === 'android' ? 50 : 50, // Adjust this value for Android
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 0,
      borderColor: '#A0A0A0',
      borderRadius: 8,
      paddingLeft: 8,
      paddingTop: 20
    },
    searchIcon: {
      width: 24,
      height: 24,
      marginRight: 8,
      tintColor: '#A0A0A0',
    },

    label: {
      fontSize: 16,
      marginRight: 8,
    },
    picker: {
      borderWidth: 2,
      borderColor: '#A0A0A0',
      width: 150, // Adjust the width as needed
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
    },
  });


export default AddNoteComponent;