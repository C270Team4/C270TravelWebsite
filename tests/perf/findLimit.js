// tests/perf/findLimit.js
//
// Purpose:
// Incrementally tests increasing user load to identify
// the maximum load the system can handle before failing.
//
// This is used to find the system performance limit.

const autocannon = require("autocannon");

// Target application and test duration
const url = "http://localhost:3000";
const duration = 10;

// Performance thresholds
const MAX_P99_MS = 5000;
const MAX_ERROR_RATE = 0.01;

// User load levels to test incrementally
const LOAD_STEPS = [50, 100, 200, 500, 1000, 2000, 4000];

// Run a single performance test for a given user load
function runTest(connections) {
  return new Promise((resolve) => {
    autocannon(
      { url, connections, duration },
      (err, result) => {
        const total = result.requests.total;
        const errors = (result.errors || 0) + (result.timeouts || 0);
        const errorRate = total ? errors / total : 1;
        const p99 = result.latency.p99;

        // PASS / FAIL decision
        const pass =
          p99 <= MAX_P99_MS &&
          errorRate <= MAX_ERROR_RATE;

        resolve({ connections, pass, p99, errorRate });
      }
    );
  });
}

// Execute tests step-by-step until a failure occurs
(async () => {
  console.log("Finding system performance limit...\n");

  for (const load of LOAD_STEPS) {
    const result = await runTest(load);

    console.log(
      `Users: ${load} | p99: ${result.p99}ms | ErrorRate: ${(result.errorRate * 100).toFixed(2)}% | ${result.pass ? "PASS ✅" : "FAIL ❌"}`
    );

    // Stop when performance threshold is breached
    if (!result.pass) {
      console.log("\nPerformance limit reached.");
      process.exit(1);
    }
  }

  console.log("\nAll tested loads passed.");
  process.exit(0);
})();
