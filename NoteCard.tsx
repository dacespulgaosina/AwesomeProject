import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const NoteCard = ({ note, onEditPress, onDismissNote, onDeletePress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.Title}</Text>
      <Text style={styles.text}>{note.Text}</Text>
      <Text style={styles.dueDate}>Due Date: {note.NotificationTime}</Text>
      <View style={styles.inputRow}>
      {onEditPress && (
        <TouchableOpacity onPress={() => onEditPress(note)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      )} 
      {onDeletePress && (
        <TouchableOpacity onPress={() => onDeletePress(note)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      )}
      </View>
        {!onEditPress && (
        <TouchableOpacity onPress={() => onDismissNote(note)}>
          {/* <Text style={styles.editButton}>Dismiss</Text> */}
        </TouchableOpacity>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  deleteButton: {
    color: 'red',
    marginTop: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  dueDate: {
    fontSize: 14,
    color: '#888',
  },
  editButton: {
    color: 'blue',
    marginTop: 8,
  },
});

export default NoteCard;
