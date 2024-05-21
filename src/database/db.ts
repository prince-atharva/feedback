import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: boolean;
};

const connection: ConnectionObject = {};

export async function database(): Promise<void> {
  try {
    if (connection.isConnected) {
      console.log("Database is already connected!");
      return;
    }

    const db = await mongoose.connect(process.env.MONGO_URL || "");
    connection.isConnected = db.connections[0].readyState === 1;
    console.log(`Database Connected! Host : ${db.connection.host}`);
  } catch (error) {
    console.log(`Database Connection Error : ${(error as Error).message}`);
    process.exit(1);
  }
}
