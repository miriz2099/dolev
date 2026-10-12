# Server-Side Automated Testing Guide (Backend / Functions)
## Final Engineering Project: "Dolev" System

This document provides a comprehensive explanation of the automated testing suite implemented for the server-side architecture (`functions/`) in the Dolev clinical and psycho-didactic management platform. It outlines the engineering rationale, clinical privacy standards, covered test cases, and execution instructions.

---

## 📌 1. Engineering & Clinical Objectives
The Dolev platform manages sensitive pediatric medical records, psycho-didactic evaluation reports, intake questionnaires, and parent/child profiles. It also features Google Gemini LLM integration for clinical rephrasing.

The automated test suite safeguards three core engineering pillars:
1. **Medical Privacy & Data Masking (HIPAA Compliance):** Ensuring no Personal Identifiable Information (PII) is exposed to external AI providers.
2. **Cybersecurity & Input Sanitization:** Neutralizing Cross-Site Scripting (XSS) and injection vectors while safeguarding the integrity of digital signature images.
3. **Authentication & Role-Based Access Control (RBAC):** Enforcing strict authorization boundaries across Admins, Therapists, and Parents.

---

## 🚀 2. How to Run the Tests
From the project root directory (VS Code / PowerShell):
```powershell
npm --prefix functions test
```
Or directly from within the `functions` folder:
```bash
npm test
```

All test suites execute via **Jest** in an isolated in-memory environment using mocks. They run in seconds without external network dependencies or Firebase billing costs.

---

## 🔍 3. Test Suites Breakdown

### 🟢 Suite 1: AI De-Identification & Privacy Protection
**Test File:** `functions/tests/unit/deidentify.test.js`  
**Target Module:** `functions/services/ai/deidentify.js`

This service de-identifies clinicians' raw notes prior to sending them to the Google Gemini LLM, and restores the original patient entities upon receiving the rephrased output.

* **Tested Capabilities:**
  1. **Entity Map Extraction (`buildEntityMap`):**
     * Verifies that the child's and parents' first/last names, national ID numbers, phone numbers, and emails are mapped to standardized tokens (e.g., `[שם_הנבחן]`, `[ת.ז]`, `[טלפון]`).
     * Filters out empty or short inputs (< 2 characters) to prevent false-positive token substitutions.
  2. **Substring Collision Prevention:**
     * Ensures entities are sorted in descending order of string length. For instance, if an input contains "דניאל" (Daniel) and "דן" (Dan), the algorithm masks "דניאל" first, preventing partial word corruption.
  3. **Targeted Redaction (`redact`):**
     * Replaces known clinical profile entities with generic tokens across the text.
  4. **Regex-Based Safety Net (Fallback Detection):**
     * Detects and redacts unindexed or free-text inputs, including 9-digit national IDs, Israeli phone formats, and email addresses typed directly into free-text observations.
  5. **Lossless Restoration (`restore`):**
     * Guarantees that after the AI rephrases the clinical observations, the original patient and family names are accurately reinserted into their designated positions.

---

### 🟢 Suite 2: Input Sanitization & XSS Defense
**Test File:** `functions/tests/unit/sanitize.test.js`  
**Target Module:** `functions/middleware/sanitize.middleware.js`

This Express middleware sanitizes incoming HTTP request payloads to shield the backend against Cross-Site Scripting (XSS) and malicious script injection through forms and surveys.

* **Tested Capabilities:**
  1. **HTML Entity Encoding (`stripTags`):**
     * Converts tags such as `<script>` into safe HTML entities (`&lt;script&gt;`) to neutralize browser execution.
  2. **Script Protocol & Event Handler Stripping:**
     * Strips dangerous schemes like `javascript:alert(1)` and DOM event triggers (`onclick=`, `onerror=`).
  3. **Preservation of Digital Signatures (Base64) – Critical Edge Case:**
     * Parents submit digital signatures via `SignatureInput.jsx`, encoded as Base64 data URLs.
     * The test validates that valid signature strings **are never altered or corrupted** by the sanitization filters.
  4. **Deep Recursive Payload Cleaning (`sanitizeBody`):**
     * Recursively traverses nested JSON objects and arrays within `req.body`, ensuring deep fields are cleaned while numeric and boolean datatypes remain intact.

---

### 🟢 Suite 3: Authentication & Role-Based Access Control (RBAC)
**Test File:** `functions/tests/unit/auth.middleware.test.js`  
**Target Module:** `functions/middleware/auth.middleware.js`

This middleware acts as the gatekeeper for server endpoints, verifying user identity and strictly gating administrative functions.

* **Tested Capabilities:**
  1. **Token Verification (`verifyToken`):**
     * Rejects requests lacking an `Authorization` header with `401 Unauthorized`.
     * Rejects malformed headers that do not adhere to the `Bearer ` scheme.
     * Blocks expired or invalid JWT tokens with `401 Unauthorized`.
     * Validates legitimate tokens, assigns the decoded user to `req.user`, and advances the pipeline via `next()`.
  2. **Administrative Access Control (`verifyAdmin`):**
     * Prevents Privilege Escalation: Authenticated non-admin users (such as `patient` or `therapist`) attempting to invoke admin routes are immediately blocked with `403 Forbidden` ("Access denied. Admins only.").
     * Authenticated admins are verified in Firestore and permitted to proceed.

---

## 📊 4. Execution Summary
* **Total Test Suites:** 3
* **Total Unit Tests:** 20
* **Pass Rate:** 100% (All passing).
* **Execution Time:** ~2-12 seconds.
