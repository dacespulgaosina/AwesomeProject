/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {Picker} from '@react-native-picker/picker';
import {
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

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedValue, setSelectedValue] = useState('newest');
   const [data, setData] = useState({ key: 'value' });
  const [inputValue, setInputValue] = useState('');

  //const filePath = RNFS.DocumentDirectoryPath + '/data.json';

   const filePath = 'data.json';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
 
  const addNote = () => {
console.log('Add Note')
}

const RoundedOrangeButton = () => {
  return (
    <TouchableOpacity style={styles.buttonContainer}>
      <Text style={styles.buttonText}>Create Note</Text>
    </TouchableOpacity>
  );
};

 useEffect(() => {
    // Load data from the file when the component mounts
    readDataFromFile();
  }, []);
/**
  const readDataFromFile = async () => {
    try {
      const fileContent = await RNFS.readFile(filePath);
      const jsonData = JSON.parse(fileContent);
      setData(jsonData);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };
**/

const readDataFromFile = async () => {
  try {
    const fileExists = await RNFS.exists(filePath);

    if (fileExists) {
     // const fileContent = await RNFS.readFile(filePath);
      const fileContent = await RNFS.readFileAssets(filePath);
      const jsonData = JSON.parse(fileContent);
      setData(jsonData);
    } else {
      console.warn('File does not exist:', filePath);
      // You might choose to handle this case differently based on your requirements
    }
  } catch (error) {
    console.error('Error reading file:', error);
  }
};

  const writeDataToFile = async () => {
    try {
      const jsonString = JSON.stringify({ ...data, newKey: inputValue });
      await RNFS.writeFile(filePath, jsonString, 'utf8');
      readDataFromFile(); // Reload data after writing to update the state
    } catch (error) {
      console.error('Error writing file:', error);
    }
  };


  return (
    <SafeAreaView style={backgroundStyle}>
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
      <Text style={styles.label}>Sort by:</Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => setSelectedValue(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Newest First" value="newest" />
        <Picker.Item label="Priority" value="priority" />
        <Picker.Item label="Due Date" value="dueDate" />
        <Picker.Item label="Title" value="title" />
      </Picker>
      <Pressable style={[styles.button, { backgroundColor: '#509EFB', width: '38%'}]} onPress={addNote}>
      <Text style={styles.buttonText}>Add Note</Text>
      </Pressable>
    </View>
    <View>
      <TextInput
        placeholder="Enter a value"
        value={inputValue}
        onChangeText={(text) => setInputValue(text)}
      />
      <Button title="Save to File" onPress={writeDataToFile} />
    </View>
    </View>
    </SafeAreaView>
  );
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
  container: {
    flex: 1,
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
  },
});

export default App;
