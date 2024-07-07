const XLSX = require('xlsx');
const { MongoClient } = require('mongodb');
import mongoose from 'mongoose';
import {config} from "../config/secret";
import { PrayerTimesModel } from '../models/prayerTimesModel';

async function connectToMongoDB() {
  const uri = `mongodb+srv://${config.userDb}:${config.passDb}@cluster0.3ieu4.mongodb.net/idf`;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    throw error;
  }
}


// Load the XLSX file
const workbook = XLSX.readFile('zmanim.xlsx');

// Assuming the first sheet contains your table data
const sheet = workbook.Sheets[workbook.SheetNames[0]];

// Convert the XLSX data to JSON
const jsonData = XLSX.utils.sheet_to_json(sheet);
console.log(jsonData);

mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.3ieu4.mongodb.net/idf`,);
async function insertDataIntoMongoDB(client:any, data:any) {
    const db = client.db();
    const collection = db.collection('zmanim');
  
    try {
      const result = await collection.insertMany(data);
      console.log(`${result.insertedCount} documents inserted`);
    } catch (error) {
      console.error('Error inserting data into MongoDB', error);
      throw error;
    }
  }

  async function main() {
    const client = await connectToMongoDB();
  
    // Parse the XLSX file and convert to JSON

  
    // Insert JSON data into MongoDB
    // await insertDataIntoMongoDB(client, jsonData);
  
    // Close the MongoDB connection
    await client.close();
  }

  async function saveData() {
    try {
      for (const entry of jsonData) {
        // Create a new instance of the PrayerTimes model for each entry
        const prayerTime = new PrayerTimesModel({
            civilDate: entry[' civil date'],
            jewishDate: entry[' date'],
            dayOfWeek: entry['day of the week'],
            parshasHashavua: entry[' Parashat Shavua / Yot'],
            alos16_1: entry[' cost 16.1°'],
            alos72Minutes: entry[' cost 72 minutes'],
            misheyakir10_2: entry[' משיכיר 10.2°'],
            sunrise20_57Meters: entry[' הנץ החמה (20.57 מטר)'],
            sunriseSeaLevel: entry[' הנץ החמה (גובה פני הים)'],
            sofZmanShmaMGA72Minutes: entry[' סוף זמן שמע מג”א 72 דקות'],
            sofZmanShmaGRA: entry[' סוף זמן שמע גר”א'],
            sofZmanTfilaMGA72Minutes: entry[' סוף זמן תפלה מג”א 72 דקות'],
            sofZmanTfilaGRA: entry[' סוף זמן תפלה גר”א'],
            chatzosAstronomical: entry[' חצות אסטרונומי'],
            minchaGedolaGRA: entry[' מנחה גדולה גר”א גר”א'],
            plagHamincha: entry[' פלג המנחה'],
            candleLighting18Minutes: entry[' הדלקת נרות 18 דקות'],
            sunsetSeaLevel: entry[' שקיעת החמה (גובה פני הים)'],
            sunset20_57Meters: entry[' שקיעת החמה (20.57 מטר)'],
            tzaisGeonim8_5: entry[' צאת גאונים 8.5°'],
            tzais72Minutes: entry[' צאת 72 דקות'],
            tzais16_1: entry[' צאת 16.1°'],
            // Continue mapping other fields here
          });
  
        // Save the instance to the database
        await prayerTime.save();
      }
      console.log('Data saved successfully.');
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      // Disconnect from the database when done
      mongoose.disconnect();
    }
  }
  saveData().catch(console.error);
  
  main().catch(console.error);