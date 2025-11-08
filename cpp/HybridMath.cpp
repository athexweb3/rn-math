#include "HybridMath.hpp"
#include <stdexcept>
#include <cmath>
#include <algorithm>
#include <numeric>

namespace margelo::nitro::rnmath {


HybridMath::HybridMath() : HybridObject(TAG) {
    // 
}


double HybridMath::add(double a, double b) { return a + b; }
double HybridMath::subtract(double a, double b) { return a - b; }
double HybridMath::multiply(double a, double b) { return a * b; }
double HybridMath::divide(double a, double b) {
    if (b == 0.0) throw std::runtime_error("Division by zero");
    return a / b;
}


double HybridMath::power(double base, double exponent) { return std::pow(base, exponent); }
double HybridMath::squareRoot(double x) {
    if (x < 0) throw std::runtime_error("Square root of negative number");
    return std::sqrt(x);
}
double HybridMath::absolute(double x) { return std::fabs(x); }
double HybridMath::exponential(double x) { return std::exp(x); }
double HybridMath::naturalLog(double x) {
    if (x <= 0) throw std::runtime_error("Logarithm of non-positive number");
    return std::log(x);
}
double HybridMath::log10(double x) {
    if (x <= 0) throw std::runtime_error("Logarithm of non-positive number");
    return std::log10(x);
}
double HybridMath::log2(double x) {
    if (x <= 0) throw std::runtime_error("Logarithm of non-positive number");
    return std::log2(x);
}


double HybridMath::sine(double x) { return std::sin(x); }
double HybridMath::cosine(double x) { return std::cos(x); }
double HybridMath::tangent(double x) { return std::tan(x); }
double HybridMath::arcsine(double x) {
    if (x < -1.0 || x > 1.0) throw std::runtime_error("Arcsin argument out of range");
    return std::asin(x);
}
double HybridMath::arccosine(double x) {
    if (x < -1.0 || x > 1.0) throw std::runtime_error("Arccos argument out of range");
    return std::acos(x);
}
double HybridMath::arctangent(double x) { return std::atan(x); }
double HybridMath::arctan2(double y, double x) { return std::atan2(y, x); }


double HybridMath::sinh(double x) { return std::sinh(x); }
double HybridMath::cosh(double x) { return std::cosh(x); }
double HybridMath::tanh(double x) { return std::tanh(x); }


double HybridMath::gamma(double x) {
    // using standard library for robust gamma
    return std::tgamma(x);
}

double HybridMath::beta(double a, double b) {
    // Beta(a,b) = Gamma(a)*Gamma(b)/Gamma(a+b)
    double ga = std::tgamma(a);
    double gb = std::tgamma(b);
    double gab = std::tgamma(a + b);
    if (gab == 0.0) throw std::runtime_error("Invalid gamma in beta()");
    return (ga * gb) / gab;
}

double HybridMath::erf(double x) {
    return std::erf(x);
}

double HybridMath::erfc(double x) {
    return std::erfc(x);
}


std::tuple<double, double> HybridMath::complexCreate(double real, double imaginary) {
    return std::make_tuple(real, imaginary);
}

std::tuple<double, double> HybridMath::complexAdd(const std::tuple<double, double>& a, const std::tuple<double, double>& b) {
    double real = std::get<0>(a) + std::get<0>(b);
    double imag = std::get<1>(a) + std::get<1>(b);
    return std::make_tuple(real, imag);
}

std::tuple<double, double> HybridMath::complexSubtract(const std::tuple<double, double>& a, const std::tuple<double, double>& b) {
    double real = std::get<0>(a) - std::get<0>(b);
    double imag = std::get<1>(a) - std::get<1>(b);
    return std::make_tuple(real, imag);
}

std::tuple<double, double> HybridMath::complexMultiply(const std::tuple<double, double>& a, const std::tuple<double, double>& b) {
    double ar = std::get<0>(a), ai = std::get<1>(a);
    double br = std::get<0>(b), bi = std::get<1>(b);
    double real = ar * br - ai * bi;
    double imag = ar * bi + ai * br;
    return std::make_tuple(real, imag);
}

std::tuple<double, double> HybridMath::complexDivide(const std::tuple<double, double>& a, const std::tuple<double, double>& b) {
    double ar = std::get<0>(a), ai = std::get<1>(a);
    double br = std::get<0>(b), bi = std::get<1>(b);
    double denom = br*br + bi*bi;
    if (denom == 0.0) throw std::runtime_error("Complex division by zero");
    double real = (ar * br + ai * bi) / denom;
    double imag = (ai * br - ar * bi) / denom;
    return std::make_tuple(real, imag);
}

double HybridMath::complexAbsolute(const std::tuple<double, double>& a) {
    double real = std::get<0>(a);
    double imag = std::get<1>(a);
    return std::sqrt(real * real + imag * imag);
}

// === HELPER METHODS ===
void HybridMath::validateMatrix(const std::vector<std::vector<double>>& matrix) {
    if (matrix.empty()) throw std::runtime_error("Matrix is empty");
    size_t cols = matrix[0].size();
    for (const auto& row : matrix) {
        if (row.size() != cols) {
            throw std::runtime_error("Matrix has inconsistent row sizes");
        }
    }
}

bool HybridMath::isSquareMatrix(const std::vector<std::vector<double>>& matrix) {
    validateMatrix(matrix);
    return matrix.size() == matrix[0].size();
}

} // namespace margelo::nitro::rnmath
