import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { Provider as PaperProvider } from 'react-native-paper';
import { Accelerometer, Gyroscope } from 'react-native-sensors';

const App = () => {
  const [temperature, setTemperature] = useState(null);
  const [unit, setUnit] = useState('C');
  const [backgroundColor, setBackgroundColor] = useState('#fff');


  useEffect(() => {
    const sensor = new Gyroscope({
      updateInterval: 1000,
    });
    const subscription = sensor.subscribe(({ x, y, z }) => {
      const temp = (x + y + z) / 3;
      setTemperature(Math.round(temp * 100) / 100);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUnitChange = () => {
    if (unit === 'C') {
      setUnit('F');
    } else {
      setUnit('C');
    }
  };

  useEffect(() => {
    const widgetBackgroundColor = backgroundColor === '#fff' ? null : backgroundColor;
    const updateWidgetBackgroundColor = async () => {
      try {
        await Widget.setHasContent(true);
        await Widget.setBackgroundStyle({ backgroundColor: widgetBackgroundColor });
      } catch (error) {
        console.error('Failed to update widget background color', error);
      }
    };
    updateWidgetBackgroundColor();
  }, [backgroundColor]);

  return (
      <PaperProvider>
        <View style={[styles.container, { backgroundColor }]}>
          <Text style={[styles.temperatureText, { color:'#fff' }]}>
            {temperature != null ? `${temperature}°${unit}` : 'Loading...'}
          </Text>
          <Text style={[styles.unitText, { color: '#fff' }]} onPress={handleUnitChange}>
            {unit}
          </Text>
        </View>
      </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperatureText: {
    fontSize: 50,
  },
  unitText: {
    fontSize: 20,
    marginTop: 5,
  },
});

export default App;