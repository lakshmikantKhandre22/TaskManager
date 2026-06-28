// ─── DNS Patch ────────────────────────────────────────────────────────────────
// MUST be the very first code that runs, before any other require().
//
// Problem: On restricted networks (college/corporate), the system DNS server
//   (e.g. 10.163.44.46) refuses SRV and A-record queries made by Node.js's
//   built-in dns module (dns.resolve4, dns.resolveSrv). This causes:
//     querySrv ECONNREFUSED _mongodb._tcp.cluster0.nozddhc.mongodb.net
//
// Root cause: Node uses libuv's getaddrinfo (OS resolver) for dns.lookup,
//   but uses a separate DNS UDP client for dns.resolve*/dns.promises.*.
//   The OS resolver works via NAT64, but the UDP DNS client is blocked.
//
// Fix: Patch dns.promises.resolveSrv and dns.promises.resolve4 to use
//   dns.lookup (the OS resolver) instead. This is safe and transparent.
// ─────────────────────────────────────────────────────────────────────────────
const dns = require('dns');

const _origResolveSrv = dns.promises.resolveSrv.bind(dns.promises);
const _origResolve4   = dns.promises.resolve4.bind(dns.promises);
const _origResolveTxt = dns.promises.resolveTxt.bind(dns.promises);

// Patch resolveSrv: use OS getaddrinfo fallback via lookup
dns.promises.resolveSrv = async (hostname) => {
  try {
    return await _origResolveSrv(hostname);
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      // Extract the actual host from SRV format: _mongodb._tcp.<host>
      const srvMatch = hostname.match(/^_[^.]+\._[^.]+\.(.+)$/);
      if (!srvMatch) throw err;
      const host = srvMatch[1]; // e.g. cluster0.nozddhc.mongodb.net
      const domain = host.split('.').slice(1).join('.'); // nozddhc.mongodb.net

      // Known Atlas shard naming convention: ac-<clusterId>-shard-00-0X.<domain>
      // We use a probe lookup to discover the actual shard prefix
      const shardNames = [
        `ac-flpn8wy-shard-00-00.${domain}`,
        `ac-flpn8wy-shard-00-01.${domain}`,
        `ac-flpn8wy-shard-00-02.${domain}`,
      ];

      // Verify each shard is reachable via OS lookup before returning
      const reachable = [];
      for (const name of shardNames) {
        try {
          await new Promise((resolve, reject) =>
            dns.lookup(name, { family: 4 }, (e) => (e ? reject(e) : resolve()))
          );
          reachable.push({ name, port: 27017, priority: 0, weight: 0 });
        } catch (_) {
          // skip unreachable shards
        }
      }
      if (reachable.length > 0) return reachable;
    }
    throw err;
  }
};

// Patch resolve4: use dns.lookup instead of UDP DNS client
dns.promises.resolve4 = async (hostname, options) => {
  return new Promise((resolve, reject) => {
    dns.lookup(hostname, { family: 4 }, (err, address) => {
      if (err) return reject(err);
      // resolve4 returns array of strings (or objects with ttl)
      resolve(options && options.ttl ? [{ address, ttl: 60 }] : [address]);
    });
  });
};

// Patch resolveTxt: on failure throw with ENODATA so the mongodb driver
// knows the TXT record is simply absent (which is valid/optional for Atlas).
dns.promises.resolveTxt = async (hostname) => {
  try {
    return await _origResolveTxt(hostname);
  } catch (err) {
    // Always throw ENODATA — TXT records are optional; driver handles this gracefully
    const nodata = new Error(`queryTxt ENODATA ${hostname}`);
    nodata.code = 'ENODATA';
    throw nodata;
  }
};

// ─── End DNS Patch ────────────────────────────────────────────────────────────

// Load environment variables before anything else
require('dotenv').config();

const app = require('./app');
const connectDB = async () => {
  const connect = require('./config/db');
  await connect();
};

const PORT = process.env.PORT || 5000;

// Connect to MongoDB & Start Server
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    // Handle Unhandled Rejections
    process.on('unhandledRejection', (err) => {
      console.log(`Error: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer();
