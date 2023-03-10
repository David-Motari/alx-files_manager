const { MongoClient } = require('mongodb');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
  constructor() {
    MongoClient.connect(url, (error, client) => {
      if (error) {
        console.log(error.message);
        this.db = false;
        return;
      }
      this.db = client.db(DB_DATABASE);
      this.users = this.db.collection('users');
      this.files = this.db.collection('files');
    });
  }

  isAlive() {
    //  returns true when the connection to MongoDB is a success otherwise, false
    if (this.db) {
      return true;
    }
    return false;
  }

  async nbUsers() {
    // returns the number of documents in the collection users
    return this.users.countDocuments();
  }

  async nbFiles() {
    //
    return this.files.countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
