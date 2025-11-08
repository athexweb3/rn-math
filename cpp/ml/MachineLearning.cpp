#include "HybridMath.hpp"
#include <stdexcept>
#include <vector>

namespace margelo::nitro::rnmath {

std::vector<double> HybridMath::linearRegression(const std::vector<std::vector<double>>& X, const std::vector<double>& y) {
    
    // Simple linear regression for y = mx + b
    if (X.size() != y.size()) {
        throw std::runtime_error("X and y must have same number of samples");
    }
    
    if (X.empty()) {
        throw std::runtime_error("Cannot perform regression on empty data");
    }
    
    // For simple case: assume X has one feature per sample
    double sum_x = 0.0, sum_y = 0.0, sum_xy = 0.0, sum_xx = 0.0;
    size_t n = X.size();
    
    for (size_t i = 0; i < n; i++) {
        if (X[i].size() != 1) {
            throw std::runtime_error("Only single feature regression implemented");
        }
        
        double x_val = X[i][0];
        double y_val = y[i];
        
        sum_x += x_val;
        sum_y += y_val;
        sum_xy += x_val * y_val;
        sum_xx += x_val * x_val;
    }
    
    double denominator = n * sum_xx - sum_x * sum_x;
    if (denominator == 0) {
        throw std::runtime_error("Cannot compute regression for collinear data");
    }
    
    double slope = (n * sum_xy - sum_x * sum_y) / denominator;
    double intercept = (sum_y - slope * sum_x) / n;
    
    return {slope, intercept};
}

} // namespace margelo::nitro::rnmath
