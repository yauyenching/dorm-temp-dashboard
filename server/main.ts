import { Meteor } from 'meteor/meteor';
import { RoomTempCollection } from '../imports/api/temps';
import Papa from 'papaparse';

function insertRoomTemp(row) {
  RoomTempCollection.insert({ 
    room_id: Number(row[0]),
    timestamp: new Date(row[1]),
    temperature: Number(row[2])
  });
}

Meteor.startup(() => {
  // RoomTempCollection.remove({})
  console.log(RoomTempCollection.find().count())
  // If the Links collection is empty, add some data.
  if (RoomTempCollection.find().count() === 0) {
    const csv = Papa.parse(Assets.getText('room-temperatures.csv'), {
      delimiter: ",",
      newline: "",
      header: true,
      worker: true,
      step: function(row) {
        insertRoomTemp(row);
        console.log("Added row.");
      },
      complete: function() {
        console.log("Finished initializing data!");
      }
    }).data
  }
  console.log(RoomTempCollection.find().count())
});
