import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

const getPast7DayUsers = async () => {
  const recordsCollection = firestore().collection('Users');
  const querySnapshot = await recordsCollection
    .where('updatedAt', '>=', moment().subtract(7, 'days').toDate())
    .get();
  return querySnapshot.size;
};

const updateData = async (inputVal) => {
  const recordsCollection = firestore().collection('Records');
  const usersCollection = firestore().collection('Users');

  const today = moment().format('YYYY-MM-DD');

  const recordDoc = await recordsCollection.doc(today).get();
  const recordObj = {
    value: 0,
    count: 0,
  };
  if (recordDoc.exists) {
    const {value, count} = recordDoc.data();
    recordObj.count = count;
    recordObj.value = value;
  }
  recordObj.value += inputVal || 0;
  recordObj.count += 1;
  recordObj.updateAt = new Date();
  const prom1 = recordsCollection.doc(today).set(recordObj);
  // update user doc with updatedAt
  const user = await AsyncStorage.getItem('user');
  const userId = JSON.parse(user).id;
  const prom2 = usersCollection.doc(userId).update({updatedAt: new Date()});

  await Promise.all([prom1, prom2]);
};

const getWeeklyDataPoints = async () => {
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
    const {value, count} = item.data();
    const val = value / count ;
    datapoints.push(val ? val : 0);
  });
  // console.log('groups:: ', groups);
  const labels = past7DaysArray.map(item =>
    moment(item).format('dddd').substring(0, 3),
  );
  console.log("datapoints:: ", datapoints);
  return [datapoints, labels];
}
const db = {
  getPast7DayUsers,
  updateData,
  getWeeklyDataPoints,
};

export default db;
