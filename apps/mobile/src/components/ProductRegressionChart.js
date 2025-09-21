import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  Alert
} from 'react-native';
import {
  VictoryChart,
  VictoryScatter,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel
} from 'victory-native';
import { calculateRegression, calculateRelativeValue } from '@monorepo/shared-logic';
import { loadWineData } from '../utils/excelLoader';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 40;
const chartHeight = 300;

export default function ProductRegressionChart() {
  const [wineData, setWineData] = useState([]);
  const [regression, setRegression] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await loadWineData();
      setWineData(data);
      
      // Prepare data for regression: { x: price, y: score }
      const regressionData = data.map(wine => ({
        x: wine.price,
        y: wine.score
      }));
      
      const regressionResult = calculateRegression(regressionData);
      setRegression(regressionResult);
    } catch (error) {
      Alert.alert('Error', 'Failed to load wine data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading wine data...</Text>
      </View>
    );
  }

  if (!wineData.length) {
    return (
      <View style={styles.errorContainer}>
        <Text>No wine data available</Text>
      </View>
    );
  }

  const dataPoints = wineData.map(wine => ({
    x: wine.price,
    y: wine.score,
    name: wine.name,
    relativeValue: regression ? calculateRelativeValue(wine.price, wine.score, regression) : null
  }));

  // Generate regression line data points
  const regressionLineData = regression ? [
    { x: Math.min(...dataPoints.map(p => p.x)) * 0.9, y: regression.slope * (Math.min(...dataPoints.map(p => p.x)) * 0.9) + regression.intercept },
    { x: Math.max(...dataPoints.map(p => p.x)) * 1.1, y: regression.slope * (Math.max(...dataPoints.map(p => p.x)) * 1.1) + regression.intercept }
  ] : [];

  return (
    <ScrollView style={styles.container} horizontal={true}>
      <View style={styles.chartContainer}>
        {/* Chart */}
        <VictoryChart
          width={chartWidth}
          height={chartHeight}
          theme={VictoryTheme.material}
          padding={{ top: 50, bottom: 50, left: 60, right: 20 }}
          domainPadding={{ x: 20, y: [20, 20] }}
        >
          <VictoryAxis
            dependentAxis
            label="Score"
            style={{
              axisLabel: { padding: 30, fontSize: 14 },
              tickLabels: { fontSize: 10 }
            }}
          />
          <VictoryAxis
            label="Price ($)"
            style={{
              axisLabel: { padding: 40, fontSize: 14 },
              tickLabels: { fontSize: 10 }
            }}
          />

          {/* Regression Line */}
          {regression && (
            <VictoryLine
              data={regressionLineData}
              style={{
                data: { stroke: '#e74c3c', strokeWidth: 3 }
              }}
              labels={({ datum }) => `Predicted: $${datum.y.toFixed(0)}`}
            />
          )}

          {/* Data Points */}
          <VictoryScatter
            data={dataPoints}
            x="x"
            y="y"
            size={({ datum }) => {
              // Larger points for better value wines
              const relValue = datum.relativeValue?.relativeValue || 0;
              return Math.max(3, 8 + Math.abs(relValue) / 10);
            }}
            style={{
              data: ({ datum }) => {
                const relValue = datum.relativeValue?.relativeValue || 0;
                const isUndervalued = datum.relativeValue?.isUndervalued || false;
                
                return {
                  fill: relValue > 5 ? '#27ae60' : // Green for undervalued
                         relValue < -5 ? '#e74c3c' : // Red for overvalued
                         '#3498db', // Blue for average
                  stroke: isUndervalued ? '#27ae60' : '#e74c3c',
                  strokeWidth: 2
                };
              }
            }}
            labels={({ datum }) => {
              const relValue = datum.relativeValue;
              if (!relValue || Math.abs(relValue.relativeValue) < 3) return null;
              return `${datum.name}\n${relValue.relativeValue > 0 ? '+' : ''}${relValue.relativeValue.toFixed(1)}%`;
            }}
            labelComponent={
              <VictoryLabel
                style={{ fontSize: 10, fill: '#2c3e50' }}
                dy={-10}
              />
            }
          />
        </VictoryChart>

        {/* Legend and Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Regression Analysis</Text>
          
          {regression && (
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Equation:</Text>
              <Text style={styles.statsValue}>{regression.equation}</Text>
            </View>
          )}
          
          {regression && (
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>R²:</Text>
              <Text style={styles.statsValue}>{regression.rSquared.toFixed(3)}</Text>
            </View>
          )}
          
          <View style={styles.legendContainer}>
            <View style={[styles.legendItem, { backgroundColor: '#27ae60' }]} />
            <Text style={styles.legendText}>Undervalued (>5%)</Text>
            
            <View style={[styles.legendItem, { backgroundColor: '#e74c3c' }]} />
            <Text style={styles.legendText}>Overvalued (<-5%)</Text>
            
            <View style={[styles.legendItem, { backgroundColor: '#3498db' }]} />
            <Text style={styles.legendText}>Market Value</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  chartContainer: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statsContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  statsLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  statsValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  legendItem: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#7f8c8d',
    flex: 1,
    textAlign: 'center',
  },
});