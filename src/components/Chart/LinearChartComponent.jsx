import {Spinner} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Alert, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

import Database from '../../utils/db.js';

const LinearChartComponent = ({language}) => {
  const [labels, setLabels] = useState();
  const [avgData, setAvgData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const yLabelIterator = yLabel();

  function* yLabel() {
    yield* ['Tamamen normal', '', '', '', 'Son derece anormal'];
  }

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await Database.getWeeklyDataPoints();
        setAvgData(data[0]);
        setLabels(data[1]);
      } catch (err) {
        console.log('ERROR:: ', err);
        Alert.alert('Could not display the data', 'Please try again later');
      }
      setIsLoading(false);
    })();
  }, []);

  return (
    <>
      {!isLoading && avgData && labels ? (
        <LineChart
          data={{
            // labels: ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
            labels,
            datasets: [
              {
                data: avgData,
              },
              {
                data: [0],
                withDots: false,
              },
              {
                data: [100],
                withDots: false,
              },
            ],
            // datasets: [1, 2, 3, 4, 5, 6, 7],
          }}
          width={Dimensions.get('window').width - 16} // from react-native
          height={220}
          //   yAxisLabel="$"
          //   yAxisSuffix="k"
          formatYLabel={() => yLabelIterator.next().value}
          yAxisInterval={1} // optional, defaults to 1
          yLabelsOffset={-50}
          chartConfig={{
            backgroundColor: '#D3D3D3',
            backgroundGradientFrom: '#28231D',
            backgroundGradientTo: '#28231D',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
        />
      ) : (
        <Spinner mt="20" />
      )}
    </>
  );
};

export default LinearChartComponent;
