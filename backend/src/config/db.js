import mongoose from 'mongoose';
import dns from 'dns';

// Local-network workaround for Atlas SRV lookups. In production the platform's
// own resolver is used — overriding it there causes intermittent connect timeouts.
if (process.env.NODE_ENV !== 'production') {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
}

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

export default connectDB;
