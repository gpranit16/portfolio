# Churn Reaper — SHAP Explainability & NVIDIA Nemotron Retention

## TreeSHAP Risk Attribution
While XGBoost outputs *what* the churn probability is (e.g. 94.9%), SHAP explains *why*.
- **Local SHAP Attribution**: Calculates exact Shapley values for an individual customer, identifying top risk pushers (e.g. `+MonthlyCharges`, `+Month-to-month Contract`, `+No Tech Support`, `+No Online Security`) and protective factors (e.g. `-Partner`, `-Long Tenure`).
- **Global Feature Importance**: Evaluates dataset-wide drivers across all 7,043 customer rows, giving executive visibility into systemic churn drivers.

## NVIDIA Nemotron (`nvidia/nemotron-3.5-lightning-30b-a3b`)
- **Role**: Synthesizes customer profile, tenure, contract type, and top SHAP risk drivers to generate personalized retention candidates (e.g., "15% Loyalty Discount for 3 Months" or "Complimentary Tech Support & Security Bundle").
- **API Setup**: Configured securely on the FastAPI backend via OpenRouter API with zero keys exposed to client code.

## Critical Architectural Principle: AI Proposes, Backend Calculates
LLMs are unreliable calculators. Churn Reaper enforces strict separation of concerns:
- **NVIDIA AI**: Answers *WHAT retention offer to candidate?*
- **Backend Policy Validator**: Enforces business constraints (e.g. Max discount 15%, Max duration 3 months, Max support ₹30/mo, Max contract incentive ₹150 one-time). Any non-compliant LLM proposal is clamped or rejected.
- **Deterministic Financial Engine**: Computes exact intervention cost, expected value protected, net benefit, and ROI using mathematical formulas.
- **Decision Engine**: Recommends **RETAIN CUSTOMER** only when Net Benefit > 0.

## NVIDIA Failure Fallback System
If the NVIDIA API experiences network latency, rate limits, or an outage, the backend automatically engages a rule-based fallback matrix. The system generates compliant retention options without crashing with 500 errors, guaranteeing high operational resilience.
