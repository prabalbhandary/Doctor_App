const mongoose = require("mongoose");
const colors = require("colors");

const connectDb = async () => {
  try {
    const url = process.env.DB_URL;
    if (!url) {
      throw new Error("DB_URL env is not set");
    }
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if(mongoose.connection.readyState !== 1){
        throw new Error("Failed to establish connection.")
    }
    console.log("Connected with the database".bgGreen.white)
  } catch (error) {
    console.log(`Error: ${error.message}`.bgRed.white);
  }
};

module.exports = connectDb