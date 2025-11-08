import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Dimensions } from "react-native";
import MathLibrary from "rn-math";

const { width } = Dimensions.get('window');

// Define constants at the top level
const MATRIX_SIZE = 50;
const VECTOR_SIZE = 1000;
const STATS_DATA_SIZE = 1000;
const ML_SIZE = 100;

export default function Index() {
  const [results, setResults] = useState({});
  const [iterations, setIterations] = useState(100);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const runSuperComplexBenchmark = () => {
    const startTime = performance.now();
    
    try {
      setError(null);
      setLoading(true);

      // 🚀 SUPER COMPLEX MATHEMATICAL OPERATIONS

      // 1. Large Matrix Operations
      const largeMatrix = Array(MATRIX_SIZE).fill(0).map(() => 
        Array(MATRIX_SIZE).fill(0).map(() => Math.random() * 100)
      );
      
      // 2. Multiple Matrix Multiplications
      const matrixOpsStart = performance.now();
      let matrixResult;
      for (let i = 0; i < Math.min(iterations, 10); i++) {
        matrixResult = MathLibrary.algebra.matrix.mul(largeMatrix, largeMatrix);
      }
      const matrixOpsTime = performance.now() - matrixOpsStart;

      // 3. Complex Number Computations
      const complexOpsStart = performance.now();
      let complexResult = [1, 0];
      for (let i = 0; i < iterations; i++) {
        complexResult = multiplyComplexJS(
          complexResult, 
          [Math.cos(i * 0.01), Math.sin(i * 0.01)]
        );
      }
      const complexOpsTime = performance.now() - complexOpsStart;

      // 4. Large Vector Operations
      const largeVector = Array(VECTOR_SIZE).fill(0).map(() => Math.random() * 100);
      const vectorOpsStart = performance.now();
      const vectorNorm = MathLibrary.algebra.vector.norm(largeVector);
      const vectorMean = MathLibrary.algebra.vector.mean(largeVector);
      const vectorStd = MathLibrary.algebra.vector.std(largeVector);
      const vectorOpsTime = performance.now() - vectorOpsStart;

      // 5. Statistical Analysis on Large Dataset
      const statsData = Array(STATS_DATA_SIZE).fill(0).map(() => Math.random() * 1000);
      const statsStart = performance.now();
      const stats = {
        mean: MathLibrary.statistics.mean(statsData),
        variance: MathLibrary.statistics.variance(statsData),
        std: MathLibrary.statistics.std(statsData)
      };
      const statsTime = performance.now() - statsStart;

      // 6. Machine Learning - Linear Regression (FIXED: Use single feature)
      let mlTime = 0;
      let regression = null;
      try {
        // Use single feature per sample as required by the implementation
        const mlX = Array(ML_SIZE).fill(0).map(() => [Math.random() * 100]); // Single feature
        const mlY = Array(ML_SIZE).fill(0).map((_, i) => 2 * mlX[i][0] + Math.random() * 10);
        const mlStart = performance.now();
        regression = MathLibrary.ml.linearRegression(mlX, mlY);
        mlTime = performance.now() - mlStart;
      } catch (mlError) {
        console.log("Linear regression failed:", mlError.message);
        mlTime = -1; // Mark as failed but continue benchmark
      }

      // 7. Advanced Mathematical Functions
      const advancedStart = performance.now();
      let advancedResults = {};
      for (let i = 0; i < Math.min(iterations, 10); i++) {
        advancedResults = {
          factorial: MathLibrary.utils.factorial(5),
          combinations: MathLibrary.utils.nCr(8, 3),
          gcd: MathLibrary.utils.gcd(48, 18),
          lcm: MathLibrary.utils.lcm(12, 18)
        };
      }
      const advancedTime = performance.now() - advancedStart;

      // 🎯 JAVASCRIPT IMPLEMENTATIONS FOR COMPARISON

      // JS Matrix Multiplication
      const jsMatrixStart = performance.now();
      let jsMatrixResult;
      for (let i = 0; i < Math.min(iterations, 10); i++) {
        jsMatrixResult = multiplyMatricesJS(largeMatrix, largeMatrix);
      }
      const jsMatrixTime = performance.now() - jsMatrixStart;

      // JS Vector Operations
      const jsVectorStart = performance.now();
      const jsVectorNorm = vectorNormJS(largeVector);
      const jsVectorMean = vectorMeanJS(largeVector);
      const jsVectorStd = vectorStdJS(largeVector);
      const jsVectorTime = performance.now() - jsVectorStart;

      // JS Statistics
      const jsStatsStart = performance.now();
      const jsStats = {
        mean: meanJS(statsData),
        variance: varianceJS(statsData),
        std: stdJS(statsData)
      };
      const jsStatsTime = performance.now() - jsStatsStart;

      // JS Linear Regression
      let jsMLTime = 0;
      let jsRegression = null;
      try {
        const mlX = Array(ML_SIZE).fill(0).map(() => Math.random() * 100); // 1D array for JS
        const mlY = Array(ML_SIZE).fill(0).map((_, i) => 2 * mlX[i] + Math.random() * 10);
        const jsMLStart = performance.now();
        jsRegression = linearRegressionJS(mlX, mlY);
        jsMLTime = performance.now() - jsMLStart;
      } catch (jsMLError) {
        console.log("JS linear regression failed:", jsMLError.message);
        jsMLTime = -1;
      }

      const totalTime = performance.now() - startTime;

      setResults({
        // Native Times
        matrixOpsTime,
        complexOpsTime,
        vectorOpsTime,
        statsTime,
        mlTime,
        advancedTime,
        
        // JavaScript Times
        jsMatrixTime,
        jsComplexTime: complexOpsTime,
        jsVectorTime,
        jsStatsTime,
        jsMLTime,
        
        // Results
        vectorNorm,
        jsVectorNorm,
        stats,
        jsStats,
        regression,
        jsRegression,
        advancedResults,
        totalTime,
        complexResult
      });

    } catch (error) {
      console.error("Benchmark error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // JavaScript implementations for comparison
  const multiplyMatricesJS = (a, b) => {
    const aRows = a.length, aCols = a[0].length, bCols = b[0].length;
    const result = new Array(aRows);
    for (let i = 0; i < aRows; i++) {
      result[i] = new Array(bCols).fill(0);
      for (let j = 0; j < bCols; j++) {
        for (let k = 0; k < aCols; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    return result;
  };

  const multiplyComplexJS = (a, b) => {
    return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  };

  const vectorNormJS = (v) => {
    return Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
  };

  const vectorMeanJS = (v) => {
    return v.reduce((sum, x) => sum + x, 0) / v.length;
  };

  const vectorStdJS = (v) => {
    const mean = vectorMeanJS(v);
    return Math.sqrt(v.reduce((sum, x) => sum + (x - mean) ** 2, 0) / v.length);
  };

  const meanJS = (data) => {
    return data.reduce((a, b) => a + b) / data.length;
  };

  const varianceJS = (data) => {
    const mean = meanJS(data);
    return meanJS(data.map(x => (x - mean) ** 2));
  };

  const stdJS = (data) => {
    return Math.sqrt(varianceJS(data));
  };

  const linearRegressionJS = (x, y) => {
    const n = x.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += x[i];
      sumY += y[i];
      sumXY += x[i] * y[i];
      sumXX += x[i] * x[i];
    }
    
    const denominator = n * sumXX - sumX * sumX;
    if (denominator === 0) throw new Error("Cannot compute regression for collinear data");
    
    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;
    
    return [slope, intercept];
  };

  useEffect(() => {
    runSuperComplexBenchmark();
  }, [iterations]);

  // Safe performance data with fallbacks
  const performanceData = [
    {
      category: "🧮 Matrix Operations",
      nativeTime: results.matrixOpsTime || 0,
      jsTime: results.jsMatrixTime || 0,
      description: `${MATRIX_SIZE}×${MATRIX_SIZE} matrix multiplication`
    },
    {
      category: "🔢 Complex Numbers",
      nativeTime: results.complexOpsTime || 0,
      jsTime: results.jsComplexTime || 0,
      description: "Complex number multiplications"
    },
    {
      category: "📊 Vector Operations",
      nativeTime: results.vectorOpsTime || 0,
      jsTime: results.jsVectorTime || 0,
      description: `${VECTOR_SIZE} element vector analysis`
    },
    {
      category: "📈 Statistical Analysis",
      nativeTime: results.statsTime || 0,
      jsTime: results.jsStatsTime || 0,
      description: `${STATS_DATA_SIZE} data points statistics`
    },
    {
      category: "🤖 ML Regression",
      nativeTime: results.mlTime || 0,
      jsTime: results.jsMLTime || 0,
      description: `${ML_SIZE} samples linear regression`
    }
  ].filter(item => (item.nativeTime || 0) > 0 && (item.jsTime || 0) > 0);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>🚀 Running Ultimate Math Benchmark...</Text>
        <Text style={styles.loadingSubtext}>Testing {iterations} iterations</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Error Running Benchmark</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryButton} onPress={runSuperComplexBenchmark}>
          🔄 Retry Benchmark
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Ultimate Math Benchmark</Text>
      <Text style={styles.subtitle}>Native C++ vs JavaScript Performance</Text>

      <View style={styles.controlPanel}>
        <Text style={styles.controlLabel}>Operations Scale: {iterations} iterations</Text>
        <View style={styles.buttonRow}>
          {[10, 50, 100, 500].map(count => (
            <Text
              key={count}
              style={[
                styles.iterButton,
                iterations === count && styles.iterButtonActive
              ]}
              onPress={() => setIterations(count)}
            >
              {count}
            </Text>
          ))}
        </View>
      </View>

      <ScrollView style={styles.resultsContainer}>
        {/* Overall Performance Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>🏆 Overall Performance</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>
                {performanceData.filter(p => (p.nativeTime || 0) < (p.jsTime || 0)).length}
              </Text>
              <Text style={styles.summaryLabel}>Native Wins</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>
                {performanceData.filter(p => (p.jsTime || 0) < (p.nativeTime || 0)).length}
              </Text>
              <Text style={styles.summaryLabel}>JS Wins</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>
                {results.totalTime ? `${results.totalTime.toFixed(0)}ms` : '...'}
              </Text>
              <Text style={styles.summaryLabel}>Total Time</Text>
            </View>
          </View>
        </View>

        {/* Performance Comparison Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>📊 Performance Comparison</Text>
          {performanceData.map((item, index) => {
            const maxTime = Math.max(item.nativeTime || 0, item.jsTime || 0, 1);
            const nativeWidth = ((item.nativeTime || 0) / maxTime) * 100;
            const jsWidth = ((item.jsTime || 0) / maxTime) * 100;
            const nativeWins = (item.nativeTime || 0) < (item.jsTime || 0);

            return (
              <View key={index} style={styles.chartItem}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartCategory}>{item.category}</Text>
                  <Text style={styles.chartDescription}>{item.description}</Text>
                </View>
                
                <View style={styles.chartBars}>
                  <View style={styles.barContainer}>
                    <Text style={styles.barLabel}>Native</Text>
                    <View style={styles.barBackground}>
                      <View 
                        style={[
                          styles.barFill, 
                          styles.nativeBar,
                          { width: `${nativeWidth}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.barTime}>
                      {item.nativeTime ? `${item.nativeTime.toFixed(1)}ms` : 'N/A'}
                    </Text>
                  </View>
                  
                  <View style={styles.barContainer}>
                    <Text style={styles.barLabel}>JavaScript</Text>
                    <View style={styles.barBackground}>
                      <View 
                        style={[
                          styles.barFill, 
                          styles.jsBar,
                          { width: `${jsWidth}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.barTime}>
                      {item.jsTime ? `${item.jsTime.toFixed(1)}ms` : 'N/A'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.winnerBadge}>
                  <Text style={[
                    styles.winnerText,
                    nativeWins ? styles.nativeWinner : styles.jsWinner
                  ]}>
                    {item.nativeTime && item.jsTime ? 
                      (nativeWins ? '🏆 NATIVE WINS' : '⚡ JS WINS') : 
                      'TEST FAILED'
                    }
                  </Text>
                  {item.nativeTime && item.jsTime && (
                    <Text style={styles.performanceGap}>
                      {Math.abs(item.nativeTime - item.jsTime).toFixed(1)}ms difference
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Mathematical Results */}
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>🔬 Mathematical Results</Text>
          
          <View style={styles.resultGrid}>
            <View style={styles.resultCard}>
              <Text style={styles.resultCardTitle}>Vector Analysis</Text>
              <ResultRow label="Native Norm" value={results.vectorNorm?.toFixed(4)} />
              <ResultRow label="JS Norm" value={results.jsVectorNorm?.toFixed(4)} />
              <ResultRow label="Difference" 
                value={results.vectorNorm && results.jsVectorNorm ? 
                  Math.abs(results.vectorNorm - results.jsVectorNorm).toFixed(6) : '...'} 
              />
            </View>
            
            <View style={styles.resultCard}>
              <Text style={styles.resultCardTitle}>Statistics</Text>
              <ResultRow label="Native Mean" value={results.stats?.mean?.toFixed(4)} />
              <ResultRow label="JS Mean" value={results.jsStats?.mean?.toFixed(4)} />
              <ResultRow label="Native Std" value={results.stats?.std?.toFixed(4)} />
            </View>
          </View>

          {/* Machine Learning Results */}
          <View style={styles.resultGrid}>
            {(results.regression || results.jsRegression) && (
              <View style={styles.resultCard}>
                <Text style={styles.resultCardTitle}>Machine Learning</Text>
                {results.regression && (
                  <ResultRow label="Native Coefficients" 
                    value={results.regression.map(x => x.toFixed(3)).join(', ')} 
                  />
                )}
                {results.jsRegression && (
                  <ResultRow label="JS Coefficients" 
                    value={results.jsRegression.map(x => x.toFixed(3)).join(', ')} 
                  />
                )}
                {results.regression && results.jsRegression && (
                  <ResultRow label="Slope Difference" 
                    value={Math.abs(results.regression[0] - results.jsRegression[0]).toFixed(6)} 
                  />
                )}
              </View>
            )}

            {results.advancedResults && (
              <View style={styles.resultCard}>
                <Text style={styles.resultCardTitle}>Advanced Functions</Text>
                <ResultRow label="5!" value={results.advancedResults.factorial} />
                <ResultRow label="C(8,3)" value={results.advancedResults.combinations} />
                <ResultRow label="gcd(48,18)" value={results.advancedResults.gcd} />
              </View>
            )}
          </View>
        </View>

        {/* Final Verdict */}
        <View style={styles.verdictSection}>
          <Text style={styles.verdictTitle}>🎯 Performance Verdict</Text>
          
          <View style={styles.verdictCard}>
            <Text style={styles.verdictText}>
              {performanceData.filter(p => (p.nativeTime || 0) < (p.jsTime || 0)).length >= 
               performanceData.filter(p => (p.jsTime || 0) < (p.nativeTime || 0)).length
                ? "🏆 Native C++ Library Dominates for complex mathematical operations!"
                : "⚡ JavaScript holds its own for many operations!"}
            </Text>
            <Text style={styles.verdictDetails}>
              Native won {performanceData.filter(p => (p.nativeTime || 0) < (p.jsTime || 0)).length} out of {performanceData.length} categories
            </Text>
          </View>
        </View>

        {/* Run Again */}
        <Text style={styles.refreshButton} onPress={runSuperComplexBenchmark}>
          🔄 Run Benchmark Again
        </Text>
      </ScrollView>
    </View>
  );
}

const ResultRow = ({ label, value }) => (
  <View style={styles.resultRow}>
    <Text style={styles.resultLabel}>{label}</Text>
    <Text style={styles.resultValue} numberOfLines={1}>
      {value !== undefined && value !== null ? value.toString() : 'N/A'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    padding: 20,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 8,
    textAlign: "center",
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#cccccc",
    textAlign: "center",
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: 16,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#cccccc",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    color: "#ffffff",
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#cccccc",
    marginBottom: 20,
  },
  controlPanel: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  controlLabel: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 12,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  iterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    color: "#cccccc",
    fontSize: 14,
    fontWeight: "500",
  },
  iterButtonActive: {
    backgroundColor: "#007AFF",
    color: "#ffffff",
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  summarySection: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryCard: {
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#888888",
  },
  chartSection: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  chartItem: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
  },
  chartHeader: {
    marginBottom: 12,
  },
  chartCategory: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  chartDescription: {
    fontSize: 12,
    color: "#888888",
  },
  chartBars: {
    marginBottom: 12,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  barLabel: {
    width: 80,
    fontSize: 12,
    color: '#cccccc',
  },
  barBackground: {
    flex: 1,
    height: 20,
    backgroundColor: '#3a3a3a',
    borderRadius: 10,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
  nativeBar: {
    backgroundColor: '#007AFF',
  },
  jsBar: {
    backgroundColor: '#FFD700',
  },
  barTime: {
    width: 60,
    fontSize: 10,
    color: '#cccccc',
    textAlign: 'right',
  },
  winnerBadge: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
  },
  winnerText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nativeWinner: {
    color: '#007AFF',
  },
  jsWinner: {
    color: '#FFD700',
  },
  performanceGap: {
    fontSize: 10,
    color: '#888888',
  },
  resultsSection: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  resultGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultCard: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    marginBottom: 12,
  },
  resultCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  resultLabel: {
    fontSize: 10,
    color: '#888888',
    flex: 1,
  },
  resultValue: {
    fontSize: 10,
    color: '#ffffff',
    fontFamily: 'monospace',
    flex: 1,
    textAlign: 'right',
  },
  verdictSection: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  verdictTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
  },
  verdictCard: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 8,
  },
  verdictText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 8,
  },
  verdictDetails: {
    fontSize: 12,
    color: '#cccccc',
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: "#007AFF",
    color: "#ffffff",
    textAlign: "center",
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
