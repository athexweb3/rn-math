import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Pressable
} from "react-native";
import MathLib from "rn-math";

const { width } = Dimensions.get("window");

// Configurable constants
const MATRIX_SIZE = 300;
const VECTOR_SIZE = 1000;
const STATS_DATA_SIZE = 1000;
const ML_SIZE = 100;

const formatMs = (v) => (typeof v === "number" && v >= 0 ? `${v.toFixed(1)} ms` : "N/A");
const safeNumberToFixed = (v, digits = 4) =>
  typeof v === "number" && Number.isFinite(v) ? v.toFixed(digits) : "N/A";

export default function BenchmarkScreen() {
  const [results, setResults] = useState({});
  const [iterations, setIterations] = useState(100);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const runSuperComplexBenchmark = useCallback(() => {
    setError(null);
    setLoading(true);

    // Give RN a tick to render loading indicator before heavy work
    setTimeout(() => {
      const perfNow = typeof performance !== "undefined" && performance.now ? performance.now : () => Date.now();
      const startTime = perfNow();

      try {
        // 1. Build a large matrix
        const largeMatrix = Array.from({ length: MATRIX_SIZE }, () =>
          Array.from({ length: MATRIX_SIZE }, () => Math.random() * 100)
        );

        // 2. Native matrix multiplications
        const matrixOpsStart = perfNow();
        let matrixResult = null;
        const matrixLoops = Math.min(iterations, 10);
        for (let i = 0; i < matrixLoops; i++) {
          matrixResult = MathLib.algebra.matrix.mul(largeMatrix, largeMatrix);
        }
        const matrixOpsTime = perfNow() - matrixOpsStart;

        // 3. Complex number multiplications (JS baseline)
        const complexOpsStart = perfNow();
        let complexResult = [1, 0];
        for (let i = 0; i < iterations; i++) {
          complexResult = multiplyComplexJS(
            complexResult,
            [Math.cos(i * 0.01), Math.sin(i * 0.01)]
          );
        }
        const complexOpsTime = perfNow() - complexOpsStart;

        // 4. Large vector (native)
        const largeVector = Array.from({ length: VECTOR_SIZE }, () => Math.random() * 100);
        const vectorOpsStart = perfNow();
        const vectorNorm = safeCall(() => MathLib.algebra.vector.norm(largeVector), null);
        const vectorMean = safeCall(() => MathLib.algebra.vector.mean(largeVector), null);
        const vectorStd = safeCall(() => MathLib.algebra.vector.std(largeVector), null);
        const vectorOpsTime = perfNow() - vectorOpsStart;

        // 5. Statistics (native)
        const statsData = Array.from({ length: STATS_DATA_SIZE }, () => Math.random() * 1000);
        const statsStart = perfNow();
        const stats = {
          mean: safeCall(() => MathLib.statistics.mean(statsData), null),
          variance: safeCall(() => MathLib.statistics.variance(statsData), null),
          std: safeCall(() => MathLib.statistics.std(statsData), null),
        };
        const statsTime = perfNow() - statsStart;

        // 6. Machine learning - native linear regression (single feature per sample)
        let mlTime = -1;
        let regression = null;
        try {
          const mlX = Array.from({ length: ML_SIZE }, () => [Math.random() * 100]); // single feature
          const mlY = Array.from({ length: ML_SIZE }, (_, i) => 2 * mlX[i][0] + Math.random() * 10);
          const mlStart = perfNow();
          regression = MathLib.ml.linearRegression(mlX, mlY);
          mlTime = perfNow() - mlStart;
        } catch (mlErr) {
          mlTime = -1;
        }

        // 7. Advanced math functions (native)
        const advancedStart = perfNow();
        const advancedResults = {
          factorial: safeCall(() => MathLib.utils.factorial(5), null),
          combinations: safeCall(() => MathLib.utils.nCr(8, 3), null),
          gcd: safeCall(() => MathLib.utils.gcd(48, 18), null),
          lcm: safeCall(() => MathLib.utils.lcm(12, 18), null),
        };
        const advancedTime = perfNow() - advancedStart;

        // ------------------------------
        // JavaScript baselines
        // ------------------------------
        // JS matrix multiplication
        const jsMatrixStart = perfNow();
        let jsMatrixResult = null;
        for (let i = 0; i < matrixLoops; i++) {
          jsMatrixResult = multiplyMatricesJS(largeMatrix, largeMatrix);
        }
        const jsMatrixTime = perfNow() - jsMatrixStart;

        // JS vector operations
        const jsVectorStart = perfNow();
        const jsVectorNorm = vectorNormJS(largeVector);
        const jsVectorMean = vectorMeanJS(largeVector);
        const jsVectorStd = vectorStdJS(largeVector);
        const jsVectorTime = perfNow() - jsVectorStart;

        // JS statistics
        const jsStatsStart = perfNow();
        const jsStats = {
          mean: meanJS(statsData),
          variance: varianceJS(statsData),
          std: stdJS(statsData),
        };
        const jsStatsTime = perfNow() - jsStatsStart;

        // JS linear regression
        let jsMLTime = -1;
        let jsRegression = null;
        try {
          const mlX1D = Array.from({ length: ML_SIZE }, () => Math.random() * 100);
          const mlY1D = Array.from({ length: ML_SIZE }, (_, i) => 2 * mlX1D[i] + Math.random() * 10);
          const jsMLStart = perfNow();
          jsRegression = linearRegressionJS(mlX1D, mlY1D);
          jsMLTime = perfNow() - jsMLStart;
        } catch (err) {
          jsMLTime = -1;
        }

        const totalTime = perfNow() - startTime;

        if (!mountedRef.current) return;

        setResults({
          // native
          matrixOpsTime,
          complexOpsTime,
          vectorOpsTime,
          statsTime,
          mlTime,
          advancedTime,

          // js
          jsMatrixTime,
          jsComplexTime: complexOpsTime,
          jsVectorTime,
          jsStatsTime,
          jsMLTime,

          // values/results
          vectorNorm,
          jsVectorNorm,
          vectorMean,
          vectorStd,
          jsVectorMean,
          jsVectorStd,
          stats,
          jsStats,
          regression,
          jsRegression,
          advancedResults,
          totalTime,
          complexResult,
        });
      } catch (err) {
        if (mountedRef.current) {
          setError(err.message || "Unknown benchmark error");
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }, 50);
  }, [iterations]);

  // Run on mount and when iterations change
  useEffect(() => {
    runSuperComplexBenchmark();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runSuperComplexBenchmark]);

  // UI helper: compute performance data for chart/list
  const performanceData = [
    {
      key: "matrix",
      category: "Matrix operations",
      nativeTime: results.matrixOpsTime,
      jsTime: results.jsMatrixTime,
      description: `${MATRIX_SIZE}×${MATRIX_SIZE} multiplication`,
    },
    {
      key: "complex",
      category: "Complex number multiplications",
      nativeTime: results.complexOpsTime,
      jsTime: results.jsComplexTime,
      description: "Complex arithmetic workload",
    },
    {
      key: "vector",
      category: "Vector analysis",
      nativeTime: results.vectorOpsTime,
      jsTime: results.jsVectorTime,
      description: `${VECTOR_SIZE} element vector computations`,
    },
    {
      key: "statistics",
      category: "Statistical computations",
      nativeTime: results.statsTime,
      jsTime: results.jsStatsTime,
      description: `${STATS_DATA_SIZE} samples statistics`,
    },
    {
      key: "ml",
      category: "Linear regression",
      nativeTime: results.mlTime,
      jsTime: results.jsMLTime,
      description: `${ML_SIZE} sample linear regression`,
    },
  ].filter((p) => (typeof p.nativeTime === "number" && p.nativeTime >= 0) && (typeof p.jsTime === "number" && p.jsTime >= 0));

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={stylesColors.primary} />
        <Text style={styles.loadingText}>Running benchmark...</Text>
        <Text style={styles.loadingSubtext}>Iterations: {iterations}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Benchmark error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.primaryButton} onPress={runSuperComplexBenchmark}>
          <Text style={styles.primaryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const nativeWins = performanceData.filter((p) => p.nativeTime < p.jsTime).length;
  const jsWins = performanceData.filter((p) => p.jsTime < p.nativeTime).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Numeric Benchmark</Text>
      <Text style={styles.subtitle}>Comparing native math library vs JavaScript</Text>

      <View style={styles.controlPanel}>
        <Text style={styles.controlLabel}>Iterations: {iterations}</Text>
        <View style={styles.iterationButtons}>
          {[10, 50, 100, 500].map((count) => (
            <Pressable
              key={count}
              style={[
                styles.iterButton,
                iterations === count && styles.iterButtonActive,
              ]}
              onPress={() => setIterations(count)}
            >
              <Text style={[styles.iterButtonText, iterations === count && styles.iterButtonTextActive]}>
                {count}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{nativeWins}</Text>
              <Text style={styles.summaryLabel}>Native wins</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{jsWins}</Text>
              <Text style={styles.summaryLabel}>JS wins</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>
                {typeof results.totalTime === "number" ? `${results.totalTime.toFixed(0)} ms` : "N/A"}
              </Text>
              <Text style={styles.summaryLabel}>Total time</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance comparison</Text>
          {performanceData.map((item) => {
            const maxTime = Math.max(item.nativeTime || 0, item.jsTime || 0, 1);
            const nativePercent = ((item.nativeTime || 0) / maxTime) * 100;
            const jsPercent = ((item.jsTime || 0) / maxTime) * 100;
            const nativeBetter = item.nativeTime < item.jsTime;
            return (
              <View key={item.key} style={styles.performanceItem}>
                <View style={styles.performanceHeader}>
                  <Text style={styles.performanceTitle}>{item.category}</Text>
                  <Text style={styles.performanceSubtitle}>{item.description}</Text>
                </View>

                <View style={styles.barRow}>
                  <View style={styles.barLabel}>
                    <Text style={styles.barLabelText}>Native</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${nativePercent}%` }]} />
                  </View>
                  <View style={styles.barTime}>
                    <Text style={styles.barTimeText}>{formatMs(item.nativeTime)}</Text>
                  </View>
                </View>

                <View style={styles.barRow}>
                  <View style={styles.barLabel}>
                    <Text style={styles.barLabelText}>JavaScript</Text>
                  </View>
                  <View style={styles.barTrackAlt}>
                    <View style={[styles.barFillAlt, { width: `${jsPercent}%` }]} />
                  </View>
                  <View style={styles.barTime}>
                    <Text style={styles.barTimeText}>{formatMs(item.jsTime)}</Text>
                  </View>
                </View>

                <View style={styles.resultFooter}>
                  <Text style={styles.resultFooterText}>
                    {nativeBetter ? "Native is faster" : "JavaScript is faster"}
                  </Text>
                  <Text style={styles.resultGapText}>
                    {Math.abs((item.nativeTime || 0) - (item.jsTime || 0)).toFixed(1)} ms difference
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Numeric results</Text>

          <View style={styles.resultRowBlock}>
            <View style={styles.resultBox}>
              <Text style={styles.resultBoxTitle}>Vector</Text>
              <Row label="Native norm" value={safeNumberToFixed(results.vectorNorm, 6)} />
              <Row label="JS norm" value={safeNumberToFixed(results.jsVectorNorm, 6)} />
              <Row
                label="Difference"
                value={
                  typeof results.vectorNorm === "number" && typeof results.jsVectorNorm === "number"
                    ? Math.abs(results.vectorNorm - results.jsVectorNorm).toFixed(6)
                    : "N/A"
                }
              />
            </View>

            <View style={styles.resultBox}>
              <Text style={styles.resultBoxTitle}>Statistics</Text>
              <Row label="Native mean" value={safeNumberToFixed(results.stats?.mean, 6)} />
              <Row label="JS mean" value={safeNumberToFixed(results.jsStats?.mean, 6)} />
              <Row label="Native std" value={safeNumberToFixed(results.stats?.std, 6)} />
            </View>
          </View>

          <View style={styles.resultRowBlock}>
            <View style={styles.resultBoxFull}>
              <Text style={styles.resultBoxTitle}>Machine learning</Text>
              {Array.isArray(results.regression) && (
                <Row label="Native coefficients" value={results.regression.map((n) => Number(n).toFixed(3)).join(", ")} />
              )}
              {Array.isArray(results.jsRegression) && (
                <Row label="JS coefficients" value={results.jsRegression.map((n) => Number(n).toFixed(3)).join(", ")} />
              )}
              {Array.isArray(results.regression) && Array.isArray(results.jsRegression) && (
                <Row label="Slope difference" value={Math.abs(results.regression[0] - results.jsRegression[0]).toFixed(6)} />
              )}
            </View>
          </View>

          <View style={styles.resultRowBlock}>
            <View style={styles.resultBox}>
              <Text style={styles.resultBoxTitle}>Advanced</Text>
              <Row label="5!" value={`${results.advancedResults?.factorial ?? "N/A"}`} />
              <Row label="C(8,3)" value={`${results.advancedResults?.combinations ?? "N/A"}`} />
              <Row label="gcd(48,18)" value={`${results.advancedResults?.gcd ?? "N/A"}`} />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.primaryButton} onPress={runSuperComplexBenchmark}>
            <Text style={styles.primaryButtonText}>Run benchmark</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

// ---- small helper components and pure functions ----

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

const safeCall = (fn, fallback) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

// --- pure JS implementations for baseline comparisons ---
const multiplyMatricesJS = (a, b) => {
  const aRows = a.length,
    aCols = a[0].length,
    bCols = b[0].length;
  const result = new Array(aRows);
  for (let i = 0; i < aRows; i++) {
    result[i] = new Array(bCols).fill(0);
    for (let j = 0; j < bCols; j++) {
      let s = 0;
      for (let k = 0; k < aCols; k++) {
        s += a[i][k] * b[k][j];
      }
      result[i][j] = s;
    }
  }
  return result;
};

const multiplyComplexJS = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];

const vectorNormJS = (v) => Math.sqrt(v.reduce((s, x) => s + x * x, 0));
const vectorMeanJS = (v) => v.reduce((s, x) => s + x, 0) / v.length;
const vectorStdJS = (v) => {
  const m = vectorMeanJS(v);
  return Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / v.length);
};

const meanJS = (data) => data.reduce((a, b) => a + b, 0) / data.length;
const varianceJS = (data) => meanJS(data.map((x) => (x - meanJS(data)) ** 2));
const stdJS = (data) => Math.sqrt(varianceJS(data));

const linearRegressionJS = (x, y) => {
  const n = x.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumXX += x[i] * x[i];
  }
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) throw new Error("Cannot compute regression for collinear data");
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return [slope, intercept];
};

// ---- Styles ----
const stylesColors = {
  background: "#0F1724",
  card: "#0b1016",
  muted: "#94a3b8",
  text: "#e6eef8",
  primary: "#2563eb",
  accent: "#f59e0b",
  track: "#172033",
  altTrack: "#162232",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: stylesColors.background,
    paddingTop: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: stylesColors.background,
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: stylesColors.text,
  },
  loadingSubtext: {
    marginTop: 6,
    fontSize: 13,
    color: stylesColors.muted,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#e74c3c",
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: stylesColors.text,
    marginBottom: 20,
    textAlign: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: stylesColors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: stylesColors.muted,
    textAlign: "center",
    marginBottom: 12,
  },

  controlPanel: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: stylesColors.card,
  },
  controlLabel: {
    color: stylesColors.text,
    fontSize: 13,
    marginBottom: 8,
    textAlign: "center",
  },
  iterationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#111827",
    minWidth: 64,
    alignItems: "center",
  },
  iterButtonActive: {
    backgroundColor: stylesColors.primary,
  },
  iterButtonText: {
    color: stylesColors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  iterButtonTextActive: {
    color: "#ffffff",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 16,
  },

  summarySection: {
    backgroundColor: stylesColors.card,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryCard: {
    alignItems: "center",
    flex: 1,
  },
  summaryValue: {
    fontSize: 20,
    color: stylesColors.primary,
    fontWeight: "700",
  },
  summaryLabel: {
    fontSize: 12,
    color: stylesColors.muted,
    marginTop: 4,
  },

  section: {
    marginBottom: 12,
    backgroundColor: stylesColors.card,
    padding: 12,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: stylesColors.text,
    marginBottom: 10,
  },

  performanceItem: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#071020",
    borderRadius: 8,
  },
  performanceHeader: {
    marginBottom: 8,
  },
  performanceTitle: {
    color: stylesColors.text,
    fontWeight: "600",
    fontSize: 14,
  },
  performanceSubtitle: {
    color: stylesColors.muted,
    fontSize: 12,
  },

  barRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  barLabel: {
    width: 72,
  },
  barLabelText: {
    color: stylesColors.muted,
    fontSize: 12,
  },
  barTrack: {
    flex: 1,
    height: 12,
    backgroundColor: stylesColors.track,
    borderRadius: 6,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  barTrackAlt: {
    flex: 1,
    height: 12,
    backgroundColor: stylesColors.altTrack,
    borderRadius: 6,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  barFill: {
    height: "100%",
    backgroundColor: stylesColors.primary,
  },
  barFillAlt: {
    height: "100%",
    backgroundColor: stylesColors.accent,
  },
  barTime: {
    width: 78,
    alignItems: "flex-end",
  },
  barTimeText: {
    color: stylesColors.muted,
    fontSize: 11,
  },

  resultFooter: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resultFooterText: {
    color: stylesColors.text,
    fontSize: 12,
  },
  resultGapText: {
    color: stylesColors.muted,
    fontSize: 12,
  },

  resultRowBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  resultBox: {
    flex: 1,
    padding: 10,
    marginRight: 8,
    backgroundColor: "#071824",
    borderRadius: 8,
  },
  resultBoxFull: {
    flex: 1,
    padding: 10,
    backgroundColor: "#071824",
    borderRadius: 8,
  },
  resultBoxTitle: {
    color: stylesColors.text,
    fontWeight: "600",
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  rowLabel: {
    color: stylesColors.muted,
    fontSize: 12,
    flex: 1,
  },
  rowValue: {
    color: stylesColors.text,
    fontSize: 12,
    textAlign: "right",
    flex: 1,
  },

  footer: {
    marginTop: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: stylesColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    minWidth: Math.min(320, width - 48),
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
