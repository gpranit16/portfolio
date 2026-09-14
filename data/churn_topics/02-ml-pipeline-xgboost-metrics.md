# Churn Reaper — ML Model Architecture, Optimization & Metrics

## Dataset Benchmark
- **Dataset**: Telco Customer Churn benchmark (7,043 customer accounts).
- **Features**: 19 demographic and service attributes (`tenure`, `MonthlyCharges`, `TotalCharges`, `Contract`, `InternetService`, `OnlineSecurity`, `OnlineBackup`, `TechSupport`, `PaymentMethod`, etc.).
- **Target**: `Churn` (1 = Churned, 0 = Retained). Customer IDs removed, numeric conversions applied.

## Current Selected Model: Regularized XGBoost (No SMOTE)
- **Hyperparameters**:
  - `max_depth = 3`
  - `learning_rate = 0.05`
  - `n_estimators = 150`
  - `subsample = 0.8`
  - `colsample_bytree = 0.8`
  - `gamma = 0.5`
  - `reg_alpha = 0.5`
  - `reg_lambda = 1.5`
  - `threshold = 0.35` (optimized decision boundary for sensitive churn detection)

## Model Comparison: Baseline vs. Optimized
| Metric | Baseline (XGBoost + SMOTE) | Optimized (Regularized XGBoost, No SMOTE) |
| :--- | :--- | :--- |
| **ROC-AUC** | 82.06% | **84.81%** (+2.75%) |
| **Recall** | 61.23% | **71.66%** (+10.43%) |
| **F1-Score** | 58.94% | **63.13%** (+4.19%) |
| **Accuracy** | 77.36% | **77.79%** |
| **Missed Churners** | 145 customers | **106 customers** (Caught +39 additional churners) |

## Why Threshold = 0.35?
The default classification threshold of `0.50` misses customers who show moderate-to-high risk signals. In churn mitigation, a False Negative (losing a high-value customer without noticing) is far more costly than a False Positive (evaluating an offer for a customer who might stay). Lowering the threshold to `0.35` strategically increases Recall from 61.23% to 71.66%, capturing 39 additional at-risk customers.

## Risk Bands
- **LOW**: Churn Probability < 40%
- **MEDIUM**: Churn Probability 40% – 70%
- **HIGH**: Churn Probability > 70%
