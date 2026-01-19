const autocannon = require("autocannon");

const url = "http://localhost:3000";
const duration = 10;

// performance thresholds (exam-friendly)
const MAX_P99_MS = 1000;
const MAX_ERROR_RATE = 0.01;

// test steps
const LOAD_STEPS = [50, 100, 200, 500, 1000, 2000, 5000];

function runTest(connections) {
  return new Promise((resolve) => {
    autocannon(
      { url, connections, duration },
      (err, result) => {
        const total = result.requests.total;
        const errors = (result.errors || 0) + (result.timeouts || 0);
        const errorRate = total ? errors / total : 1;
        const p99 = result.latency.p99;

        const pass =
          p99 <= MAX_P99_MS &&
          errorRate <= MAX_ERROR_RATE;

        resolve({ connections, pass, p99, errorRate });
      }
    );
  });
}

(async () => {
  console.log("Finding system performance limit...\n");

  for (const load of LOAD_STEPS) {
    const result = await runTest(load);

    console.log(
      `Users: ${load} | p99: ${result.p99}ms | ErrorRate: ${(result.errorRate * 100).toFixed(2)}% | ${result.pass ? "PASS ✅" : "FAIL ❌"}`
    );

    if (!result.pass) {
      console.log("\nPerformance limit reached.");
      process.exit(1);
    }
  }

  console.log("\nAll tested loads passed.");
  process.exit(0);
})();
