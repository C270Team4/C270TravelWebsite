// tests/perf/runPerf.js
// Usage: node tests/perf/runPerf.js http://localhost:3000 200 10
//        node tests/perf/runPerf.js http://localhost:3000 50000 10

const autocannon = require("autocannon");

const url = process.argv[2] || "http://localhost:3000";
const connections = Number(process.argv[3] || 200);
const duration = Number(process.argv[4] || 10);

// Define PASS/FAIL thresholds (edit to match your story)
const THRESHOLDS = {
  maxErrorRate: connections >= 50000 ? 0.30 : 0.01, // allow more errors in stress scenario
  maxP99Ms: connections >= 50000 ? 5000 : 1000,     // normal should be fast; stress can be slower
};

function main() {
  console.log(`Running Autocannon: ${url} | connections=${connections} | duration=${duration}s`);

  const inst = autocannon(
    {
      url,
      connections,
      duration,
    },
    (err, result) => {
      if (err) {
        console.error("Autocannon error:", err);
        process.exit(1);
      }

      const total = result.requests.total;
      const errors = (result.errors || 0) + (result.timeouts || 0);
      const errorRate = total > 0 ? errors / total : 1;

      const p99 = result.latency?.p99 ?? 999999; // in ms

      console.log("---- Summary ----");
      console.log(`Total requests: ${total}`);
      console.log(`Errors+timeouts: ${errors}`);
      console.log(`Error rate: ${(errorRate * 100).toFixed(2)}%`);
      console.log(`Latency p99: ${p99} ms`);

      // Decide PASS/FAIL
      const pass =
        errorRate <= THRESHOLDS.maxErrorRate &&
        p99 <= THRESHOLDS.maxP99Ms;

      console.log(`Thresholds: maxErrorRate=${THRESHOLDS.maxErrorRate * 100}% | maxP99=${THRESHOLDS.maxP99Ms}ms`);
      console.log(pass ? "RESULT: PASS ✅" : "RESULT: FAIL ❌");

      process.exit(pass ? 0 : 2);
    }
  );

  autocannon.track(inst, { renderProgressBar: true });
}

main();
