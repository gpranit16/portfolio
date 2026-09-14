# Churn Reaper — Product Identity & Core Pipeline

## Product Identity
- **Product Name**: Churn Reaper
- **Product Subtitle**: AI-Assisted Customer Churn Intelligence & Retention Decision System
- **GitHub Repository**: https://github.com/gpranit16/churn-reaper
- **Live Demo**: https://churn-reaper-y1d3.vercel.app
- **Core Narrative**: Predict → Explain → Recommend → Evaluate

## The Real-World Problem Solved
Traditional churn models only output a probability score (e.g. "82% churn risk"). But businesses need answers to four deeper questions:
1. **WHO?** → Which customers are at risk of churning?
2. **WHY?** → What specific friction points and drivers cause this customer's risk?
3. **WHAT ACTION?** → What personalized retention offer should be proposed?
4. **IS IT FINANCIALLY WORTH SAVING THEM?** → Does the expected economic value protected exceed the cost of the retention offer?

Churn Reaper bridges the gap between predictive ML, explainable AI, generative retention strategies, and deterministic financial economics.

## Core End-to-End Decision Pipeline
1. **Customer Data Input**: 19 demographic and service attributes (Tenure, MonthlyCharges, Contract, TechSupport, etc.).
2. **XGBoost Classifier**: Computes calibrated churn probability and assigns Risk Level (LOW <40%, MEDIUM 40–70%, HIGH >70%).
3. **TreeSHAP Attribution**: Computes exact feature contributions explaining *why* the customer is at risk.
4. **NVIDIA Nemotron (`nvidia/nemotron-3.5-lightning-30b-a3b`)**: Generates personalized retention offer candidates based on SHAP risk factors.
5. **Backend Financial Engine & Policy Guardrails**: Validates offer constraints, calculates intervention cost, revenue at risk, profit at risk, scenario value protected, net benefit, and expected ROI.
6. **Automated Business Decision**: Outputs **RETAIN CUSTOMER** if Net Benefit > 0, or **DO NOT SPEND** if Net Benefit ≤ 0.
