# CREDITS, PRICING & COST ESTIMATION ENGINE

> **Document**: Financial Engine & Ledger Specification  
> **Status**: Approved Foundation  
> **Rule**: Users see transparent platform credits, never raw GPU seconds or API tokens.

---

## 1. Credit Pricing Formula

The customer credit price is calculated dynamically by the backend:

$$\text{CreditPrice} = \lceil (\text{BaseCredits} \times \text{ResolutionMultiplier} \times \text{DurationMultiplier} \times \text{BatchMultiplier}) \rceil$$

### Illustrative Baseline Tiers
* **Image Generation (Standard 1024x1024)**: `6 - 10 Credits`
* **Image Generation (HD / 4K / Multi-step)**: `12 - 18 Credits`
* **Video Generation (Short 3s-5s 720p)**: `60 - 80 Credits`
* **Video Generation (HD 1080p 10s)**: `120 - 160 Credits`
* **Text-to-Speech (per 1,000 characters)**: `2 - 4 Credits`
* **AI Upscale / Background Removal**: `4 - 6 Credits`

*(Exact credit numbers are stored in `models_registry` and configurable via the Admin Dashboard).*

---

## 2. Internal Cost vs. Platform Margin Accounting

For every job, we calculate the internal delivery cost:

### Hosted Cloud APIs (e.g. Google Cloud Vertex AI):
$$\text{Cost}_{\text{hosted}} = \text{API Fee} + \text{Storage Put/Egress} + \text{Orchestration Overhead}$$

### Local Rented GPU Workers (e.g. $1.30/hr 96GB VRAM):
$$\text{Cost}_{\text{gpu}} = (\text{Inference Seconds} \times \frac{\$1.30}{3600}) + \text{Allocated Idle Buffer} + \text{Disk Storage}$$

* Example: A 10-second FLUX inference on a \$1.30/hr GPU costs approximately **\$0.0036** in raw compute.
* At \$0.01 per credit package equivalent, charging 6 credits (\$0.06 value) provides a sustainable **~85% gross margin**, comfortably buffering against idle GPU uptime, failed attempts, and disk costs.

---

## 3. Financial Safety Rules

1. **No Negative Balances**: `CHECK (balance >= 0)` constraint enforced at database level.
2. **Row-Level Locking**: Atomic credit mutations use `SELECT ... FOR UPDATE` to prevent race conditions during rapid concurrent requests.
3. **Idempotency Keys**: All reservation and billing transactions require an idempotency key (UUID hash of `user_id + job_id + timestamp_bucket`) to prevent duplicate deductions during network retries.
4. **Transparent Audit Trail**: Transactions are strictly additive; historical ledger rows are never deleted or modified.

