import {collection, getDocs, query, where} from 'firebase/firestore';
import moment from 'moment';
import {Spinner} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Alert, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {db} from '../../utils/firebase';
import firestore from '@react-native-firebase/firestore';

const LinearChartComponent = ({language}) => {
  const [labels, setLabels] = useState();
  const [avgData, setAvgData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const yLabelIterator = yLabel();

  function* yLabel() {
    yield* ['Tamamen normal', '', '', '', 'Son derece anormal'];
  }

  // useEffect(() => {
  //   const groups = data.reduce((group, item) => {
  //     const day = item.day;
  //     if (!group[day]) {
  //       group[day] = [];
  //     }
  //     group[day].push(item);
  //     return group;
  //   }, {});

  //   setLabels(Object.keys(groups).map(item => item.substring(0, 3)));

  //   const avgValues = Object.keys(groups).reduce((avg, item) => {
  //     const sortedArr = groups[item].sort(
  //       (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  //     );
  //     let total = 0;
  //     const filteredArr = sortedArr.slice(0, 7);
  //     filteredArr.forEach(dataItem => (total += dataItem.sliderValue));
  //     avg[item] = total / groups[item]?.length;
  //     return avg;
  //   }, {});

  //   setAvgData(Object.values(avgValues));
  // }, []);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const recordsCollection = firestore().collection('Records');
        const past7DaysArray = [];
        for (let i = 0; i < 7; i++) {
          past7DaysArray.push(moment().subtract(i, 'd').format('YYYY-MM-DD'));
        }
        const querySnapshot = await recordsCollection
          .where(firestore.FieldPath.documentId(), 'in', past7DaysArray)
          .get();
        const datapoints = [];
        querySnapshot.forEach(item => {
          datapoints.push(item.data().value / item.data().count);
        });
        // console.log('groups:: ', groups);
        setLabels(
          past7DaysArray.map(item =>
            moment(item).format('dddd').substring(0, 3),
          ),
        );
        setAvgData(datapoints);
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
