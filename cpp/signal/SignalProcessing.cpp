#include "HybridMath.hpp"
#include <stdexcept>
#include <vector>
#include <tuple>
#include <cmath>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

namespace margelo::nitro::rnmath {


std::tuple<std::vector<double>, std::vector<double>> HybridMath::fft(const std::vector<double>& real, const std::vector<double>& imag) {
    // Simple DFT implementation (not optimized FFT)
    size_t N = real.size();
    if (N != imag.size()) {
        throw std::runtime_error("Real and imaginary parts must have same size");
    }
    
    std::vector<double> result_real(N);
    std::vector<double> result_imag(N);
    
    for (size_t k = 0; k < N; k++) {
        double real_sum = 0.0;
        double imag_sum = 0.0;
        
        for (size_t n = 0; n < N; n++) {
            double angle = -2.0 * M_PI * k * n / N;
            double cos_val = std::cos(angle);
            double sin_val = std::sin(angle);
            
            real_sum += real[n] * cos_val - imag[n] * sin_val;
            imag_sum += real[n] * sin_val + imag[n] * cos_val;
        }
        
        result_real[k] = real_sum;
        result_imag[k] = imag_sum;
    }
    
    return std::make_tuple(result_real, result_imag);
}

std::vector<double> HybridMath::convolve(const std::vector<double>& signal, const std::vector<double>& kernel) {
    size_t signal_size = signal.size();
    size_t kernel_size = kernel.size();
    if (signal_size == 0 || kernel_size == 0) {
        return std::vector<double>();
    }
    
    std::vector<double> result(signal_size + kernel_size - 1, 0.0);
    
    for (size_t i = 0; i < signal_size; i++) {
        for (size_t j = 0; j < kernel_size; j++) {
            result[i + j] += signal[i] * kernel[j];
        }
    }
    
    return result;
}

} // namespace margelo::nitro::rnmath
