import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { Button, DataTable, Text } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';

export default function InitialScreen({ navigation }) {
  const [students, setStudents] = useState([]);

  const pickCSV = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv';
      input.onchange = async (event) => {
        const file = event.target.files[0];
        const fileContent = await file.text();

        Papa.parse(fileContent, {
          complete: (results) => {
            const studentList = results.data
              .slice(1) // Ignore header row
              .filter(row => row.length > 0 && row[0] && row[0].trim() !== '')
              .map(row => ({
                name: row[0].trim() // Only take the first column
              }));

            setStudents(studentList);
          },
          error: (error) => {
            alert('Erreur lors de la lecture du fichier CSV');
          }
        });
      };
      input.click();
    } else {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv'
      });

      if (result.assets && result.assets[0]) {
        const fileUri = result.assets[0].uri;
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        
        Papa.parse(fileContent, {
          complete: (results) => {
            const studentList = results.data
              .slice(1) // Ignore header row
              .filter(row => row.length > 0 && row[0] && row[0].trim() !== '')
              .map(row => ({
                name: row[0].trim() // Only take the first column
              }));

            setStudents(studentList);
          },
          error: (error) => {
            alert('Erreur lors de la lecture du fichier CSV');
          }
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Button 
          mode="contained" 
          onPress={pickCSV}
          style={styles.button}
        >
          Importer CSV des élèves
        </Button>

        <View style={styles.tableContainer}>
          <ScrollView>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Nom</DataTable.Title>
              </DataTable.Header>

              {students.map((student, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell style={{ color: 'black' }}>{student.name}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </ScrollView>
        </View>

        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Competences', { students })}
          disabled={!students || students.length === 0}
          style={styles.button}
        >
          Suivant
        </Button>

        <Text style={styles.info}>
          {students.length > 0 
            ? `${students.length} élève(s) importé(s)` 
            : 'Aucun élève importé'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  tableContainer: {
    flex: 1,
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    maxHeight: 500,
  },
  button: {
    marginVertical: 10,
  },
  info: {
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
});
