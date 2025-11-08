#include "HybridMath.hpp"
#include <stdexcept>
#include <vector>
#include <cmath>

namespace margelo::nitro::rnmath {


std::vector<std::vector<double>> HybridMath::matrixCreate(const std::vector<std::vector<double>>& elements) {
    return elements;
}

std::vector<std::vector<double>> HybridMath::matrixIdentity(double size) {
    int n = static_cast<int>(size);
    if (n <= 0) throw std::runtime_error("Matrix size must be positive");
    
    std::vector<std::vector<double>> result(n, std::vector<double>(n, 0.0));
    for (int i = 0; i < n; i++) {
        result[i][i] = 1.0;
    }
    return result;
}

std::vector<std::vector<double>> HybridMath::matrixZeros(double rows, double cols) {
    int r = static_cast<int>(rows);
    int c = static_cast<int>(cols);
    if (r <= 0 || c <= 0) throw std::runtime_error("Matrix dimensions must be positive");
    return std::vector<std::vector<double>>(r, std::vector<double>(c, 0.0));
}

std::vector<std::vector<double>> HybridMath::matrixOnes(double rows, double cols) {
    int r = static_cast<int>(rows);
    int c = static_cast<int>(cols);
    if (r <= 0 || c <= 0) throw std::runtime_error("Matrix dimensions must be positive");
    return std::vector<std::vector<double>>(r, std::vector<double>(c, 1.0));
}

std::vector<std::vector<double>> HybridMath::matrixTranspose(const std::vector<std::vector<double>>& matrix) {
    validateMatrix(matrix);
    
    size_t rows = matrix.size();
    size_t cols = matrix[0].size();
    
    std::vector<std::vector<double>> result(cols, std::vector<double>(rows));
    for (size_t i = 0; i < rows; i++) {
        for (size_t j = 0; j < cols; j++) {
            result[j][i] = matrix[i][j];
        }
    }
    return result;
}

std::vector<std::vector<double>> HybridMath::matrixAdd(const std::vector<std::vector<double>>& a, const std::vector<std::vector<double>>& b) {
    validateMatrix(a);
    validateMatrix(b);
    
    if (a.size() != b.size() || a[0].size() != b[0].size()) {
        throw std::runtime_error("Matrix dimensions must match for addition");
    }
    
    size_t rows = a.size();
    size_t cols = a[0].size();
    std::vector<std::vector<double>> result(rows, std::vector<double>(cols));
    
    for (size_t i = 0; i < rows; i++) {
        for (size_t j = 0; j < cols; j++) {
            result[i][j] = a[i][j] + b[i][j];
        }
    }
    return result;
}

std::vector<std::vector<double>> HybridMath::matrixSubtract(const std::vector<std::vector<double>>& a, const std::vector<std::vector<double>>& b) {
    validateMatrix(a);
    validateMatrix(b);
    
    if (a.size() != b.size() || a[0].size() != b[0].size()) {
        throw std::runtime_error("Matrix dimensions must match for subtraction");
    }
    
    size_t rows = a.size();
    size_t cols = a[0].size();
    std::vector<std::vector<double>> result(rows, std::vector<double>(cols));
    
    for (size_t i = 0; i < rows; i++) {
        for (size_t j = 0; j < cols; j++) {
            result[i][j] = a[i][j] - b[i][j];
        }
    }
    return result;
}

std::vector<std::vector<double>> HybridMath::matrixMultiply(const std::vector<std::vector<double>>& a, const std::vector<std::vector<double>>& b) {
    validateMatrix(a);
    validateMatrix(b);
    
    size_t a_rows = a.size();
    size_t a_cols = a[0].size();
    size_t b_rows = b.size();
    size_t b_cols = b[0].size();
    
    if (a_cols != b_rows) {
        throw std::runtime_error("Matrix dimensions incompatible for multiplication");
    }
    
    std::vector<std::vector<double>> result(a_rows, std::vector<double>(b_cols, 0.0));
    
    for (size_t i = 0; i < a_rows; i++) {
        for (size_t j = 0; j < b_cols; j++) {
            for (size_t k = 0; k < a_cols; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return result;
}

std::vector<std::vector<double>> HybridMath::matrixScalarMultiply(const std::vector<std::vector<double>>& matrix, double scalar) {
    validateMatrix(matrix);
    
    size_t rows = matrix.size();
    size_t cols = matrix[0].size();
    std::vector<std::vector<double>> result(rows, std::vector<double>(cols));
    
    for (size_t i = 0; i < rows; i++) {
        for (size_t j = 0; j < cols; j++) {
            result[i][j] = matrix[i][j] * scalar;
        }
    }
    return result;
}

double HybridMath::matrixDeterminant(const std::vector<std::vector<double>>& matrix) {
    if (!isSquareMatrix(matrix)) {
        throw std::runtime_error("Matrix must be square for determinant calculation");
    }
    
    size_t n = matrix.size();
    
    // Simple implementation for 1x1, 2x2, 3x3 matrices
    if (n == 1) {
        return matrix[0][0];
    } else if (n == 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    } else if (n == 3) {
        return matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
               matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
               matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
    } else {
        throw std::runtime_error("Determinant only implemented for 1x1, 2x2, 3x3 matrices");
    }
}

std::vector<std::vector<double>> HybridMath::matrixInverse(const std::vector<std::vector<double>>& matrix) {
    if (!isSquareMatrix(matrix)) {
        throw std::runtime_error("Matrix must be square for inverse calculation");
    }
    
    size_t n = matrix.size();
    double det = matrixDeterminant(matrix);
    
    if (det == 0) {
        throw std::runtime_error("Matrix is singular, cannot compute inverse");
    }
    

    if (n == 2) {
        std::vector<std::vector<double>> inverse(2, std::vector<double>(2));
        inverse[0][0] = matrix[1][1] / det;
        inverse[0][1] = -matrix[0][1] / det;
        inverse[1][0] = -matrix[1][0] / det;
        inverse[1][1] = matrix[0][0] / det;
        return inverse;
    } else {
        throw std::runtime_error("Matrix inverse only implemented for 2x2 matrices");
    }
}

double HybridMath::matrixTrace(const std::vector<std::vector<double>>& matrix) {
    if (!isSquareMatrix(matrix)) {
        throw std::runtime_error("Matrix must be square for trace calculation");
    }
    
    double trace = 0.0;
    for (size_t i = 0; i < matrix.size(); i++) {
        trace += matrix[i][i];
    }
    return trace;
}

} // namespace margelo::nitro::rnmath
