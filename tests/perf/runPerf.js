// tests/perf/runPerf.js
//
// Purpose:
// Automated performance testing using Autocannon.
// Simulates concurrent users and determines PASS/FAIL based on thresholds.
//
// Usage examples:
// node tests/perf/runPerf.js http://127.0.0.1:3000 1000 10
// node tests/perf/runPerf.js http://127.0.0.1:3000 4000 10

const autocannon = require("autocannon");

// Read runtime parameters
const url = process.argv[2] || "http://localhost:3000";
const connections = Number(process.argv[3] || 200);
const duration = Number(process.argv[4] || 10);

// Determine test type based on user load
const isStress = connections >= 4000;

// Define performance thresholds
const THRESHOLDS = isStress
  ? { maxErrorRate: 0.30, maxP99Ms: 5000 }   // stress scenario
  : { maxErrorRate: 0.01, maxP99Ms: 1000 };  // normal load

function main() {
  console.log(`Running Autocannon: ${url} | users=${connections} | duration=${duration}s`);

  // Run load test
  const inst = autocannon(
    { url, connections, duration },
    (err, result) => {
      if (err) {
        console.error("Autocannon error:", err);
        process.exit(1);
      }

      // Collect key metrics
      const total = result.requests.total;
      const errors = (result.errors || 0) + (result.timeouts || 0);
      const errorRate = total > 0 ? errors / total : 1;
      const p99 = result.latency?.p99 ?? 999999;

      console.log("---- Summary ----");
      console.log(`Error rate: ${(errorRate * 100).toFixed(2)}%`);
      console.log(`Latency p99: ${p99} ms`);

      // PASS / FAIL decision
      const pass =
        errorRate <= THRESHOLDS.maxErrorRate &&
        p99 <= THRESHOLDS.maxP99Ms;

      console.log(pass ? "RESULT: PASS ✅" : "RESULT: FAIL ❌");
      process.exit(pass ? 0 : 2);
    }
  );

  // Show live progress
  autocannon.track(inst, { renderProgressBar: true });
}

main();

