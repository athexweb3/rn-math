// src/specs/Math.nitro.ts
import type { HybridObject } from 'react-native-nitro-modules'

export type Vector = number[]
export type Matrix = number[][]
export type Complex = [number, number]

export interface Math
  extends HybridObject<{
    ios: 'c++'
    android: 'c++'
  }> {
  // === BASIC ARITHMETIC ===
  add(a: number, b: number): number
  subtract(a: number, b: number): number
  multiply(a: number, b: number): number
  divide(a: number, b: number): number

  // === ADVANCED SCALAR FUNCTIONS ===
  power(base: number, exponent: number): number
  squareRoot(x: number): number
  absolute(x: number): number
  exponential(x: number): number
  naturalLog(x: number): number
  log10(x: number): number
  log2(x: number): number

  // === TRIGONOMETRY ===
  sine(x: number): number
  cosine(x: number): number
  tangent(x: number): number
  arcsine(x: number): number
  arccosine(x: number): number
  arctangent(x: number): number
  arctan2(y: number, x: number): number

  // === HYPERBOLIC FUNCTIONS ===
  sinh(x: number): number
  cosh(x: number): number
  tanh(x: number): number

  // === SPECIAL FUNCTIONS ===
  gamma(x: number): number
  beta(a: number, b: number): number
  erf(x: number): number
  erfc(x: number): number

  // === COMPLEX NUMBERS ===
  complexCreate(real: number, imaginary: number): Complex
  complexAdd(a: Complex, b: Complex): Complex
  complexSubtract(a: Complex, b: Complex): Complex
  complexMultiply(a: Complex, b: Complex): Complex
  complexDivide(a: Complex, b: Complex): Complex
  complexAbsolute(a: Complex): number

  // === VECTOR OPERATIONS ===
  vectorCreate(elements: number[]): Vector
  vectorDotProduct(a: Vector, b: Vector): number
  vectorCrossProduct(a: Vector, b: Vector): Vector
  vectorNorm(vector: Vector, p?: number): number
  vectorNormalize(vector: Vector): Vector
  vectorAdd(a: Vector, b: Vector): Vector
  vectorSubtract(a: Vector, b: Vector): Vector
  vectorScale(vector: Vector, scalar: number): Vector
  vectorSum(vector: Vector): number
  vectorMean(vector: Vector): number
  vectorVariance(vector: Vector, population?: boolean): number
  vectorStandardDeviation(vector: Vector, population?: boolean): number
  vectorMin(vector: Vector): number
  vectorMax(vector: Vector): number

  // === MATRIX OPERATIONS ===
  matrixCreate(elements: number[][]): Matrix
  matrixIdentity(size: number): Matrix
  matrixZeros(rows: number, cols: number): Matrix
  matrixOnes(rows: number, cols: number): Matrix
  matrixTranspose(matrix: Matrix): Matrix
  matrixAdd(a: Matrix, b: Matrix): Matrix
  matrixSubtract(a: Matrix, b: Matrix): Matrix
  matrixMultiply(a: Matrix, b: Matrix): Matrix
  matrixScalarMultiply(matrix: Matrix, scalar: number): Matrix
  matrixDeterminant(matrix: Matrix): number
  matrixInverse(matrix: Matrix): Matrix
  matrixTrace(matrix: Matrix): number

  // === STATISTICS & PROBABILITY ===
  mean(data: Vector): number
  median(data: Vector): number
  variance(data: Vector, population?: boolean): number
  standardDeviation(data: Vector, population?: boolean): number
  covariance(a: Vector, b: Vector): number
  correlation(a: Vector, b: Vector): number

  // === PROBABILITY DISTRIBUTIONS ===
  normalPDF(x: number, mean?: number, stddev?: number): number
  normalCDF(x: number, mean?: number, stddev?: number): number

  // === RANDOM NUMBER GENERATION ===
  randomUniform(count: number, min?: number, max?: number): Vector
  randomNormal(count: number, mean?: number, stddev?: number): Vector

  // === SIGNAL PROCESSING ===
  fft(real: Vector, imag: Vector): [Vector, Vector]
  convolve(signal: Vector, kernel: Vector): Vector

  // === MACHINE LEARNING ===
  linearRegression(X: Matrix, y: Vector): Vector

  // === UTILITIES ===
  factorial(n: number): number
  combinations(n: number, k: number): number
  gcd(a: number, b: number): number
  lcm(a: number, b: number): number
}
