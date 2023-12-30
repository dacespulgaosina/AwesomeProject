// ViewGraphsScreen.tsx

import { LineChart } from 'react-native-chart-kit';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface ViewGraphsScreenProps {
  hideAddNote: () => void;
}

interface DynamicNote {
  DynamicNoteID: number;
  Title: string;
}


function convertIsoToDateShort(isoDate) {
  const dateObject = new Date(isoDate);
  
  // Define months in short format
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Get month and day
  const month = months[dateObject.getMonth()];
  const day = dateObject.getDate();

  // Create short date string
  const shortDateString = `${month} ${day}`;

  return shortDateString;
}


const ViewGraphsScreen: React.FC<ViewDynamicNotesProps> = ({hideAddNote, db}) => {

  //const [dynamicNotes, setDynamicNotes] = useState([{"DynamicNoteID": 1, "Title": "Dynamic 1"}, {"DynamicNoteID": 2, "Title": "Dynamic 2 "}, {"DynamicNoteID": 3, "Title": "Dynamic 3 "}, {"DynamicNoteID": 4, "Title": "Dynamic 3 4 "}]);
  const [dynamicNotes, setDynamicNotes] = useState([]);
  const [selectedValue, setSelectedValue] = useState(0);

  useEffect(() => {
    console.log('Component loaded');

    getDynamicNoteIdTitlePairs()
    .then(data => {
      console.log('In useEffect: ', data);
      setDynamicNotes(data);
      // You can now use the data as needed, e.g., pass it to your component state
    })
    .catch(error => console.error('Error fetching data:', error));

    //setSelectedValue(dynamicNotes[0].DynamicNoteID)
    // Add any other initialization logic here
  }, []);

 
  const handlePickerChange = (itemValue: string) => {
    console.log('Selected Value:', itemValue);
    setSelectedValue(itemValue);
  }

 const getDynamicNoteIdTitlePairs = (): Promise<DynamicNote[]> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        const query = 'SELECT DynamicNoteID, Title FROM DynamicNote';
        tx.executeSql(query, [], (_, result) => {
          const rows: ResultSetRowList = result.rows;
          const pairs: DynamicNote[] = [{"DynamicNoteID": -1, "Title": "Select Dynamic Note"}];

          for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            pairs.push({ DynamicNoteID: row.DynamicNoteID, Title: row.Title });
          }

          resolve(pairs);
        }, error => {
          reject(error);
        });
      });
    });
  }

  // const data = {
  //   labels: ['Dec 30', 'Dec 31', 'Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5'],
  //   datasets: [
  //     {
  //       data: [33, 34.5, 20.9, null, 18.3, 29, 22.1],
  //     },
  //   ],
  // };

  const data = [
    { date: '2023-12-30', value: 33 },
    { date: '2023-12-31', value: 34.5 },
    // Gap in data on January 1, 2023
    // Omit the data point for January 1, 2023
    //{ date: '2023-01-01', value: null },
    { date: '2023-01-02', value: 20.9 },
    { date: '2023-01-03', value: 18.3 },
    { date: '2023-01-04', value: 29 },
    { date: '2023-01-05', value: 22.1 },
  ];

  const mydates = data.map((item) => convertIsoToDateShort(item.date));
  const myvalues = data.map((item) => item.value);

  const mydata = {
      labels: mydates,
      datasets: [
        {
          data: myvalues,
        },
      ],
    };

  const cancel = () => {
    
    // getDynamicNoteIdTitlePairs()
    // .then(data => {
    //   console.log(data);
    //   // You can now use the data as needed, e.g., pass it to your component state
    // })
    // .catch(error => console.error('Error fetching data:', error));

    console.log('cancel');
    hideAddNote();

  }



  return (
<View style={styles.container}>
<Text style={styles.chartTitle}>Line Chart Example</Text>
<View style={styles.inputRow}>
      <Pressable style={[styles.button, { backgroundColor: '#509EFB', width: '28%' }]} onPress={cancel}>
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </View>
<View style={styles.inputRow}>



<>
    {dynamicNotes.length > 0 ? (
      <>
      <Picker
        selectedValue='1'
        onValueChange={handlePickerChange}
         style={styles.picker}
      > 
        {dynamicNotes.map(note => (
          
          <Picker.Item
            key={note.DynamicNoteID}
            label={note.Title}
            value={note.DynamicNoteID}
          />
        ))}
      </Picker>
       {/* <Text>Dynamic notes available {dynamicNotes.length}</Text> */}
       </>
    ) : (
      <Text>No dynamic notes available</Text>
      // You can provide a different message or UI for when the array is empty
    )}
  </>


</View>

<LineChart
  data={mydata}
  width={350}
  height={200}
  yAxisLabel=""
  chartConfig={{
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  }}
  bezier
  style={styles.chart}
/>
</View>

    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
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
    width: '90%', // Adjust the width as needed
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
  },
});

export default ViewGraphsScreen;