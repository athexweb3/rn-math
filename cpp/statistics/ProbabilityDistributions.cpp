#include "../HybridMath.hpp"
#include <stdexcept>
#include <cmath>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

namespace margelo::nitro::rnmath {


double HybridMath::normalPDF(double x, std::optional<double> mean, std::optional<double> stddev) {
    double mean_val = mean.value_or(0.0);
    double stddev_val = stddev.value_or(1.0);
    
    if (stddev_val <= 0) throw std::runtime_error("Standard deviation must be positive");
    double exponent = -0.5 * std::pow((x - mean_val) / stddev_val, 2);
    return std::exp(exponent) / (stddev_val * std::sqrt(2 * M_PI));
}

double HybridMath::normalCDF(double x, std::optional<double> mean, std::optional<double> stddev) {
    double mean_val = mean.value_or(0.0);
    double stddev_val = stddev.value_or(1.0);
    
    return 0.5 * (1 + erf((x - mean_val) / (stddev_val * std::sqrt(2))));
}

} // namespace margelo::nitro::rnmath
