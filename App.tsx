/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

//EKRĀNS NESKRULLĒJAS LĪDZ APAKŠAI



import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  AppRegistry,
  Button,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,

} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import RNFS from 'react-native-fs';

import SQLite from 'react-native-sqlite-2';

import AddNoteComponent from './AddNoteComponent';
import NoteCard from './NoteCard';

interface Istate {
  showAddNote: number,
}

//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
import NoteListScreen from './NoteListScreen';

//const Stack = createStackNavigator();

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    showAddNote: 0,
    isDarkMode: false,
    selectedValue: '',
    inputValue: '',
    notes: [],
    backgroundStyle: {
         backgroundColor: false ? Colors.darker : Colors.lighter,
      },
    
    };

    var SQLite = require('react-native-sqlite-storage');

    this.db = SQLite.openDatabase(
      { name: 'test.db', createFromLocation: 1 },
      this.dbOpenSuccess,
      this.dbOpenError
    );
  
   
}
setSelectedValue = (value) => {
  this.setState({selectedValue: value});
}
setInputValue = (value) => {
  this.setState({inputValue: value});
}

setNotes = (value) => {
  this.setState({notes: value});
}
  
componentWillUnmount() {
  // Close the database connection when the component is about to unmount
  // this.db.close();
}
  dbOpenSuccess = () => {
    console.log('Database opened successfully');
    // Perform any additional setup or actions after the database is opened
  };

  // Callback when there's an error opening the database
  dbOpenError = (error) => {
    console.error('Error opening database:', error);
  };

   addNote = () => {
   // var SQLite = require('react-native-sqlite-storage');

    console.log('Add Note');
    
    //const db = SQLite.openDatabase('test.db', '1.0', '', 1)
    this.db.transaction(function (txn) {
      txn.executeSql('DROP TABLE IF EXISTS Users', [])
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS Users(user_id INTEGER PRIMARY KEY NOT NULL, name VARCHAR(30))',
        []
      )
      txn.executeSql('INSERT INTO Users (name) VALUES (:name)', ['nora'])
      txn.executeSql('INSERT INTO Users (name) VALUES (:name)', ['takuya'])
     
      txn.executeSql('SELECT * FROM `note`', [], function (tx, res) {
        for (let i = 0; i < res.rows.length; ++i) {
          console.log('note:', res.rows.item(i))
        }
      })
      //this.props.navigation.navigate('NoteList');
    });
    this.setState({showAddNote: 1});
  };

   dropTables = () => {
    //var SQLite = require('react-native-sqlite-storage');

    console.log('Drop tables');
    //const db = SQLite.openDatabase('test.db', '1.0', '', 1)
    this.db.transaction(function (txn) {
      txn.executeSql('DROP TABLE IF EXISTS Users', []);
      txn.executeSql('DROP TABLE IF EXISTS Note', []);
    });
  };

   createTables = () => {
    //var SQLite = require('react-native-sqlite-storage');

    console.log('Create tables');
    const query = `CREATE TABLE IF NOT EXISTS note (
    NoteID INTEGER PRIMARY KEY,
    Priority INTEGER,
    Text VARCHAR(300),
    Image VARCHAR(50),
    NotificationTime DATETIME,
    Title VARCHAR(50),
    CreationTime DATETIME
);`;

    //const db = SQLite.openDatabase('test.db', '1.0', '', 1)
    this.db.transaction(function (txn) {
      txn.executeSql(query, []);
      txn.executeSql('INSERT INTO note (Priority, Text, Image, NotificationTime, Title, CreationTime) VALUES (:Priority, :Text, :Image, CURRENT_TIMESTAMP, :Title, CURRENT_TIMESTAMP)', [1, 'Sample Text 1', 'image1.jpg', 'Sample Title Z']);
      txn.executeSql('INSERT INTO note (Priority, Text, Image, NotificationTime, Title, CreationTime) VALUES (:Priority, :Text, :Image, CURRENT_TIMESTAMP, :Title, CURRENT_TIMESTAMP)', [2, 'Sample Text 2', 'image2.jpg', 'Sample Title A']);
    });
  };

   addNote2 = () => {
    //  var SQLite = require('react-native-sqlite-storage');

    console.log('Add Note2');
    this.setState({showAddNote: 0});
  };
   createTables2 = () => {


    console.log('Create Table2');
  };
   dropTables2 = () => {
    console.log('Drop tables2');
   
  };
   

   handlePickerChange = (itemValue: string) => {
    // Do something with the selected value
    console.log('Selected Value:', itemValue);
    //const db = SQLite.openDatabase('test.db', '1.0', '', 1, (db) => {
    //   console.log('Database opened successfully');
    // }, (error) => {
    //   console.error('Error opening database:', error);
    // });

    var orderBy = ''; 
    if (itemValue == "priority") {
      orderBy = ' ORDER BY `Priority`';
    }
    else if (itemValue == 'title') {
      orderBy = ' ORDER BY `Title`';
    }
    else if (itemValue == 'dueDate') {
      orderBy = ' ORDER BY `NotificationTime`';
    }
    else if (itemValue == 'newest') {
      orderBy = ' ORDER BY `CreationTime`';
    }

    this.db.transaction((txn) => {
      txn.executeSql('SELECT * FROM note' + orderBy, [], (tx, res) => {
        const fetchedNotes = [];
        for (let i = 0; i < res.rows.length; ++i) {
          fetchedNotes.push(res.rows.item(i));
        }
        this.setNotes(fetchedNotes);
      });
    });


    // Update the state to reflect the selected value

    this.state.selectedValue = itemValue;
    this.setSelectedValue(this.state.itemValue);
    if (itemValue == "priority") {
      console.log('priority sort');

      this.db.transaction(function (txn) {
        txn.executeSql('SELECT * FROM `note` ORDER BY `Priority`', [], function (tx, res) {
          for (let i = 0; i < res.rows.length; ++i) {
            console.log('note:', res.rows.item(i))
          }
        })
      });
    }
    else if (itemValue == 'title') {
      console.log('title sort');
      
      this.db.transaction(function (txn) {
        txn.executeSql('SELECT * FROM `note` ORDER BY `Title`', [], function (tx, res) {
          for (let i = 0; i < res.rows.length; ++i) {
            console.log('note:', res.rows.item(i))
          }
        })
      }, function (error) {
        console.error('Error executing query:', error);
      });
    }

    else if (itemValue == 'dueDate') {
      console.log('due sort');
     
      this.db.transaction(function (txn) {
        txn.executeSql('SELECT * FROM `note` ORDER BY `NotificationTime`', [], function (tx, res) {
          for (let i = 0; i < res.rows.length; ++i) {
            console.log('note:', res.rows.item(i))
          }
        })
      }, function (error) {
        console.error('Error executing query:', error);
      });
    }
  //nezinu vai šis strādā
    else if (itemValue == 'newest') {
      console.log('newest sort');
      this.db.transaction(function (txn) {
        txn.executeSql('SELECT * FROM `note` ORDER BY `CreationTime`', [], function (tx, res) {
          for (let i = 0; i < res.rows.length; ++i) {
            console.log('note:', res.rows.item(i))
          }
        })
      }, function (error) {
        console.error('Error executing query:', error);
      });
    };

  };

