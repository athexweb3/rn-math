// src/index.ts
import { NitroModules } from 'react-native-nitro-modules'
import type { Complex, Math, Matrix, Vector } from './specs/Math.nitro'

export type { Complex, Math, Matrix, Vector }

export const math: Math = NitroModules.createHybridObject<Math>('Math')

export const MathLibrary = {
  // Basic arithmetic
  add: (a: number, b: number): number => math.add(a, b),
  sub: (a: number, b: number): number => math.subtract(a, b),
  mul: (a: number, b: number): number => math.multiply(a, b),
  div: (a: number, b: number): number => math.divide(a, b),

  // Advanced functions
  pow: (base: number, exp: number): number => math.power(base, exp),
  sqrt: (x: number): number => math.squareRoot(x),
  abs: (x: number): number => math.absolute(x),
  exp: (x: number): number => math.exponential(x),
  log: (x: number): number => math.naturalLog(x),
  log10: (x: number): number => math.log10(x),
  log2: (x: number): number => math.log2(x),

  // Trigonometry
  sin: (x: number): number => math.sine(x),
  cos: (x: number): number => math.cosine(x),
  tan: (x: number): number => math.tangent(x),
  asin: (x: number): number => math.arcsine(x),
  acos: (x: number): number => math.arccosine(x),
  atan: (x: number): number => math.arctangent(x),
  atan2: (y: number, x: number): number => math.arctan2(y, x),

  // Hyperbolic functions
  sinh: (x: number): number => math.sinh(x),
  cosh: (x: number): number => math.cosh(x),
  tanh: (x: number): number => math.tanh(x),

  // Special functions
  gamma: (x: number): number => math.gamma(x),
  beta: (a: number, b: number): number => math.beta(a, b),
  erf: (x: number): number => math.erf(x),
  erfc: (x: number): number => math.erfc(x),

  // Complex numbers
  complex: {
    create: (real: number, imaginary: number): Complex =>
      math.complexCreate(real, imaginary),
    add: (a: Complex, b: Complex): Complex => math.complexAdd(a, b),
    sub: (a: Complex, b: Complex): Complex => math.complexSubtract(a, b),
    mul: (a: Complex, b: Complex): Complex => math.complexMultiply(a, b),
    div: (a: Complex, b: Complex): Complex => math.complexDivide(a, b),
    abs: (a: Complex): number => math.complexAbsolute(a),
  },

  // Re-export domain-specific modules
  algebra: {
    vector: {
      create: (elements: number[]): Vector => math.vectorCreate(elements),
      dot: (a: Vector, b: Vector): number => math.vectorDotProduct(a, b),
      cross: (a: Vector, b: Vector): Vector => math.vectorCrossProduct(a, b),
      norm: (v: Vector, p: number = 2): number => math.vectorNorm(v, p),
      normalize: (v: Vector): Vector => math.vectorNormalize(v),
      add: (a: Vector, b: Vector): Vector => math.vectorAdd(a, b),
      sub: (a: Vector, b: Vector): Vector => math.vectorSubtract(a, b),
      scale: (v: Vector, s: number): Vector => math.vectorScale(v, s),
      sum: (v: Vector): number => math.vectorSum(v),
      mean: (v: Vector): number => math.vectorMean(v),
      variance: (v: Vector, population: boolean = false): number =>
        math.vectorVariance(v, population),
      std: (v: Vector, population: boolean = false): number =>
        math.vectorStandardDeviation(v, population),
      min: (v: Vector): number => math.vectorMin(v),
      max: (v: Vector): number => math.vectorMax(v),
    },
    matrix: {
      create: (elements: number[][]): Matrix => math.matrixCreate(elements),
      identity: (n: number): Matrix => math.matrixIdentity(n),
      zeros: (rows: number, cols: number): Matrix =>
        math.matrixZeros(rows, cols),
      ones: (rows: number, cols: number): Matrix => math.matrixOnes(rows, cols),
      transpose: (m: Matrix): Matrix => math.matrixTranspose(m),
      add: (a: Matrix, b: Matrix): Matrix => math.matrixAdd(a, b),
      sub: (a: Matrix, b: Matrix): Matrix => math.matrixSubtract(a, b),
      mul: (a: Matrix, b: Matrix): Matrix => math.matrixMultiply(a, b),
      scale: (m: Matrix, s: number): Matrix => math.matrixScalarMultiply(m, s),
      det: (m: Matrix): number => math.matrixDeterminant(m),
      inv: (m: Matrix): Matrix => math.matrixInverse(m),
      trace: (m: Matrix): number => math.matrixTrace(m),
    },
  },

  statistics: {
    mean: (data: Vector): number => math.mean(data),
    median: (data: Vector): number => math.median(data),
    variance: (data: Vector, population: boolean = false): number =>
      math.variance(data, population),
    std: (data: Vector, population: boolean = false): number =>
      math.standardDeviation(data, population),
    covariance: (a: Vector, b: Vector): number => math.covariance(a, b),
    correlation: (a: Vector, b: Vector): number => math.correlation(a, b),
  },

  probability: {
    normal: {
      pdf: (x: number, mean?: number, stddev?: number): number =>
        math.normalPDF(x, mean, stddev),
      cdf: (x: number, mean?: number, stddev?: number): number =>
        math.normalCDF(x, mean, stddev),
    },
  },

  random: {
    uniform: (count: number, min: number = 0, max: number = 1): Vector =>
      math.randomUniform(count, min, max),
    normal: (count: number, mean: number = 0, stddev: number = 1): Vector =>
      math.randomNormal(count, mean, stddev),
  },

  signal: {
    fft: (real: Vector, imag: Vector): [Vector, Vector] => math.fft(real, imag),
    convolve: (signal: Vector, kernel: Vector): Vector =>
      math.convolve(signal, kernel),
  },

  ml: {
    linearRegression: (X: Matrix, y: Vector): Vector =>
      math.linearRegression(X, y),
  },

  utils: {
    factorial: (n: number): number => math.factorial(n),
    nCr: (n: number, k: number): number => math.combinations(n, k),
    gcd: (a: number, b: number): number => math.gcd(a, b),
    lcm: (a: number, b: number): number => math.lcm(a, b),
  },
}

export default MathLibrary
