#include "HybridMath.hpp"
#include <stdexcept>
#include <algorithm>
#include <numeric>
#include <cmath>

namespace margelo::nitro::rnmath {


double HybridMath::mean(const std::vector<double>& data) {
    if (data.empty()) return 0.0;
    return std::accumulate(data.begin(), data.end(), 0.0) / data.size();
}

double HybridMath::median(const std::vector<double>& data) {
    if (data.empty()) throw std::runtime_error("Cannot find median of empty data");
    
    std::vector<double> sorted = data;
    std::sort(sorted.begin(), sorted.end());
    
    size_t n = sorted.size();
    if (n % 2 == 0) {
        return (sorted[n/2 - 1] + sorted[n/2]) / 2.0;
    } else {
        return sorted[n/2];
    }
}

double HybridMath::variance(const std::vector<double>& data, std::optional<bool> population) {
    return vectorVariance(data, population);
}

double HybridMath::standardDeviation(const std::vector<double>& data, std::optional<bool> population) {
    return vectorStandardDeviation(data, population);
}

double HybridMath::covariance(const std::vector<double>& a, const std::vector<double>& b) {
    if (a.size() != b.size()) {
        throw std::runtime_error("Vectors must have same size for covariance");
    }
    if (a.empty()) return 0.0;
    
    double mean_a = mean(a);
    double mean_b = mean(b);
    double sum = 0.0;
    
    for (size_t i = 0; i < a.size(); i++) {
        sum += (a[i] - mean_a) * (b[i] - mean_b);
    }
    
    return sum / (a.size() - 1); // Sample covariance
}

double HybridMath::correlation(const std::vector<double>& a, const std::vector<double>& b) {
    double cov = covariance(a, b);
    double std_a = standardDeviation(a, false);
    double std_b = standardDeviation(b, false);
    
    if (std_a == 0 || std_b == 0) return 0.0;
    return cov / (std_a * std_b);
}

} // namespace margelo::nitro::rnmath
