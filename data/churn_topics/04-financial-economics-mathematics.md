# Churn Reaper — Financial Economics & Mathematical Engine

## Core Mathematical Chain
$$ \text{MonthlyCharges} \rightarrow \text{FutureRevenue} \rightarrow \text{RevenueAtRisk} \rightarrow \text{ProfitAtRisk} \rightarrow \text{ValueProtected} \rightarrow \text{NetBenefit} \rightarrow \text{ROI} $$

## Step-by-Step Mathematical Formulas
Let:
- $M$: Monthly Charges (e.g. ₹85)
- $T$: Tenure in months (e.g. 12 months)
- $H$: Planning Horizon (configured to 24 months)
- $p$: Churn Probability from XGBoost (e.g. 0.949)
- $g$: Gross Margin (configured to 60% or 0.60)
- $s$: Scenario Success Rate (e.g. 20% for discount, 15% for support, 25% for contract)
- $c$: Retention Cost calculated deterministically

### 1. Remaining Customer Lifetime Horizon
$$ R = \max(H - T, 0) = \max(24 - 12, 0) = 12 \text{ months} $$

### 2. Future Expected Revenue
$$ F = M \times R = ₹85 \times 12 = ₹1,020 $$

### 3. Revenue at Risk
$$ A = F \times p = ₹1,020 \times 0.949 \approx ₹968 $$

### 4. Profit at Risk (60% Gross Margin)
$$ P = A \times g = ₹968 \times 0.60 \approx ₹581 $$

### 5. Deterministic Retention Cost ($c$)
- **Discount Offer**: $c = M \times \text{DiscountRate} \times \text{Duration} = ₹85 \times 0.15 \times 3 \approx ₹38$
- **Support Package**: $c = \text{MonthlySupportCost} \times \text{Duration} = ₹25 \times 3 = ₹75$
- **Contract Upgrade**: $c = \text{One-time Incentive} = ₹150$

### 6. Expected Value Protected
$$ V = P \times s = ₹581 \times 0.20 \approx ₹116 $$

### 7. Net Benefit
$$ N = V - c = ₹116 - ₹38 = +₹78 $$

### 8. Expected ROI
$$ ROI = \frac{N}{c} = \frac{+₹78}{₹38} \approx 2.04\text{x} $$

### 9. Business Decision Rule
$$ \text{Decision} = \begin{cases} \text{RETAIN CUSTOMER}, & \text{if } N > 0 \\ \text{DO NOT SPEND}, & \text{if } N \le 0 \end{cases} $$

## Scenario Comparison Example
| Retention Strategy | Intervention Cost | Value Protected | Net Benefit | Expected ROI | Recommendation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **15% Loyalty Discount (3 mo)** | ₹38 | ₹116 | **+₹78** | **2.04x** | **PRIMARY OPTIMAL (RETAIN)** |
| **Support & Security Package** | ₹75 | ₹87 | +₹12 | 0.16x | Secondary Alternative |
| **₹150 Contract Upgrade** | ₹150 | ₹145 | -₹5 | -0.03x | DO NOT SPEND (Negative ROI) |
