/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


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
import AddDynamicNoteComponent from './AddDynamicNoteComponent';
import NoteCard from './NoteCard';
import ViewDynamicNoteComponent from './ViewDynamicNoteComponent';
import EditNoteComponent from './EditNoteComponent';
import ViewGraphsScreen from './ViewGraphsScreen';


interface Istate {
  showAddNote: number,
}

//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
import NoteListScreen from './NoteListScreen';
import ViewDynamicNotesComponent from './ViewDynamicNotesComponent';

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
      selectedNoteForEditing: null,
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
  handleEditNote = (note) => {
    console.log('Editing note:', note);
    this.setState({
      selectedNoteForEditing: note,
    });
  };


  componentDidMount() {
    // Code to run when the component is first mounted
    console.log('Component mounted!');


    const fetchDynamicNoteIDs = (): Promise<number[]> => {
      return new Promise((resolve, reject) => {
        const DynamicNoteIDs: number[] = [];
        this.db.transaction((txn) => {
          txn.executeSql('SELECT * FROM `DynamicNote`', [], (tx, res) => {
            for (let i = 0; i < res.rows.length; ++i) {
              const dynamicNoteID = res.rows.item(i).DynamicNoteID;
              DynamicNoteIDs.push(dynamicNoteID);
            }
            resolve(DynamicNoteIDs);
          });
        }, (error) => {
          reject(error);
        });
      });
    };



    //Atlasīt katrai dynamic note atbilstošo dynamic note value, kas atbilst šīs dienas datumam
    const fetchDynamicNoteValues = (MyID: number, today: Date): Promise<any[]> => {
      return new Promise((resolve, reject) => {
        console.log('A1');
        const formattedDate = today.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'
        const query = 'SELECT * FROM `DynamicNoteValue` WHERE DynamicNoteID = ? AND MyDate >= ? AND MyDate < ?';

        const params = [MyID, formattedDate, new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]];

        console.log('Full Query:', query.replace(/\?/g, (match) => JSON.stringify(params.shift())));


        const DynamicNoteValues: any[] = [];
        this.db.transaction((txn) => {
          console.log('AA2');
          const MyTimestamp = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          console.log('MyTimeStamp: ', MyTimestamp);
          txn.executeSql(query, [MyID, formattedDate, new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]], (tx, res) => {
            for (let i = 0; i < res.rows.length; ++i) {
              console.log('AA3');
              const dynamicNoteValue = res.rows.item(i);
              DynamicNoteValues.push(dynamicNoteValue);
            }
            resolve(DynamicNoteValues);
          });
        }, (error) => {
          reject(error);
        });
      });
    };

    fetchDynamicNoteIDs()
    .then((DynamicNoteIDs) => {
      console.log('DynamicNoteIDs:', DynamicNoteIDs);
      // Do something with DynamicNoteIDs

      for (let i = 0; i < DynamicNoteIDs.length; i++) {
        // console.log('YYY ID:', DynamicNoteIDs[i]);
        // Do something with each ID
      // Call the function and handle the result
      const today = new Date(); // Current date and time
      fetchDynamicNoteValues(DynamicNoteIDs[i], today)
        .then((DynamicNoteValues) => {
          console.log('XXXXDynamicNoteValues:', DynamicNoteValues);

          // Do something with DynamicNoteValues
          if (DynamicNoteValues.length === 0) {
            console.log('Inserting new DynamicNoteValue');
            this.db.transaction(function (txn) {
              txn.executeSql('INSERT INTO DynamicNoteValue (DynamicNoteID, InputParameter, MyDate) VALUES (:DynamicNoteId, null, CURRENT_TIMESTAMP)', [DynamicNoteIDs[i]]);

            });
          }
        })
        .catch((error) => {
          console.error('Error fetching DynamicNoteValues:', error);
        });


      }
    })
    .catch((error) => {
      console.error('Error fetching DynamicNoteIDs:', error);
    });


  
    //Ja tāda neeksistē(lietotājs aplikāciju atver pirmo reizi diennaktī), tad dynamic note value ierakstu iespraužam datubāzes dynamicNoteValue datubāzes tabulā
    //Ar skaitlisko vērtību nedefinētu null(visi tekošās dienas ieraksti, vēlāk rādīsies atbildot uz pogu 'View alerts')

  }



  handleSearchTermChange = (text) => {
    this.setInputValue(text);
  };

  handleSearch = () => {
    const searchTerm = this.state.inputValue.trim();
    if (searchTerm) {
      this.db.transaction((txn) => {
        const query = 'SELECT * FROM note WHERE Title LIKE ? OR Text LIKE ?';
      const params = [`%${searchTerm}%`, `%${searchTerm}%`];

        txn.executeSql(query, params, (tx, res) => {
          const fetchedNotes = [];
          for (let i = 0; i < res.rows.length; ++i) {
            fetchedNotes.push(res.rows.item(i));
          }
          this.setNotes(fetchedNotes);
        });
      });
    }
  };



  setSelectedValue = (value) => {
    this.setState({ selectedValue: value });
  }
  setInputValue = (value) => {
    this.setState({ inputValue: value });
  }

  setNotes = (value) => {
    this.setState({ notes: value });
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
    this.setState({ showAddNote: 1 });
  };

  addDynamicNote = () => {
    console.log('add dynamic note');
    this.setState({ showAddNote: 2 });
  }

  viewDynamicNotes = () => {
    this.db.transaction(function (txn) {
      txn.executeSql('SELECT * FROM `DynamicNoteValue`', [], function (tx, res) {
        for (let i = 0; i < res.rows.length; ++i) {
          console.log('ADynamicNoteValue:', res.rows.item(i))
        }
      })
    });
    this.setState({ showAddNote: 3 });
  };

  viewGraphs = () => {
    // Add the logic for handling the "View Graphs" button press
    console.log('View Graphs button pressed');
    // Add any other actions or navigation logic here
    this.setState({ showAddNote: 4 });
  };

  dropTables = () => {
    //var SQLite = require('react-native-sqlite-storage');

    console.log('Drop tables');
    //const db = SQLite.openDatabase('test.db', '1.0', '', 1)
    this.db.transaction(function (txn) {
      txn.executeSql('DROP TABLE IF EXISTS Users', []);
      txn.executeSql('DROP TABLE IF EXISTS Note', []);
      txn.executeSql('DROP TABLE IF EXISTS DynamicNote', []);
      txn.executeSql('DROP TABLE IF EXISTS DynamicNoteValue', []);
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

    const query2 = `CREATE TABLE IF NOT EXISTS DynamicNote (
  DynamicNoteID INTEGER PRIMARY KEY,
  Text VARCHAR(300),
  NotificationTime DATETIME,
  Title VARCHAR(50),
  CreationTime DATETIME
);`;

    const query3 = `CREATE TABLE IF NOT EXISTS DynamicNoteValue (
  DynamicNoteID INTEGER,
  InputParameter DECIMAL,
  MyDate DATETIME,
  FOREIGN KEY (DynamicNoteID) REFERENCES DynamicNote(DynamicNoteID)
);`;

    //const db = SQLite.openDatabase('test.db', '1.0', '', 1)
    this.db.transaction(function (txn) {
      txn.executeSql(query, []);
      txn.executeSql(query2, []);
      txn.executeSql(query3, []);
      txn.executeSql('INSERT INTO note (Priority, Text, Image, NotificationTime, Title, CreationTime) VALUES (:Priority, :Text, :Image, CURRENT_TIMESTAMP, :Title, CURRENT_TIMESTAMP)', [1, 'Sample Text 1', 'image1.jpg', 'Sample Title Z']);
      txn.executeSql('INSERT INTO note (Priority, Text, Image, NotificationTime, Title, CreationTime) VALUES (:Priority, :Text, :Image, CURRENT_TIMESTAMP, :Title, CURRENT_TIMESTAMP)', [2, 'Sample Text 2', 'image2.jpg', 'Sample Title A']);
    });
  };

  addNote2 = () => {
    //  var SQLite = require('react-native-sqlite-storage');

    console.log('Add Note2');
    this.setState({ showAddNote: 0 });
  };
  createTables2 = () => {


    console.log('Create Table2');
  };
  dropTables2 = () => {
    console.log('Drop tables2');

  };

  handleDeleteNote = (note) => {
    // Implement the logic to delete the note from the database
    console.log('Deleting note:', note);
  
    // Assuming `db` is your SQLite database object
    this.db.transaction((txn) => {
      txn.executeSql('DELETE FROM note WHERE NoteID = ?', [note.NoteID], (tx, res) => {
        console.log('Note deleted successfully');
        // After deletion, you may want to refresh the notes list or take other actions
        // For example:
        this.refreshNotes();
      });
    });
  };
  
  // Add a function to refresh the notes list after deletion
  refreshNotes = () => {
    // You can fetch the updated notes from the database and update the state
    // For example:
    this.db.transaction((txn) => {
      txn.executeSql('SELECT * FROM note', [], (tx, res) => {
        const fetchedNotes = [];
        for (let i = 0; i < res.rows.length; ++i) {
          fetchedNotes.push(res.rows.item(i));
        }
        this.setNotes(fetchedNotes);
      });
    });
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
      orderBy = ' ORDER BY `Priority` desc';
    }
    else if (itemValue == 'title') {
      orderBy = ' ORDER BY `Title`';
    }
    else if (itemValue == 'dueDate') {
      orderBy = ' ORDER BY `NotificationTime` desc';
    }
    else if (itemValue == 'newest') {
      orderBy = ' ORDER BY `CreationTime` desc';
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
      handleSearchTermChange: this.handleSearchTermChange,
      handleSearch: this.handleSearch,
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
        {this.state.selectedNoteForEditing ? (
          <EditNoteComponent
            hideEditNote={() => this.setState({ selectedNoteForEditing: null })}
            db={this.db}
            noteToEdit={this.state.selectedNoteForEditing}
          />
        ) : (

          (this.state.showAddNote == 0) ? (
            <View style={styles.container}>
              <View style={styles.searchContainer}>

                <TextInput
                  style={styles.input}
                  placeholder="Search..."
                  placeholderTextColor="#A0A0A0"
                  underlineColorAndroid="transparent"
                  onChangeText={this.handleSearchTermChange}
                />
                <TouchableOpacity onPress={this.handleSearch}>
                  <Image
                    source={require('./search-icon.png')}
                    style={styles.searchIcon}
                  />
                </TouchableOpacity>
              </View>



              <View style={styles.container}>
                <View style={styles.inputRow}>
                  <Pressable style={[styles.button, { backgroundColor: '#509EFB', width: '38%' }]} onPress={this.addNote}>
                    <Text style={styles.buttonText}>Add Note</Text>
                  </Pressable>
                  {/* <Pressable style={[styles.button, { backgroundColor: '#509EFB', width: '28%' }]} onPress={this.dropTables}>
                    <Text style={styles.buttonText}>Drop</Text>
                  </Pressable>
                  <Pressable style={[styles.button, { backgroundColor: '#509EFB', width: '28%' }]} onPress={this.createTables}>
                    <Text style={styles.buttonText}>Create DB</Text>
                  </Pressable> */}
                </View>
              </View>

              <View style={styles.container}>
                <View style={styles.inputRow}>
                    <Pressable style={[styles.button, { backgroundColor: '#509EFB', width: '40%' }]} onPress={this.addDynamicNote}>
                      <Text style={styles.buttonText}>Add Dynamic Note</Text>
                    </Pressable>
                    <Pressable style={[styles.button, { backgroundColor: '#509EFB', width: '28%' }]} onPress={this.viewDynamicNotes}>
                      <Text style={styles.buttonText}>View Alerts</Text>
                    </Pressable>
                    <Pressable style={[styles.button, { backgroundColor: '#509EFB', width: '28%' }]} onPress={this.viewGraphs}>
                      <Text style={styles.buttonText}>View Graphs</Text>
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
                  <NoteCard key={note.NoteID}
                    note={note}
                    onEditPress={this.handleEditNote}
                    onDeletePress={this.handleDeleteNote}
                    onDismissNote={null}/>
                ))}
              </ScrollView>
            </View>

          ) : (
            <>
              {this.state.showAddNote == 1 ? (
                <AddNoteComponent hideAddNote={this.addNote2} db={this.db} />
              ) : (
                <>
                  {this.state.showAddNote == 2 ? (
                    <AddDynamicNoteComponent hideAddNote={this.addNote2} db={this.db} />
                  ) : (
                    <>
                    {this.state.showAddNote == 3 ? (
                    <ViewDynamicNotesComponent hideAddNote={this.addNote2} db={this.db} />
                     ) : (
                      <ViewGraphsScreen hideAddNote={this.addNote2} db={this.db} />
                  )}
                </>
              )}
            </>
              )}
            </>  
          )
        )}
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