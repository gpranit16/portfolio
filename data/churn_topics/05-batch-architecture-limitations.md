# Churn Reaper — Batch Dataset Analysis, Architecture & Limitations

## Dataset Analysis Mode & ROI Simulator
- **Dataset Analysis Mode**: Upload any CSV (e.g. 7,043 Telco records), automatically infer schema, train/load XGBoost model, score entire cohorts in batch, and search/filter/sort by churn probability or risk band. Clicking "View" opens the exact customer row in the Single Customer view for SHAP and retention breakdown.
- **On-Demand LLM Execution**: Dataset batch mode executes fast, lightweight ML inference on all rows without making thousands of redundant LLM calls. NVIDIA Nemotron retention analysis runs on-demand when inspecting individual accounts.
- **ROI Simulator**: Enables marketing and finance teams to model cohort-level retention campaigns (e.g. 100 High-Risk accounts at ₹50 intervention cost) to project aggregate saved ARR.

## Backend Architecture (FastAPI)
- `main.py`: API gateway with CORS, health checks, and route definitions.
- `predict.py`: Preprocessing pipeline, model inference, and dataset batch scoring.
- `explainer.py`: TreeSHAP local attribution and global importance calculations.
- `nvidia_retention.py`: NVIDIA Nemotron integration, prompt crafting, and response parsing.
- `retention_config.py`: Central business constraints, policy limits, margin defaults, and planning horizons.
- `recommendations.py`: Deterministic financial calculations (Cost, Profit-at-Risk, Value Protected, Net Benefit, ROI).

## Core Endpoints
- `POST /predict`: Generates churn probability, risk level, and SHAP drivers.
- `POST /customer-retention-strategy`: Evaluates NVIDIA retention candidate against financial constraints.
- `POST /dataset-analysis`: Batch processes uploaded CSV records.
- `GET /feature-importance`: Returns dataset-level global SHAP rankings.
- `GET /health`: Health status and model readiness.

## Honest Limitations & Planning Assumptions
1. **Scenario-Based Assumptions**: Success rates (20% for discount, 15% for support, 25% for contract) are configured planning assumptions, not causal treatment effects, because the benchmark Telco dataset does not contain historical intervention logs.
2. **Benchmark Dataset**: The benchmark is trained on 7,043 Telco records; production enterprise deployment would integrate company-specific CRM/billing logs.
3. **Uplift Modeling Roadmap**: The natural future evolution of Churn Reaper is causal Uplift Modeling (Treatment Effect estimation) to predict individual customer elasticity.
