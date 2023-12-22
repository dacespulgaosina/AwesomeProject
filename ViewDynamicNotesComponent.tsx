import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';

interface ViewDynamicNotesProps {
  hideAddNote: () => void;
}

const ViewDynamicNotesComponent: React.FC<ViewDynamicNotesProps> = ({hideAddNote, db}) => {
    const [dynamicNotes, setDynamicNotes] = useState([]);

    useEffect(() => {
        // Fetch data from the DynamicNote table when the component mounts
        fetchData();
      }, []);
      
      const cancel = () => {
        console.log('cancel');
        hideAddNote();
      }


      const fetchData = () => {
        db.transaction((txn) => {
          txn.executeSql('SELECT * FROM DynamicNote', [], (tx, res) => {
            const fetchedDynamicNotes = [];
            for (let i = 0; i < res.rows.length; ++i) {
              fetchedDynamicNotes.push(res.rows.item(i));
            }
            setDynamicNotes(fetchedDynamicNotes);
    
            // Log the fetched dynamic notes to the console
            console.log('Fetched Dynamic Notes:', fetchedDynamicNotes);
          });
        });
      };




  return (
    <View>
      <Text>This is the ViewDynamicNotesComponent</Text>
      {/* Render the dynamic notes using FlatList or other components */}
      <FlatList
        data={dynamicNotes}
        keyExtractor={(item) => item.DynamicNoteID.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>Title: {item.Title}</Text>
            <Text>Text: {item.Text}</Text>
            {/* Add more fields as needed */}
          </View>
        )}
      />

<View style={styles.inputRow}>
      <Pressable style={[styles.button, { backgroundColor: '#509EFB', width: '28%' }]} onPress={cancel}>
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </View>
    </View>
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



export default ViewDynamicNotesComponent;