render() {
const handlerProps = {
  ...this.state,
  handlePickerChange: this.handlePickerChange,
}
  return (
    <SafeAreaView style={this.state.backgroundStyle}>
      {/*
      <NavigationContainer>
      <Stack.Navigator initialRouteName="MyComponent">
        <Stack.Screen name="MyComponent" component={MyComponent} />
        <Stack.Screen name="NoteList" component={NoteListScreen} />
      </Stack.Navigator>
  */}

  {(this.state.showAddNote == 0) ? (
      <View style={styles.container}>
        <View style={styles.searchContainer}>

          <TextInput
            style={styles.input}
            placeholder="Search..."
            placeholderTextColor="#A0A0A0"
            underlineColorAndroid="transparent"
          />
          <Image
            source={require('./search-icon.png')} // Replace with the actual path to your search icon
            style={styles.searchIcon}
          />
        </View>
        
        <View style={styles.container}>
          <View style={styles.inputRow}>
            <Pressable style={[styles.button, { backgroundColor: '#509EFB', width: '38%' }]} onPress={this.addNote}>
              <Text style={styles.buttonText}>Add Note</Text>
            </Pressable>
            <Pressable style={[styles.button, { backgroundColor: '#509EFB', width: '28%' }]} onPress={this.dropTables}>
              <Text style={styles.buttonText}>Drop</Text>
            </Pressable>
            <Pressable style={[styles.button, { backgroundColor: '#509EFB', width: '28%' }]} onPress={this.createTables}>
              <Text style={styles.buttonText}>Create DB</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.inputRow}>
            <Pressable style={[styles.button, { backgroundColor: '#509EFB', width: '48%' }]} onPress={this.addNote}>
              <Text style={styles.buttonText}>Add Dynacmic Note</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.label}>Sort by:</Text>
          <Picker
            selectedValue={this.state.selectedValue}
            onValueChange={this.handlePickerChange}
            style={styles.picker}
          >
             <Picker.Item label="Select" value="" />
            <Picker.Item label="Priority" value="priority" />
            <Picker.Item label="Newest First" value="newest" />
            <Picker.Item label="Due Date" value="dueDate" />
            <Picker.Item label="Title" value="title" />
          </Picker>
        </View>
        </View>
        <ScrollView>
          <Text>My notes</Text>
      {this.state.notes.map((note) => (
        <NoteCard key={note.NoteID} note={note} />
      ))}
    </ScrollView>
      </View>
  ) : (<AddNoteComponent hideAddNote = {this.addNote2} db={this.db}/>)
}
    </SafeAreaView>
  );
}
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    //flex: 1,
    padding: 5,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? 20 : 50, // Adjust this value for Android
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
  input: {
    fontSize: 18,
    flex: 1,
    height: 40,
    color: '#000',
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

export default MyComponent;
AppRegistry.registerComponent('App', () => MyComponent);
