import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TextInput, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface EditNoteProps {
  hideEditNote: () => void;
  db: any; // Pass the SQLite instance
  noteToEdit: any; // Pass the note that needs to be edited
}

const EditNoteComponent: React.FC<EditNoteProps> = ({ hideEditNote, db, noteToEdit }) => {
  const [text, setText] = useState(noteToEdit.Text);
  const [title, setTitle] = useState(noteToEdit.Title);
  const [priority, setPriority] = useState(noteToEdit.Priority.toString());
  const [date, setDate] = useState(new Date(noteToEdit.NotificationTime));
  const [showPicker, setShowPicker] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date(noteToEdit.NotificationTime));

  useEffect(() => {
    // Update state when the noteToEdit prop changes
    setText(noteToEdit.Text);
    setTitle(noteToEdit.Title);
    setPriority(noteToEdit.Priority.toString());
    setDate(new Date(noteToEdit.NotificationTime));
    setSelectedTime(new Date(noteToEdit.NotificationTime));
  }, [noteToEdit]);

  const saveNote = () => {
    const hours = selectedTime.getHours();
    const minutes = selectedTime.getMinutes();

    // Format hours and minutes if needed
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    const formattedTime = `${formattedHours}:${formattedMinutes}`;

    const combinedDateTime = `${date.toISOString().slice(0, 10)} ${formattedTime}`;

    db.transaction((txn) => {
      txn.executeSql(
        'UPDATE `note` SET Priority = ?, Text = ?, NotificationTime = ?, Title = ? WHERE NoteID = ?',
        [priority, text, combinedDateTime, title, noteToEdit.NoteID],
        (_, result) => {
          console.log('Note updated successfully');
          hideEditNote();
        },
        (_, error) => {
          console.error('Error updating note', error);
        }
      );
    });
  };

  const cancel = () => {
    hideEditNote();
  };

  const showDatepicker = () => {
    setShowPicker(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleTimeConfirm = (time) => {
    setSelectedTime(time);
    hideTimePicker();
  };

  return (
    <>
      <Text>Edit Note</Text>

      <View style={styles.inputRow}>
        <Text>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter title"
          value={title}
          onChangeText={setTitle}
        />
      </View>
      <View style={styles.inputRow}>
        <Text>Text</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter text"
          value={text}
          onChangeText={setText}
        />
      </View>

      <View style={styles.inputRow}>
        <Text>Priority</Text>
        <Picker selectedValue={priority} onValueChange={setPriority} style={styles.picker}>
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="no priority" value="4" />
        </Picker>
      </View>

      <View style={styles.inputRow}>
        <Pressable style={[styles.button, { backgroundColor: '#509EFB', width: '38%' }]} onPress={showDatepicker}>
          <Text style={styles.buttonText}>Set due date:</Text>
        </Pressable>
        {showPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="datetime"
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>

      <View>
        <Pressable style={[styles.button, { backgroundColor: '#509EFB', width: '38%' }]} onPress={showTimePicker}>
          <Text style={styles.buttonText}>Set time:</Text>
        </Pressable>
        {selectedTime && <Text>Selected Time: {selectedTime.toLocaleTimeString()}</Text>}

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleTimeConfirm}
          onCancel={hideTimePicker}
        />
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
  );
};

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
});

export default EditNoteComponent;