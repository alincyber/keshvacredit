# API Documentation - cURL Requests

This file contains all the API endpoints available in the Keshva Credit application with curl request examples.

**Base URL:** `https://keshvacredit.onrender.com`

---

## Table of Contents

1. [OTP Management](#otp-management)
2. [User Management (Login Routes)](#user-management-login-routes)
3. [Personal Loan](#personal-loan)
4. [Personal Loan Lender](#personal-loan-lender)
5. [Home Loan](#home-loan)
6. [Home Loan Lender](#home-loan-lender)
7. [Business Loan](#business-loan)
8. [Business Lender](#business-lender)
9. [Company Loans](#company-loans)
10. [Gold Loan](#gold-loan)
11. [Gold Lender](#gold-lender)
12. [Contact](#contact)
13. [Partnership](#partnership)
14. [Work Report](#work-report)
15. [Delete Account](#delete-account)

---

## OTP Management

### 1. Send OTP

**Endpoint:** `POST /api/send-otp`

**Description:** Send OTP to a phone number

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otp": "123456"
}
```

**Validation Rules:**
- Phone number is required
- Phone number must be 10 digits
- Phone number must contain only numbers

---

### 2. Verify OTP

**Endpoint:** `POST /api/verify-otp`

**Description:** Verify OTP for a phone number

**Request Body:**
```json
{
  "phone": "9876543210",
  "otp": "123456"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "otp": "123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

---

## User Management (Login Routes)

### 1. Create User

**Endpoint:** `POST /api/createuser`

**Description:** Create a new user with loan eligibility details

**Request Body:**
```json
{
  "name": "Raj Kumar",
  "phone": "9876543210",
  "email": "raj@gmail.com",
  "pan": "ABCDE1234F",
  "dob": "1990-05-15",
  "income": 500000,
  "loan_amount": 300000,
  "employment_type": "Salaried",
  "pincode": "110001",
  "city": "Delhi",
  "state": "Delhi"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/createuser \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Raj Kumar",
    "phone": "9876543210",
    "email": "raj@gmail.com",
    "pan": "ABCDE1234F",
    "dob": "1990-05-15",
    "income": 500000,
    "loan_amount": 300000,
    "employment_type": "Salaried",
    "pincode": "110001",
    "city": "Delhi",
    "state": "Delhi"
  }'
```

---

### 2. Get All Users

**Endpoint:** `GET /api/users`

**Description:** Retrieve all registered users

**cURL Example:**
```bash
curl -X GET https://keshvacredit.onrender.com/api/users \
  -H "Content-Type: application/json"
```

---

### 3. Get User by Phone

**Endpoint:** `POST /api/getuserbyphone`

**Description:** Retrieve user details by phone number

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/getuserbyphone \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

---

### 4. Update User

**Endpoint:** `PUT /api/updateuser`

**Description:** Update user information

**Request Body:**
```json
{
  "phone": "9876543210",
  "name": "Raj Kumar Singh",
  "income": 600000,
  "loan_amount": 400000
}
```

**cURL Example:**
```bash
curl -X PUT https://keshvacredit.onrender.com/api/updateuser \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "name": "Raj Kumar Singh",
    "income": 600000,
    "loan_amount": 400000
  }'
```

---

### 5. Remove User

**Endpoint:** `DELETE /api/removeuser`

**Description:** Delete a user from the system

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X DELETE https://keshvacredit.onrender.com/api/removeuser \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

---

## Personal Loan

### 1. Create Personal Loan User

**Endpoint:** `POST /api/personal-loan/create-user`

**Description:** Create a personal loan user application

**Request Body:**
```json
{
  "name": "Amit Sharma",
  "phone": "9876543210",
  "email": "amit@gmail.com",
  "pan": "ABCDE1234F",
  "dob": "1992-08-20",
  "income": 400000,
  "loan_amount": 200000,
  "employment_type": "Salaried",
  "pincode": "110001",
  "city": "Delhi",
  "state": "Delhi"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/personal-loan/create-user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Amit Sharma",
    "phone": "9876543210",
    "email": "amit@gmail.com",
    "pan": "ABCDE1234F",
    "dob": "1992-08-20",
    "income": 400000,
    "loan_amount": 200000,
    "employment_type": "Salaried",
    "pincode": "110001",
    "city": "Delhi",
    "state": "Delhi"
  }'
```

---

### 2. Compare Personal Loan by Phone

**Endpoint:** `POST /api/personal-loan/compare-user`

**Description:** Compare a personal loan user against lenders

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/personal-loan/compare-user \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

---

### 3. Get Personal Loan User by Phone

**Endpoint:** `POST /api/personal-loan/get-user`

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/personal-loan/get-user \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

---

### 4. Update Personal Loan User by PAN

**Endpoint:** `PUT /api/personal-loan/update-user`

**Request Body:**
```json
{
  "pan": "ABCDE1234F",
  "income": 500000,
  "loan_amount": 300000
}
```

**cURL Example:**
```bash
curl -X PUT https://keshvacredit.onrender.com/api/personal-loan/update-user \
  -H "Content-Type: application/json" \
  -d '{
    "pan": "ABCDE1234F",
    "income": 500000,
    "loan_amount": 300000
  }'
```

---

### 5. Delete Personal Loan User by PAN

**Endpoint:** `DELETE /api/personal-loan/delete-user`

**Request Body:**
```json
{
  "pan": "ABCDE1234F"
}
```

**cURL Example:**
```bash
curl -X DELETE https://keshvacredit.onrender.com/api/personal-loan/delete-user \
  -H "Content-Type: application/json" \
  -d '{
    "pan": "ABCDE1234F"
  }'
```

---

### 6. Get All Personal Loans

**Endpoint:** `GET /api/personal-loan/get-all`

**cURL Example:**
```bash
curl -X GET https://keshvacredit.onrender.com/api/personal-loan/get-all \
  -H "Content-Type: application/json"
```

---

### 7. Get Personal Loan by ID

**Endpoint:** `GET /api/personal-loan/personal-loans/:id`

**cURL Example:**
```bash
curl -X GET https://keshvacredit.onrender.com/api/personal-loan/personal-loans/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json"
```

---

## Personal Loan Lender

### 1. Add Personal Loan Lender

**Endpoint:** `POST /api/personal-lender/add`

**Request Body:**
```json
{
  "lender_name": "Personal Finance Ltd",
  "min_income": 200000,
  "max_loan": 3000000,
  "interest_rate": 13.5,
  "min_age": 21,
  "max_age": 60,
  "employment_types": ["Salaried", "Self-Employed"]
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/personal-lender/add \
  -H "Content-Type: application/json" \
  -d '{
    "lender_name": "Personal Finance Ltd",
    "min_income": 200000,
    "max_loan": 3000000,
    "interest_rate": 13.5,
    "min_age": 21,
    "max_age": 60,
    "employment_types": ["Salaried", "Self-Employed"]
  }'
```

---

### 2. Get Personal Lender by ID

**Endpoint:** `POST /api/personal-lender/get-by-id/:id`

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/personal-lender/get-by-id/507f1f77bcf86cd799439020 \
  -H "Content-Type: application/json"
```

---

### 3. Get Personal Lender by Phone (find borrowers)

**Endpoint:** `POST /api/personal-lender/get-by-phone`

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/personal-lender/get-by-phone \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

---

### 4. Compare Personal Loans (match lender with borrowers)

**Endpoint:** `POST /api/personal-lender/compare`

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/personal-lender/compare \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

---

### 5. Update Personal Lender by PAN

**Endpoint:** `PUT /api/personal-lender/update`

**Request Body:**
```json
{
  "pan": "ABCDE1234F",
  "interest_rate": 12.0,
  "max_loan": 5000000
}
```

**cURL Example:**
```bash
curl -X PUT https://keshvacredit.onrender.com/api/personal-lender/update \
  -H "Content-Type: application/json" \
  -d '{
    "pan": "ABCDE1234F",
    "interest_rate": 12.0,
    "max_loan": 5000000
  }'
```

---

### 6. Remove Personal Lender by PAN

**Endpoint:** `DELETE /api/personal-lender/remove`

**Request Body:**
```json
{
  "pan": "ABCDE1234F"
}
```

**cURL Example:**
```bash
curl -X DELETE https://keshvacredit.onrender.com/api/personal-lender/remove \
  -H "Content-Type: application/json" \
  -d '{
    "pan": "ABCDE1234F"
  }'
```

---

### 7. Get All Personal Lenders

**Endpoint:** `GET /api/personal-lender/all`

**cURL Example:**
```bash
curl -X GET https://keshvacredit.onrender.com/api/personal-lender/all \
  -H "Content-Type: application/json"
```

---

## Home Loan

### 1. Create Home Loan

**Endpoint:** `POST /api/home-loan/add`

**Request Body:**
```json
{
  "owner_name": "Vikram Reddy",
  "owner_email": "vikram@gmail.com",
  "owner_phone": "9876543210",
  "owner_pan": "ABCDE1234F",
  "owner_age": 32,
  "owner_income": 800000,
  "property_value": 5000000,
  "loan_amount": 3500000,
  "interest_rate": 9.5,
  "loan_tenure": 20,
  "employment_type": "Salaried"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/home-loan/add \
  -H "Content-Type: application/json" \
  -d '{
    "owner_name": "Vikram Reddy",
    "owner_email": "vikram@gmail.com",
    "owner_phone": "9876543210",
    "owner_pan": "ABCDE1234F",
    "owner_age": 32,
    "owner_income": 800000,
    "property_value": 5000000,
    "loan_amount": 3500000,
    "interest_rate": 9.5,
    "loan_tenure": 20,
    "employment_type": "Salaried"
  }'
```

---

### 2. Compare Home Loan by Phone

**Endpoint:** `POST /api/home-loan/compare`

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/home-loan/compare \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

---

### 3. Get Home Loan by Phone

**Endpoint:** `POST /api/home-loan/get-by-phone`

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/home-loan/get-by-phone \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

---

### 4. Update Home Loan by PAN

**Endpoint:** `PUT /api/home-loan/update`

**Request Body:**
```json
{
  "pan": "ABCDE1234F",
  "loan_amount": 4000000,
  "interest_rate": 9.0
}
```

**cURL Example:**
```bash
curl -X PUT https://keshvacredit.onrender.com/api/home-loan/update \
  -H "Content-Type: application/json" \
  -d '{
    "pan": "ABCDE1234F",
    "loan_amount": 4000000,
    "interest_rate": 9.0
  }'
```

---

### 5. Delete Home Loan by PAN

**Endpoint:** `DELETE /api/home-loan/delete`

**Request Body:**
```json
{
  "pan": "ABCDE1234F"
}
```

**cURL Example:**
```bash
curl -X DELETE https://keshvacredit.onrender.com/api/home-loan/delete \
  -H "Content-Type: application/json" \
  -d '{
    "pan": "ABCDE1234F"
  }'
```

---

### 6. Get All Home Loans

**Endpoint:** `GET /api/home-loan/all`

**cURL Example:**
```bash
curl -X GET https://keshvacredit.onrender.com/api/home-loan/all \
  -H "Content-Type: application/json"
```

---

## Home Loan Lender

### 1. Add Home Loan Lender

**Endpoint:** `POST /api/home-loan-lender/add`

**Request Body:**
```json
{
  "lender_name": "Home Finance Corp",
  "min_income": 300000,
  "max_loan": 10000000,
  "interest_rate": 9.0,
  "min_age": 21,
  "max_age": 65,
  "loan_tenure": 30
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/home-loan-lender/add \
  -H "Content-Type: application/json" \
  -d '{
    "lender_name": "Home Finance Corp",
    "min_income": 300000,
    "max_loan": 10000000,
    "interest_rate": 9.0,
    "min_age": 21,
    "max_age": 65,
    "loan_tenure": 30
  }'
```

---

### 2. Get All Home Loan Lenders

**Endpoint:** `GET /api/home-loan-lender/all`

**cURL Example:**
```bash
curl -X GET https://keshvacredit.onrender.com/api/home-loan-lender/all \
  -H "Content-Type: application/json"
```

---

### 3. Update Home Loan Lender

**Endpoint:** `PUT /api/home-loan-lender/update`

**Request Body:**
```json
{
  "lender_name": "Home Finance Corp",
  "interest_rate": 8.5
}
```

**cURL Example:**
```bash
curl -X PUT https://keshvacredit.onrender.com/api/home-loan-lender/update \
  -H "Content-Type: application/json" \
  -d '{
    "lender_name": "Home Finance Corp",
    "interest_rate": 8.5
  }'
```

---

### 4. Delete Home Loan Lender

**Endpoint:** `DELETE /api/home-loan-lender/delete`

**Request Body:**
```json
{
  "lender_name": "Home Finance Corp"
}
```

**cURL Example:**
```bash
curl -X DELETE https://keshvacredit.onrender.com/api/home-loan-lender/delete \
  -H "Content-Type: application/json" \
  -d '{
    "lender_name": "Home Finance Corp"
  }'
```

---

## Business Loan

### 1. Create Business Loan

**Endpoint:** `POST /api/business/createbusinessman`

**Request Body:**
```json
{
  "business_owner_name": "Arjun Singh",
  "business_owner_email": "arjun@gmail.com",
  "business_owner_phone": "9876543210",
  "business_owner_pan": "ABCDE1234F",
  "business_ower_dob": "1985-03-20",
  "business_pan": "AABCT1234F",
  "business_name": "Singh Enterprises",
  "business_type": "Retail",
  "business_age": 5,
  "business_loan_purpose": "Expansion",
  "annual_revenue": 2500000,
  "business_location": "Delhi",
  "business_loan_amount": 500000,
  "Udyam_Registration_Number": "UDYAM123456",
  "gst_number": "18AABCT1234F123",
  "msme_registration_number": "MSME123456"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/business/createbusinessman \
  -H "Content-Type: application/json" \
  -d '{
    "business_owner_name": "Arjun Singh",
    "business_owner_email": "arjun@gmail.com",
    "business_owner_phone": "9876543210",
    "business_owner_pan": "ABCDE1234F",
    "business_ower_dob": "1985-03-20",
    "business_pan": "AABCT1234F",
    "business_name": "Singh Enterprises",
    "business_type": "Retail",
    "business_age": 5,
    "business_loan_purpose": "Expansion",
    "annual_revenue": 2500000,
    "business_location": "Delhi",
    "business_loan_amount": 500000,
    "Udyam_Registration_Number": "UDYAM123456",
    "gst_number": "18AABCT1234F123",
    "msme_registration_number": "MSME123456"
  }'
```

---

### 2. Get All Business Loans

**Endpoint:** `GET /api/business/businessmen`

**cURL Example:**
```bash
curl -X GET https://keshvacredit.onrender.com/api/business/businessmen \
  -H "Content-Type: application/json"
```

---

### 3. Update Business Loan

**Endpoint:** `PUT /api/business/updatebusinessman`

**Request Body:**
```json
{
  "business_owner_phone": "9876543210",
  "annual_revenue": 3000000,
  "business_loan_amount": 600000
}
```

**cURL Example:**
```bash
curl -X PUT https://keshvacredit.onrender.com/api/business/updatebusinessman \
  -H "Content-Type: application/json" \
  -d '{
    "business_owner_phone": "9876543210",
    "annual_revenue": 3000000,
    "business_loan_amount": 600000
  }'
```

---

### 4. Get Business by Phone

**Endpoint:** `POST /api/business/get-by-phone`

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/business/get-by-phone \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

---

## Business Lender

### 1. Add Business Lender

**Endpoint:** `POST /api/business-lender/add`

**Request Body:**
```json
{
  "lender_name": "Business Finance Co",
  "business_age": 3,
  "annual_revenue": 1000000,
  "business_loan_amount": 1000000,
  "business_type": "Retail",
  "interest_rate": 14.5,
  "loan_term_months": 60
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/business-lender/add \
  -H "Content-Type: application/json" \
  -d '{
    "lender_name": "Business Finance Co",
    "business_age": 3,
    "annual_revenue": 1000000,
    "business_loan_amount": 1000000,
    "business_type": "Retail",
    "interest_rate": 14.5,
    "loan_term_months": 60
  }'
```

---

### 2. Get Business Lender by ID

**Endpoint:** `GET /api/business-lender/:id`

**cURL Example:**
```bash
curl -X GET https://keshvacredit.onrender.com/api/business-lender/507f1f77bcf86cd799439014 \
  -H "Content-Type: application/json"
```

---

### 3. Compare Business Loans Live

**Endpoint:** `POST /api/business-lender/compare-live`

**Request Body:**
```json
{
  "business_owner_phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/business-lender/compare-live \
  -H "Content-Type: application/json" \
  -d '{
    "business_owner_phone": "9876543210"
  }'
```

---

### 4. Update Business Lender

**Endpoint:** `PUT /api/business-lender/update`

**Request Body:**
```json
{
  "lender_name": "Business Finance Co Updated",
  "interest_rate": 13.5,
  "business_loan_amount": 1500000
}
```

**cURL Example:**
```bash
curl -X PUT https://keshvacredit.onrender.com/api/business-lender/update \
  -H "Content-Type: application/json" \
  -d '{
    "lender_name": "Business Finance Co Updated",
    "interest_rate": 13.5,
    "business_loan_amount": 1500000
  }'
```

---

### 5. Remove Business Lender

**Endpoint:** `DELETE /api/business-lender/delete`

**Request Body:**
```json
{
  "lender_id": "507f1f77bcf86cd799439014"
}
```

**cURL Example:**
```bash
curl -X DELETE https://keshvacredit.onrender.com/api/business-lender/delete \
  -H "Content-Type: application/json" \
  -d '{
    "lender_id": "507f1f77bcf86cd799439014"
  }'
```

---

## Company Loans

### 1. Add Company

**Endpoint:** `POST /api/company/add`

**Request Body:**
```json
{
  "company_name": "XYZ Finance Ltd",
  "min_age": 21,
  "max_age": 65,
  "min_income": 250000,
  "max_loan": 5000000,
  "interest_rate": 12.5,
  "loan_types": ["Personal", "Home", "Auto"],
  "allowed_employment": ["Salaried", "Self-Employed"]
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/company/add \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "XYZ Finance Ltd",
    "min_age": 21,
    "max_age": 65,
    "min_income": 250000,
    "max_loan": 5000000,
    "interest_rate": 12.5,
    "loan_types": ["Personal", "Home", "Auto"],
    "allowed_employment": ["Salaried", "Self-Employed"]
  }'
```

---

### 2. Get Company by ID

**Endpoint:** `GET /api/company/:id`

**cURL Example:**
```bash
curl -X GET https://keshvacredit.onrender.com/api/company/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json"
```

---

### 3. Compare Live Companies (eligible lenders for a user)

**Endpoint:** `POST /api/company/compare-live`

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/company/compare-live \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

---

### 4. Update Company

**Endpoint:** `PUT /api/company/:id`

**Request Body:**
```json
{
  "company_name": "XYZ Finance Ltd Updated",
  "interest_rate": 11.5,
  "max_loan": 6000000
}
```

**cURL Example:**
```bash
curl -X PUT https://keshvacredit.onrender.com/api/company/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "XYZ Finance Ltd Updated",
    "interest_rate": 11.5,
    "max_loan": 6000000
  }'
```

---

### 5. Remove Company

**Endpoint:** `DELETE /api/company/:id`

**cURL Example:**
```bash
curl -X DELETE https://keshvacredit.onrender.com/api/company/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json"
```

---

## Gold Loan

### 1. Create Gold Loan

**Endpoint:** `POST /api/gold-loan/add`

**Request Body:**
```json
{
  "owner_name": "Priya Sharma",
  "owner_email": "priya@gmail.com",
  "owner_phone": "9876543210",
  "owner_pan": "ABCDE1234F",
  "owner_age": 35,
  "lender_name": "Gold Finance Ltd",
  "gold_loan_amount": 200000,
  "interest_rate": 11.5,
  "loan_purpose": "Emergency Funds",
  "gold_weight": 50,
  "gold_purity": 92,
  "gold_value": 250000,
  "gold_type": "22K",
  "gold_form": "Jewelry"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/gold-loan/add \
  -H "Content-Type: application/json" \
  -d '{
    "owner_name": "Priya Sharma",
    "owner_email": "priya@gmail.com",
    "owner_phone": "9876543210",
    "owner_pan": "ABCDE1234F",
    "owner_age": 35,
    "lender_name": "Gold Finance Ltd",
    "gold_loan_amount": 200000,
    "interest_rate": 11.5,
    "loan_purpose": "Emergency Funds",
    "gold_weight": 50,
    "gold_purity": 92,
    "gold_value": 250000,
    "gold_type": "22K",
    "gold_form": "Jewelry"
  }'
```

---

## Gold Lender

### 1. Add Gold Lender

**Endpoint:** `POST /api/goldlender/add-lender`

**Request Body:**
```json
{
  "lender_name": "Gold Trust Finance",
  "loan_amount": 500000,
  "gold_weight": 20,
  "gold_purity": 90,
  "gold_value": 100000,
  "gold_form": "Jewelry",
  "interest_rate": 10.5,
  "processing_fee": 1.0
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/goldlender/add-lender \
  -H "Content-Type: application/json" \
  -d '{
    "lender_name": "Gold Trust Finance",
    "loan_amount": 500000,
    "gold_weight": 20,
    "gold_purity": 90,
    "gold_value": 100000,
    "gold_form": "Jewelry",
    "interest_rate": 10.5,
    "processing_fee": 1.0
  }'
```

---

### 2. Compare Gold Loans Live

**Endpoint:** `POST /api/goldlender/compare-live`

**Request Body:**
```json
{
  "owner_phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/goldlender/compare-live \
  -H "Content-Type: application/json" \
  -d '{
    "owner_phone": "9876543210"
  }'
```

---

### 3. Update Gold Lender

**Endpoint:** `PUT /api/goldlender/update`

**Request Body:**
```json
{
  "lender_name": "Gold Trust Finance Updated",
  "interest_rate": 9.5,
  "loan_amount": 600000
}
```

**cURL Example:**
```bash
curl -X PUT https://keshvacredit.onrender.com/api/goldlender/update \
  -H "Content-Type: application/json" \
  -d '{
    "lender_name": "Gold Trust Finance Updated",
    "interest_rate": 9.5,
    "loan_amount": 600000
  }'
```

---

### 4. Remove Gold Lender

**Endpoint:** `DELETE /api/goldlender/delete`

**Request Body:**
```json
{
  "lender_id": "507f1f77bcf86cd799439016"
}
```

**cURL Example:**
```bash
curl -X DELETE https://keshvacredit.onrender.com/api/goldlender/delete \
  -H "Content-Type: application/json" \
  -d '{
    "lender_id": "507f1f77bcf86cd799439016"
  }'
```

---

## Contact

### 1. Create Contact

**Endpoint:** `POST /api/usercontact`

**Request Body:**
```json
{
  "name": "Raj Kumar",
  "email": "raj@gmail.com",
  "phone": "9876543210",
  "message": "I need assistance with my loan application"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/usercontact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Raj Kumar",
    "email": "raj@gmail.com",
    "phone": "9876543210",
    "message": "I need assistance with my loan application"
  }'
```

---

## Partnership

### 1. Submit Partnership

**Endpoint:** `POST /api/partnership/submit`

**Request Body:**
```json
{
  "partner_name": "Suresh Patel",
  "partner_email": "suresh@gmail.com",
  "partner_phone": "9876543210",
  "partner_city": "Mumbai",
  "partner_state": "Maharashtra",
  "partner_experience": 5
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/partnership/submit \
  -H "Content-Type: application/json" \
  -d '{
    "partner_name": "Suresh Patel",
    "partner_email": "suresh@gmail.com",
    "partner_phone": "9876543210",
    "partner_city": "Mumbai",
    "partner_state": "Maharashtra",
    "partner_experience": 5
  }'
```

---

### 2. Update Partnership by Phone

**Endpoint:** `PUT /api/partnership/update/phone`

**Request Body:**
```json
{
  "phone": "9876543210",
  "partner_city": "Pune",
  "partner_experience": 6
}
```

**cURL Example:**
```bash
curl -X PUT https://keshvacredit.onrender.com/api/partnership/update/phone \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "partner_city": "Pune",
    "partner_experience": 6
  }'
```

---

## Work Report

### 1. Create Work Report

**Endpoint:** `POST /api/workreport/create`

**Request Body:**
```json
{
  "employee_name": "Ravi Verma",
  "employee_phone": "9876543210",
  "work_description": "Completed loan processing for 5 clients",
  "hours_worked": 8,
  "date": "2024-01-15"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/workreport/create \
  -H "Content-Type: application/json" \
  -d '{
    "employee_name": "Ravi Verma",
    "employee_phone": "9876543210",
    "work_description": "Completed loan processing for 5 clients",
    "hours_worked": 8,
    "date": "2024-01-15"
  }'
```

---

### 2. Get Work Report by Phone

**Endpoint:** `POST /api/workreport/get-by-phone`

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/workreport/get-by-phone \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

---

## Delete Account

### 1. Request Account Deletion (48-hour delay)

**Endpoint:** `POST /api/delete-account`

**Request Body:**
```json
{
  "phone": "9876543210",
  "reason": "No longer need services"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/delete-account \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "reason": "No longer need services"
  }'
```

---

### 2. Cancel Deletion Request

**Endpoint:** `POST /api/cancel-deletion`

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X POST https://keshvacredit.onrender.com/api/cancel-deletion \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

---

## Notes

- All endpoints expect `Content-Type: application/json` header for POST/PUT/DELETE requests
- Phone numbers must be 10 digits
- Email must be valid Gmail address (validation enforced on most endpoints)
- All required fields must be provided
- Dates should be in format: `YYYY-MM-DD`
- Numbers should be numeric values (no quotes around numbers in JSON)
- Replace example IDs with actual IDs from your database
- The server runs on Render — cold starts may take a few seconds on first request

---

## Testing Tips

1. Install curl if not already installed
2. Copy any curl command from above and run in terminal
3. For better formatting, install and use `jq`: `curl ... | jq`
4. Use Postman or Insomnia for GUI-based testing
5. Keep track of created IDs for testing update/delete operations
6. First request to a cold server may take 30–60 seconds — subsequent requests are fast

---

**Last Updated:** 2024-07-14
