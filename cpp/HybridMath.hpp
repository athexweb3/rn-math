#pragma once

#include "HybridMathSpec.hpp"
#include <vector>
#include <array>
#include <tuple>
#include <optional>
#include <memory>

namespace margelo::nitro::rnmath {

class HybridMath : public HybridMathSpec {
private:

    inline static constexpr auto TAG = "Math";

    // Helper methods
    void validateMatrix(const std::vector<std::vector<double>>& matrix);
    bool isSquareMatrix(const std::vector<std::vector<double>>& matrix);

public:
    HybridMath();


public:

    double add(double a, double b) override;
    double subtract(double a, double b) override;
    double multiply(double a, double b) override;
    double divide(double a, double b) override;
    

    double power(double base, double exponent) override;
    double squareRoot(double x) override;
    double absolute(double x) override;
    double exponential(double x) override;
    double naturalLog(double x) override;
    double log10(double x) override;
    double log2(double x) override;
    

    double sine(double x) override;
    double cosine(double x) override;
    double tangent(double x) override;
    double arcsine(double x) override;
    double arccosine(double x) override;
    double arctangent(double x) override;
    double arctan2(double y, double x) override;
    

    double sinh(double x) override;
    double cosh(double x) override;
    double tanh(double x) override;
    

    double gamma(double x) override;
    double beta(double a, double b) override;
    double erf(double x) override;
    double erfc(double x) override;
    

    std::tuple<double, double> complexCreate(double real, double imaginary) override;
    std::tuple<double, double> complexAdd(const std::tuple<double, double>& a, const std::tuple<double, double>& b) override;
    std::tuple<double, double> complexSubtract(const std::tuple<double, double>& a, const std::tuple<double, double>& b) override;
    std::tuple<double, double> complexMultiply(const std::tuple<double, double>& a, const std::tuple<double, double>& b) override;
    std::tuple<double, double> complexDivide(const std::tuple<double, double>& a, const std::tuple<double, double>& b) override;
    double complexAbsolute(const std::tuple<double, double>& a) override;
    

    std::vector<double> vectorCreate(const std::vector<double>& elements) override;
    double vectorDotProduct(const std::vector<double>& a, const std::vector<double>& b) override;
    std::vector<double> vectorCrossProduct(const std::vector<double>& a, const std::vector<double>& b) override;
    double vectorNorm(const std::vector<double>& vector, std::optional<double> p) override;
    std::vector<double> vectorNormalize(const std::vector<double>& vector) override;
    std::vector<double> vectorAdd(const std::vector<double>& a, const std::vector<double>& b) override;
    std::vector<double> vectorSubtract(const std::vector<double>& a, const std::vector<double>& b) override;
    std::vector<double> vectorScale(const std::vector<double>& vector, double scalar) override;
    double vectorSum(const std::vector<double>& vector) override;
    double vectorMean(const std::vector<double>& vector) override;
    double vectorVariance(const std::vector<double>& vector, std::optional<bool> population) override;
    double vectorStandardDeviation(const std::vector<double>& vector, std::optional<bool> population) override;
    double vectorMin(const std::vector<double>& vector) override;
    double vectorMax(const std::vector<double>& vector) override;
    

    std::vector<std::vector<double>> matrixCreate(const std::vector<std::vector<double>>& elements) override;
    std::vector<std::vector<double>> matrixIdentity(double size) override;
    std::vector<std::vector<double>> matrixZeros(double rows, double cols) override;
    std::vector<std::vector<double>> matrixOnes(double rows, double cols) override;
    std::vector<std::vector<double>> matrixTranspose(const std::vector<std::vector<double>>& matrix) override;
    std::vector<std::vector<double>> matrixAdd(const std::vector<std::vector<double>>& a, const std::vector<std::vector<double>>& b) override;
    std::vector<std::vector<double>> matrixSubtract(const std::vector<std::vector<double>>& a, const std::vector<std::vector<double>>& b) override;
    std::vector<std::vector<double>> matrixMultiply(const std::vector<std::vector<double>>& a, const std::vector<std::vector<double>>& b) override;
    std::vector<std::vector<double>> matrixScalarMultiply(const std::vector<std::vector<double>>& matrix, double scalar) override;
    double matrixDeterminant(const std::vector<std::vector<double>>& matrix) override;
    std::vector<std::vector<double>> matrixInverse(const std::vector<std::vector<double>>& matrix) override;
    double matrixTrace(const std::vector<std::vector<double>>& matrix) override;
    

    double mean(const std::vector<double>& data) override;
    double median(const std::vector<double>& data) override;
    double variance(const std::vector<double>& data, std::optional<bool> population) override;
    double standardDeviation(const std::vector<double>& data, std::optional<bool> population) override;
    double covariance(const std::vector<double>& a, const std::vector<double>& b) override;
    double correlation(const std::vector<double>& a, const std::vector<double>& b) override;
    

    double normalPDF(double x, std::optional<double> mean, std::optional<double> stddev) override;
    double normalCDF(double x, std::optional<double> mean, std::optional<double> stddev) override;
    

    std::vector<double> randomUniform(double count, std::optional<double> min, std::optional<double> max) override;
    std::vector<double> randomNormal(double count, std::optional<double> mean, std::optional<double> stddev) override;
    

    std::tuple<std::vector<double>, std::vector<double>> fft(const std::vector<double>& real, const std::vector<double>& imag) override;
    std::vector<double> convolve(const std::vector<double>& signal, const std::vector<double>& kernel) override;
    

    std::vector<double> linearRegression(const std::vector<std::vector<double>>& X, const std::vector<double>& y) override;
    

    double factorial(double n) override;
    double combinations(double n, double k) override;
    double gcd(double a, double b) override;
    double lcm(double a, double b) override;
    
};

} // namespace margelo::nitro::rnmath
