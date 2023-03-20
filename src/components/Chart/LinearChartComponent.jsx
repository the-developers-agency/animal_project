import React, {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

const LinearChartComponent = ({data, language}) => {
  const [labels, setLabels] = useState();
  const [avgData, setAvgData] = useState();

  const yLabelIterator = yLabel();

  function* yLabel() {
    language === 'eng'
      ? yield* ['Normal', '', '', '', 'Erratic']
      : yield* ['Tamamen normal', '', '', '', 'Son derece anormal'];
  }

  useEffect(() => {
    const groups = data.reduce((group, item) => {
      const day = item.day;
      if (!group[day]) {
        group[day] = [];
      }
      group[day].push(item);
      return group;
    }, {});

    setLabels(Object.keys(groups).map(item => item.substring(0, 3)));

    const avgValues = Object.keys(groups).reduce((avg, item) => {
      const sortedArr = groups[item].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      let total = 0;
      const filteredArr = sortedArr.slice(0, 7);
      filteredArr.forEach(dataItem => (total += dataItem.sliderValue));
      avg[item] = total / groups[item]?.length;
      return avg;
    }, {});

    setAvgData(Object.values(avgValues));
  }, []);

  return (
    <>
      {labels && avgData && (
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
          }}
          width={Dimensions.get('window').width - 16} // from react-native
          height={220}
          //   yAxisLabel="$"
          //   yAxisSuffix="k"
          formatYLabel={() => yLabelIterator.next().value}
          yAxisInterval={1} // optional, defaults to 1
          yLabelsOffset={language === 'eng' ? 10 : -50}
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
      )}
    </>
  );
};

export default LinearChartComponent;
