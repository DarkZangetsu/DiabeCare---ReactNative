import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { GlycemiaReading } from '../types';
import { getGlycemiaStatus } from '../utils/glycemiaUtils';

interface GlycemiaChartProps {
  readings: GlycemiaReading[];
  days?: number;
}

const screenWidth = Dimensions.get('window').width;

export const GlycemiaChart: React.FC<GlycemiaChartProps> = ({ readings, days = 7 }) => {
  // Get readings for the specified number of days
  const getReadingsForDays = () => {
    const today = new Date();
    const startDate = new Date(today.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
    
    // Create array of dates for the period
    const dateArray = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      dateArray.push(date);
    }
    
    // Group readings by date and calculate averages
    const dailyAverages = dateArray.map(date => {
      const dayReadings = readings.filter(reading => {
        const readingDate = new Date(reading.date);
        return readingDate.toDateString() === date.toDateString();
      });
      
      if (dayReadings.length === 0) return null;
      
      const average = dayReadings.reduce((sum, reading) => sum + reading.value, 0) / dayReadings.length;
      return {
        date,
        value: Math.round(average),
        count: dayReadings.length,
      };
    });
    
    return dailyAverages;
  };

  const dailyData = getReadingsForDays();
  const hasData = dailyData.some(day => day !== null);

  if (!hasData) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>
          Aucune donnée pour les {days} derniers jours
        </Text>
        <Text style={styles.noDataSubtext}>
          Ajoutez des mesures pour voir le graphique
        </Text>
      </View>
    );
  }

  // Prepare chart data
  const labels = dailyData.map((day, index) => {
    if (days <= 7) {
      // Show day abbreviations for week view
      const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
      const dayIndex = day ? day.date.getDay() : new Date().getDay();
      return dayNames[dayIndex];
    } else {
      // Show dates for longer periods
      return day ? `${day.date.getDate()}/${day.date.getMonth() + 1}` : '';
    }
  });

  const data = dailyData.map(day => day ? day.value : 0);
  
  // Fill gaps with interpolated values for better visualization
  const filledData = data.map((value, index) => {
    if (value === 0) {
      // Find nearest non-zero values
      let prevValue = 0;
      let nextValue = 0;
      
      for (let i = index - 1; i >= 0; i--) {
        if (data[i] !== 0) {
          prevValue = data[i];
          break;
        }
      }
      
      for (let i = index + 1; i < data.length; i++) {
        if (data[i] !== 0) {
          nextValue = data[i];
          break;
        }
      }
      
      // Use average of surrounding values or a default
      if (prevValue && nextValue) {
        return Math.round((prevValue + nextValue) / 2);
      } else if (prevValue) {
        return prevValue;
      } else if (nextValue) {
        return nextValue;
      } else {
        return 120; // Default value
      }
    }
    return value;
  });

  const chartData = {
    labels,
    datasets: [
      {
        data: filledData,
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#3b82f6',
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid lines
      stroke: '#e5e7eb',
      strokeWidth: 1,
    },
    formatYLabel: (value: string) => `${value}`,
    segments: 4, // Number of horizontal grid lines
  };

  // Calculate statistics
  const validReadings = dailyData.filter(day => day !== null);
  const averageValue = validReadings.length > 0 
    ? Math.round(validReadings.reduce((sum, day) => sum + day!.value, 0) / validReadings.length)
    : 0;
  
  const minValue = validReadings.length > 0 
    ? Math.min(...validReadings.map(day => day!.value))
    : 0;
    
  const maxValue = validReadings.length > 0 
    ? Math.max(...validReadings.map(day => day!.value))
    : 0;

  const averageStatus = getGlycemiaStatus(averageValue);

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth - 64}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withHorizontalLabels={true}
        withVerticalLabels={true}
        withDots={true}
        withShadow={false}
        withInnerLines={true}
        withOuterLines={true}
      />
      
      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{averageValue}</Text>
          <Text style={styles.statLabel}>Moyenne</Text>
          <View style={[styles.statusDot, { backgroundColor: averageStatus.color }]} />
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{minValue}</Text>
          <Text style={styles.statLabel}>Min</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{maxValue}</Text>
          <Text style={styles.statLabel}>Max</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{validReadings.length}</Text>
          <Text style={styles.statLabel}>Jours</Text>
        </View>
      </View>
      
      {/* Reference lines info */}
      <View style={styles.referenceInfo}>
        <View style={styles.referenceItem}>
          <View style={[styles.referenceDot, { backgroundColor: '#22c55e' }]} />
          <Text style={styles.referenceText}>Normal (70-140 mg/dL)</Text>
        </View>
        <View style={styles.referenceItem}>
          <View style={[styles.referenceDot, { backgroundColor: '#f59e0b' }]} />
          <Text style={styles.referenceText}>Élevé (140-200 mg/dL)</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  statItem: {
    alignItems: 'center',
    position: 'relative',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: -2,
    right: -8,
  },
  referenceInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 16,
  },
  referenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  referenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  referenceText: {
    fontSize: 11,
    color: '#6b7280',
  },
});
