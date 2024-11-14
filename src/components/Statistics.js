import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { collection, getDocs, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../connection/firebaseconfig';
import { captureRef } from 'react-native-view-shot';
import { jsPDF } from 'jspdf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const PALETA_COLORES = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
  '#E7E9ED', '#4D5360', '#70CAD1', '#3D7EAA', '#F3E59A', '#F3B59A'
];

export default function Statistics() {
  const [dataProyectos, setDataProyectos] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  
  useEffect(() => {
    // Suponiendo que setDataProyectos se llama cuando los datos están listos
    if (dataProyectos.datasets[0].data.length > 0) {
      setIsChartReady(true);
    }
  }, [dataProyectos]);

  const chartRef = useRef();

  const [isChartReady, setIsChartReady] = useState(false);

  const [coloresEtiquetas, setColoresEtiquetas] = useState({});

  const generarPDF = async () => {
    if (!isChartReady) {
      alert('El gráfico aún no está listo para ser capturado.');
      return;
    }

    try {
      const uri = await captureRef(chartRef, {
        format: 'png',  // Formato de imagen
        quality: 0.8,    // Calidad de la imagen (0.0 a 1.0, siendo 1.0 la más alta)
  
      });
      
      const doc = new jsPDF();
      doc.text("Reporte de platillos precio", 10, 10);

      const chartImage = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Si no quieres trabajar con base64, puedes convertir el archivo a binario o usar el archivo tal cual
      doc.addImage(chartImage, "PNG", 10, 20, 150, 110);
      

      dataProyectos.labels.forEach((label, index) => {
        const value = dataProyectos.datasets[0].data[index];
        doc.text(`${label}: ${value}`, 10, 140 + index * 10);
      });

      const pdfBase64 = doc.output('datauristring').split(',')[1];
      const fileUri = `${FileSystem.documentDirectory}reporte_proyectos.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64
      });

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error al generar o compartir el PDF: ", error);
    }
  };


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Dishes'), (snapshot) => {
      const conteoPlatillosPrecio = {};
      let nuevosColores = {...coloresEtiquetas};

      snapshot.forEach((doc) => {
        const datosBD = doc.data();
        const { name, price } = datosBD;

        if (name) {
          if (!conteoPlatillosPrecio[name]) {
            conteoPlatillosPrecio[name] = price;
            // Asignar color de la paleta si es necesario
            if (!nuevosColores[name]) {
              let colorIndex = Object.keys(nuevosColores).length % PALETA_COLORES.length;
              nuevosColores[name] = PALETA_COLORES[colorIndex];
            }
          } else {
            conteoPlatillosPrecio[name] += price;
          }
        }
      });

      setColoresEtiquetas(nuevosColores);

      const labels = Object.keys(conteoPlatillosPrecio);
      const dataCounts = Object.values(conteoPlatillosPrecio);

      setDataProyectos({
        labels,
        datasets: [{ data: dataCounts }],
      });
    });

    return () => unsubscribe(); // Limpiar el listener cuando el componente se desmonte
  }, []);


  return (
    <View style={styles.container}>
    <View ref={chartRef} collapsable={false} style={styles.chartContainer}>
  <PieChart
    data={dataProyectos.datasets[0].data.map((value, index) => ({
      name: dataProyectos.labels[index],
      population: value,
      color: coloresEtiquetas[dataProyectos.labels[index]], 
      legendFontColor: "#000",
      legendFontSize: 15,
    }))}
    width={300}
    height={220}
    chartConfig={{
      backgroundColor: "#fff",
      backgroundGradientFrom: "#fff",
      backgroundGradientTo: "#fff",
      decimalPlaces: 2,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16,
      },
    }}
    accessor="population"
    backgroundColor="transparent"
    paddingLeft="15"
    absolute
  />
      </View>
      <Button title="Generar y Compartir PDF" onPress={generarPDF} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  chartContainer: {
    width: 300,
    height: 220,
    backgroundColor: '#fff',
  },
});