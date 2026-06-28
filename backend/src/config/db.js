const mongoose = require('mongoose');

// On restricted networks (college/corporate), SRV DNS queries are blocked.
// We always connect directly to the known Atlas shards in development,
// using credentials extracted from the +srv URI.
// Shard list & replicaSet name verified via Google DNS for cluster0.cab1tly.mongodb.net
const buildDirectUri = (srvUri) => {
  const match = srvUri.match(
    /^mongodb\+srv:\/\/([^:]+):([^@]+)@[^/]+\/([^?]*)\??(.*)$/
  );
  if (!match) return null;
  const [, user, pass, dbName] = match;

  const shards = [
    'ac-flpn8wy-shard-00-00.cab1tly.mongodb.net:27017',
    'ac-flpn8wy-shard-00-01.cab1tly.mongodb.net:27017',
    'ac-flpn8wy-shard-00-02.cab1tly.mongodb.net:27017',
  ].join(',');

  return `mongodb://${user}:${pass}@${shards}/${dbName || 'taskflow'}?ssl=true&replicaSet=atlas-wmw8t4-shard-0&authSource=admin&retryWrites=true&w=majority`;
};

const connectDB = async () => {
  const srvUri = process.env.MONGODB_URI;

  if (!srvUri) {
    console.error('❌ MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  console.log('🔗 Connecting to MongoDB...');

  // Production (Render): use SRV URI directly — no DNS restrictions there
  // Development (college network): use direct URI to bypass blocked SRV DNS
  const isProduction = process.env.NODE_ENV === 'production';
  const uri = isProduction ? srvUri : (buildDirectUri(srvUri) || srvUri);

  if (!isProduction) {
    console.log('🔧 Dev mode: using direct connection (bypassing SRV DNS)');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
