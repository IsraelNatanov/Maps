import mongoose from 'mongoose';
import {config} from "../config/secret";

async function main() {
    console.log(config.userDb);
    await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.3ieu4.mongodb.net/idf`, );
    console.log("mongo connected idf")
}

main().catch(err => console.log(err));