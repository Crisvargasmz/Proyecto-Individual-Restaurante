import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Button, ScrollView } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { collection, onSnapshot } from 'firebase/firestore';
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
  const [dataCategorias, setDataCategorias] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  const pieChartRef = useRef();
  const barChartRef = useRef();
  const [isChartReady, setIsChartReady] = useState(false);
  const [coloresEtiquetas, setColoresEtiquetas] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Dishes'), (snapshot) => {
      const conteoPlatillosPrecio = {};
      const conteoCategorias = {};
      let nuevosColores = {...coloresEtiquetas};

      snapshot.forEach((doc) => {
        const datosBD = doc.data();
        const { name, price, category, quantity } = datosBD;

        // Para el gráfico de precios
        if (name) {
          conteoPlatillosPrecio[name] = (conteoPlatillosPrecio[name] || 0) + price;
          if (!nuevosColores[name]) {
            let colorIndex = Object.keys(nuevosColores).length % PALETA_COLORES.length;
            nuevosColores[name] = PALETA_COLORES[colorIndex];
          }
        }

        // Para el gráfico de categorías
        if (category) {
          conteoCategorias[category] = (conteoCategorias[category] || 0) + quantity;
        }
      });

      setColoresEtiquetas(nuevosColores);
      setDataProyectos({
        labels: Object.keys(conteoPlatillosPrecio),
        datasets: [{ data: Object.values(conteoPlatillosPrecio) }],
      });
      setDataCategorias({
        labels: Object.keys(conteoCategorias),
        datasets: [{ data: Object.values(conteoCategorias) }],
      });

      // Asegurarse de que los datos están completamente cargados antes de permitir la captura
      if (snapshot.size > 0) { // Asegúrate de que hay datos antes de marcar como listo
        setIsChartReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // Además, puedes agregar un efecto para resetear isChartReady cuando los componentes se desmonten o antes de una nueva carga de datos
  useEffect(() => {
    return () => {
      setIsChartReady(false); // Resetear cuando el componente se desmonte
    };
  }, []);

  const generarPDFPieChart = async () => {
    if (!isChartReady) {
      alert('El gráfico de pastel aún no está listo para ser capturado.');
      return;
    }

    try {
      const uri = await captureRef(pieChartRef, {
        format: 'png',
        quality: 0.8,
      });

      const doc = new jsPDF();
      doc.text("Reporte de Platillos por Precio", 10, 10);
      const chartImage = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      doc.addImage(chartImage, "PNG", 10, 20, 180, 100);

      // Agregar datos debajo del gráfico
      let yPos = 130;
      dataProyectos.labels.forEach((label, index) => {
        doc.text(`${label}: ${dataProyectos.datasets[0].data[index]}`, 10, yPos);
        yPos += 10;
      });

      const pdfBase64 = doc.output('datauristring').split(',')[1];
      const fileUri = `${FileSystem.documentDirectory}reporte_pie_chart.pdf`;
      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, { encoding: FileSystem.EncodingType.Base64 });
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error al generar o compartir el PDF del gráfico de pastel: ", error);
    }
  };

  const generarPDFBarChart = async () => {
    if (!isChartReady) {
      alert('El gráfico de barras aún no está listo para ser capturado.');
      return;
    }

    try {
      const uri = await captureRef(barChartRef, {
        format: 'png',
        quality: 0.8,
      });

      const doc = new jsPDF();
      doc.text("Reporte de Categorías de Platillos", 10, 10);
      const chartImage = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      doc.addImage(chartImage, "PNG", 10, 20, 180, 100);

      // Agregar datos debajo del gráfico
      let yPos = 130;
      dataCategorias.labels.forEach((label, index) => {
        doc.text(`${label}: ${dataCategorias.datasets[0].data[index]}`, 10, yPos);
        yPos += 10;
      });

      const pdfBase64 = doc.output('datauristring').split(',')[1];
      const fileUri = `${FileSystem.documentDirectory}reporte_bar_chart.pdf`;
      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, { encoding: FileSystem.EncodingType.Base64 });
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error al generar o compartir el PDF del gráfico de barras: ", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.chartContainer2}>
        <View ref={pieChartRef} collapsable={false}>
          <PieChart
            data={dataProyectos.labels.map((label, index) => ({
              name: label,
              population: dataProyectos.datasets[0].data[index],
              color: coloresEtiquetas[label],
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
        <Button title="Generar y Compartir PDF del Gráfico de Pastel" onPress={generarPDFPieChart} />
      </View>
      <View style={styles.chartContainer}>
        <View ref={barChartRef} collapsable={false}>
          <BarChart
            data={dataCategorias}
            width={300}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            fromZero
          />
        </View>
        <Button title="Generar y Compartir PDF del Gráfico de Barras" onPress={generarPDFBarChart} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginBottom: 100,
  },
  chartContainer2: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 100,
  },
});