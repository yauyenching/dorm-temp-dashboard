import { Meteor } from 'meteor/meteor';
import { RoomId, RoomTempCollection } from '../imports/db/temps';
import Papa from 'papaparse';

function insertRoomTemp(data) {
  RoomTempCollection.insert({ 
    room_id: Number(data.RoomId) as RoomId,
    timestamp: new Date(data.timestamp),
    temperature: Number(data.temperature)
  });
}

Meteor.startup(() => {
  // RoomTempCollection.remove({})
  // If the Room Temp collection is empty, add some data.
  if (RoomTempCollection.find().count() === 0) {
    console.log("Collection is empty. Initializing data...")
    Papa.parse(Assets.getText('room-temperatures.csv'), {
      delimiter: ",",
      newline: "",
      header: true,
      worker: true,
      step: function(row) {
        insertRoomTemp(row.data);
        // console.log(row.data.RoomId)
        // console.log("Added row.");
      },
      complete: function() {
        console.log("Finished initializing data!");
      }
    }).data
  }
  // Sanity check
  const cursor = RoomTempCollection.find({});
  console.log(cursor.count())
  // console.log(cursor.fetch().slice(0, 5))
});
