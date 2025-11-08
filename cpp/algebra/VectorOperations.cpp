#include "HybridMath.hpp"
#include <stdexcept>
#include <algorithm>
#include <numeric>
#include <cmath>

namespace margelo::nitro::rnmath {


std::vector<double> HybridMath::vectorCreate(const std::vector<double>& elements) {
    return elements;
}

double HybridMath::vectorDotProduct(const std::vector<double>& a, const std::vector<double>& b) {
    if (a.size() != b.size()) {
        throw std::runtime_error("Vectors must have same size for dot product");
    }
    
    double result = 0.0;
    for (size_t i = 0; i < a.size(); i++) {
        result += a[i] * b[i];
    }
    return result;
}

std::vector<double> HybridMath::vectorCrossProduct(const std::vector<double>& a, const std::vector<double>& b) {
    if (a.size() != 3 || b.size() != 3) {
        throw std::runtime_error("Cross product requires 3D vectors");
    }
    
    return {
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    };
}

double HybridMath::vectorNorm(const std::vector<double>& vector, std::optional<double> p) {
    if (vector.empty()) return 0.0;
    
    double p_val = p.value_or(2.0); // Default to L2 norm
    
    if (p_val == 2.0) {
        double sum = 0.0;
        for (double value : vector) {
            sum += value * value;
        }
        return std::sqrt(sum);
    } else if (p_val == 1.0) {
        double sum = 0.0;
        for (double value : vector) {
            sum += std::abs(value);
        }
        return sum;
    } else if (p_val == std::numeric_limits<double>::infinity()) {
        double max_val = 0.0;
        for (double value : vector) {
            max_val = std::max(max_val, std::abs(value));
        }
        return max_val;
    } else {
        double sum = 0.0;
        for (double value : vector) {
            sum += std::pow(std::abs(value), p_val);
        }
        return std::pow(sum, 1.0 / p_val);
    }
}

std::vector<double> HybridMath::vectorNormalize(const std::vector<double>& vector) {
    double norm = vectorNorm(vector, 2.0);
    if (norm == 0.0) return vector;
    
    std::vector<double> result(vector.size());
    for (size_t i = 0; i < vector.size(); i++) {
        result[i] = vector[i] / norm;
    }
    return result;
}

std::vector<double> HybridMath::vectorAdd(const std::vector<double>& a, const std::vector<double>& b) {
    if (a.size() != b.size()) {
        throw std::runtime_error("Vectors must have same size for addition");
    }
    
    std::vector<double> result(a.size());
    for (size_t i = 0; i < a.size(); i++) {
        result[i] = a[i] + b[i];
    }
    return result;
}

std::vector<double> HybridMath::vectorSubtract(const std::vector<double>& a, const std::vector<double>& b) {
    if (a.size() != b.size()) {
        throw std::runtime_error("Vectors must have same size for subtraction");
    }
    
    std::vector<double> result(a.size());
    for (size_t i = 0; i < a.size(); i++) {
        result[i] = a[i] - b[i];
    }
    return result;
}

std::vector<double> HybridMath::vectorScale(const std::vector<double>& vector, double scalar) {
    std::vector<double> result(vector.size());
    for (size_t i = 0; i < vector.size(); i++) {
        result[i] = vector[i] * scalar;
    }
    return result;
}

double HybridMath::vectorSum(const std::vector<double>& vector) {
    return std::accumulate(vector.begin(), vector.end(), 0.0);
}

double HybridMath::vectorMean(const std::vector<double>& vector) {
    if (vector.empty()) return 0.0;
    return vectorSum(vector) / vector.size();
}

double HybridMath::vectorVariance(const std::vector<double>& vector, std::optional<bool> population) {
    if (vector.empty()) return 0.0;
    
    bool pop = population.value_or(false); // Default to sample variance
    double mean = vectorMean(vector);
    double sum_sq = 0.0;
    for (double value : vector) {
        sum_sq += (value - mean) * (value - mean);
    }
    
    return pop ? sum_sq / vector.size() : sum_sq / (vector.size() - 1);
}

double HybridMath::vectorStandardDeviation(const std::vector<double>& vector, std::optional<bool> population) {
    return std::sqrt(vectorVariance(vector, population));
}

double HybridMath::vectorMin(const std::vector<double>& vector) {
    if (vector.empty()) throw std::runtime_error("Cannot find min of empty vector");
    return *std::min_element(vector.begin(), vector.end());
}

double HybridMath::vectorMax(const std::vector<double>& vector) {
    if (vector.empty()) throw std::runtime_error("Cannot find max of empty vector");
    return *std::max_element(vector.begin(), vector.end());
}

} // namespace margelo::nitro::rnmath
