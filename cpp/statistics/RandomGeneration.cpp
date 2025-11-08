#include "../HybridMath.hpp"
#include <stdexcept>
#include <random>

namespace margelo::nitro::rnmath {


std::vector<double> HybridMath::randomUniform(double count, std::optional<double> min, std::optional<double> max) {
    int n = static_cast<int>(count);
    if (n <= 0) throw std::runtime_error("Count must be positive");
    
    double min_val = min.value_or(0.0);
    double max_val = max.value_or(1.0);
    
    if (min_val >= max_val) throw std::runtime_error("Min must be less than max");
    
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_real_distribution<double> dist(min_val, max_val);
    
    std::vector<double> result(n);
    for (int i = 0; i < n; i++) {
        result[i] = dist(gen);
    }
    return result;
}

std::vector<double> HybridMath::randomNormal(double count, std::optional<double> mean, std::optional<double> stddev) {
    int n = static_cast<int>(count);
    if (n <= 0) throw std::runtime_error("Count must be positive");
    
    double mean_val = mean.value_or(0.0);
    double stddev_val = stddev.value_or(1.0);
    
    if (stddev_val <= 0) throw std::runtime_error("Standard deviation must be positive");
    
    std::random_device rd;
    std::mt19937 gen(rd());
    std::normal_distribution<double> dist(mean_val, stddev_val);
    
    std::vector<double> result(n);
    for (int i = 0; i < n; i++) {
        result[i] = dist(gen);
    }
    return result;
}

} // namespace margelo::nitro::rnmath
