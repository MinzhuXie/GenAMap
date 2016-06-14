//// Created by aditya gautam on 4/2/16.//#ifndef ALGORITHMS_GRIDSEARCH_HPP#define ALGORITHMS_GRIDSEARCH_HPP#include <iostream>#include <vector>#include <math.h>#include <cstdlib>#include <iostream>#ifdef BAZEL#include "algorithm/Algorithm.hpp"#include "model/LinearMixedModel.hpp"#else#include "Algorithm.hpp"//#include "AlgorithmOptions.hpp"#include "../model/LinearMixedModel.hpp"#endifusing namespace std;class GridSearch:public Algorithm{private:    // Lambda interval and boundary dimensions    double lambda_start_point;    double lambda_end_point;    double lambda_interval;    void shift_lambda_window(double);public:    // Default constructor    GridSearch();    // Parameters related to lambda variation    void set_lambda_params(double, double, double);    void set_lambda_start_value(double);    void set_lambda_end_value(double);    void set_lambda_interval(double);    double get_lambda_interval();    double get_lambda_start_value();    double get_lambda_end_value();    void run(LinearMixedModel *);};#endif