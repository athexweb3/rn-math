#include "HybridMath.hpp"
#include <stdexcept>
#include <cmath>

namespace margelo::nitro::rnmath {


double HybridMath::factorial(double n) {
    int n_int = static_cast<int>(n);
    if (n_int < 0) throw std::runtime_error("Factorial of negative number");
    if (n_int > 20) throw std::runtime_error("Factorial too large for 64-bit integer");
    
    long long result = 1;
    for (int i = 2; i <= n_int; i++) {
        result *= i;
    }
    return static_cast<double>(result);
}

double HybridMath::combinations(double n, double k) {
    int n_int = static_cast<int>(n);
    int k_int = static_cast<int>(k);
    
    if (n_int < 0 || k_int < 0 || k_int > n_int) throw std::runtime_error("Invalid combination parameters");
    return static_cast<double>(factorial(n_int) / (factorial(k_int) * factorial(n_int - k_int)));
}

double HybridMath::gcd(double a, double b) {
    long long a_int = static_cast<long long>(a);
    long long b_int = static_cast<long long>(b);
    
    while (b_int != 0) {
        long long temp = b_int;
        b_int = a_int % b_int;
        a_int = temp;
    }
    return static_cast<double>(a_int);
}

double HybridMath::lcm(double a, double b) {
    long long a_int = static_cast<long long>(a);
    long long b_int = static_cast<long long>(b);
    
    return static_cast<double>((a_int / static_cast<long long>(gcd(a_int, b_int))) * b_int);
}

} // namespace margelo::nitro::rnmath
