import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, Button, DataTable, Text, RadioButton } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';

const defaultCompetences = [
  { name: 'Compréhension', coef: 1 },
  { name: 'Réalisation technique', coef: 1 },
  { name: 'Qualité des résultats', coef: 1 },
  { name: 'Autonomie', coef: 1 }
];

// Définir un thème clair personnalisé
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    background: '#ffffff', // Couleur d'arrière-plan claire
    surface: '#f8f8f8', // Surface claire pour les composants
    text: '#000000', // Couleur du texte noire
    placeholder: '#757575',
    disabled: '#f0f0f0',
  },
};

export default function CompetencesScreen({ navigation, route }) {
  const [competences, setCompetences] = useState(defaultCompetences);
  const [customCompetences, setCustomCompetences] = useState([]);
  const [useCustom, setUseCustom] = useState('default'); // "default" or "custom"
  const [competencesImported, setCompetencesImported] = useState(false);
  const students = route.params?.students || [];

  const importCustomCompetences = async () => {
    try {
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = async (event) => {
          const file = event.target.files[0];
          const fileContent = await file.text();

          Papa.parse(fileContent, {
            delimiter: ";",
            complete: (results) => {
              const importedCompetences = results.data
                .slice(1)
                .filter(row => row.length >= 2 && row[0].trim() !== '')
                .map(row => ({
                  name: row[0].trim(),
                  coef: parseFloat(row[1]) || 1
                }));

              if (importedCompetences.length > 0) {
                setCustomCompetences(importedCompetences);
                setCompetencesImported(true);
              } else {
                alert("Le fichier CSV ne contient pas de compétences valides.");
              }
            },
            error: (error) => {
              alert('Erreur lors de la lecture du fichier CSV.');
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
            delimiter: ";",
            complete: (results) => {
              const importedCompetences = results.data
                .slice(1)
                .filter(row => row.length >= 2 && row[0].trim() !== '')
                .map(row => ({
                  name: row[0].trim(),
                  coef: parseFloat(row[1]) || 1
                }));

              if (importedCompetences.length > 0) {
                setCustomCompetences(importedCompetences);
                setCompetencesImported(true);
              } else {
                alert("Le fichier CSV ne contient pas de compétences valides.");
              }
            },
            error: (error) => {
              alert('Erreur lors de la lecture du fichier CSV.');
            }
          });
        }
      }
    } catch (error) {
      alert('Erreur lors de la sélection du fichier.');
    }
  };

  const goToEvaluation = () => {
    const competencesToUse = useCustom === 'custom' && competencesImported
      ? customCompetences
      : defaultCompetences;

    if (competencesToUse.length === 0) {
      alert("Veuillez choisir des compétences avant de continuer.");
      return;
    }

    navigation.navigate('Evaluation', {
      students: students,
      competences: competencesToUse
    });
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.radioContainer}>
            <Text style={styles.info}>Sélectionnez les compétences à utiliser :</Text>
            <RadioButton.Group
              onValueChange={newValue => setUseCustom(newValue)}
              value={useCustom}
            >
              <View style={styles.radioOption}>
                <RadioButton value="default" />
                <Text style={styles.radioText}>Compétences par défaut</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="custom" />
                <Text style={styles.radioText}>Compétences personnalisées</Text>
              </View>
            </RadioButton.Group>
          </View>

          {useCustom === 'default' && (
            <View style={styles.tableContainer}>
              <Text style={styles.tableTitle}>Compétences par défaut</Text>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title style={styles.tableHeader}>Compétence</DataTable.Title>
                  <DataTable.Title numeric style={styles.tableHeader}>Coefficient</DataTable.Title>
                </DataTable.Header>

                {defaultCompetences.map((comp, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell style={styles.tableCell}>{comp.name}</DataTable.Cell>
                    <DataTable.Cell numeric style={styles.tableCell}>{comp.coef}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </View>
          )}

          {useCustom === 'custom' && (
            <View style={styles.customCompetenceContainer}>
              <Button
                mode="contained"
                onPress={importCustomCompetences}
                style={styles.button}
              >
                Importer compétences personnalisées
              </Button>

              {competencesImported && (
                <View style={styles.tableContainer}>
                  <Text style={styles.tableTitle}>Compétences importées</Text>
                  <DataTable>
                    <DataTable.Header>
                      <DataTable.Title style={styles.tableHeader}>Compétence</DataTable.Title>
                      <DataTable.Title numeric style={styles.tableHeader}>Coefficient</DataTable.Title>
                    </DataTable.Header>

                    {customCompetences.map((comp, index) => (
                      <DataTable.Row key={index}>
                        <DataTable.Cell style={styles.tableCell}>{comp.name}</DataTable.Cell>
                        <DataTable.Cell numeric style={styles.tableCell}>{comp.coef}</DataTable.Cell>
                      </DataTable.Row>
                    ))}
                  </DataTable>
                </View>
              )}
            </View>
          )}

          <Button
            mode="contained"
            onPress={goToEvaluation}
            disabled={competences.length === 0}
            style={styles.button}
          >
            Suivant
          </Button>
        </ScrollView>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Couleur d'arrière-plan claire
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  radioContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioText: {
    color: '#000000', // Couleur du texte des options radio
  },
  tableContainer: {
    flex: 1,
    marginVertical: 20,
    backgroundColor: '#f8f8f8', // Surface claire pour les tableaux
    borderRadius: 8,
    elevation: 2,
    padding: 10,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000', // Couleur du titre
  },
  tableHeader: {
    color: '#000000', // Couleur des en-têtes de tableau
  },
  tableCell: {
    color: '#000000', // Couleur des cellules
  },
  button: {
    marginVertical: 10,
  },
  info: {
    textAlign: 'center',
    marginTop: 10,
    color: '#000000', // Couleur du texte
  },
  customCompetenceContainer: {
    marginVertical: 20,
  },
});
