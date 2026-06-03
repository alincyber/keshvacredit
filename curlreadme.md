# API Documentation - cURL Requests

This file contains all the API endpoints available in the Keshva Credit application with curl request examples.

**Base URL:** `http://localhost:5000`

---

## Table of Contents

1. [OTP Management](#otp-management)
2. [User Management](#user-management)
3. [Contact](#contact)
4. [Loan Comparison](#loan-comparison)
5. [Company Loans](#company-loans)
6. [Business Loans](#business-loans)
7. [Business Lenders](#business-lenders)
8. [Gold Loans](#gold-loans)
9. [Gold Lenders](#gold-lenders)

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
curl -X POST http://localhost:5000/api/send-otp \
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
curl -X POST http://localhost:5000/api/verify-otp \
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

**Validation Rules:**
- Phone and OTP are required
- OTP must be valid and not expired (5 minutes validity)
- OTP must match the one sent

---

## User Management

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
curl -X POST http://localhost:5000/api/createuser \
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

**Expected Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Raj Kumar",
    "phone": "9876543210",
    "email": "raj@gmail.com",
    "pan": "ABCDE1234F",
    ...
  }
}
```

**Validation Rules:**
- All fields are required
- Phone number must be 10 digits and contain only numbers
- Email must be a valid Gmail address
- PAN must not already exist in database
- Loan amount, income, etc. must be valid numbers

---

### 2. Get All Users

**Endpoint:** `GET /api/users`

**Description:** Retrieve all registered users

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Raj Kumar",
      "phone": "9876543210",
      "email": "raj@gmail.com",
      "pan": "ABCDE1234F",
      ...
    }
  ]
}
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
curl -X POST http://localhost:5000/api/getuserbyphone \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Raj Kumar",
    "phone": "9876543210",
    "email": "raj@gmail.com",
    ...
  }
}
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
curl -X PUT http://localhost:5000/api/updateuser \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "name": "Raj Kumar Singh",
    "income": 600000,
    "loan_amount": 400000
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Raj Kumar Singh",
    ...
  }
}
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
curl -X DELETE http://localhost:5000/api/removeuser \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User removed successfully"
}
```

---

## Contact

### 1. Create Contact

**Endpoint:** `POST /api/usercontact`

**Description:** Create a contact/support request

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
curl -X POST http://localhost:5000/api/usercontact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Raj Kumar",
    "email": "raj@gmail.com",
    "phone": "9876543210",
    "message": "I need assistance with my loan application"
  }'
```

**Expected Response:**
```json
{
  "message": "CONTACT CREATED SUCCESSFULLY",
  "contact": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Raj Kumar",
    "email": "raj@gmail.com",
    "phone": "9876543210",
    "message": "I need assistance with my loan application",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Validation Rules:**
- All fields are required
- Phone number must be 10 digits and contain only numbers
- Email must be a valid Gmail address

---

## Loan Comparison

### 1. Compare Loans (Redirect to Company)

**Endpoint:** `GET /api/loan/compare/:id`

**Description:** Redirects to compare companies for a specific user ID (redirects to /api/company/:id)

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/loan/compare/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -L
```

---

### 2. Compare Live Loans

**Endpoint:** `POST /api/loan/compare-live`

**Description:** Compare available loans in real-time (redirects to /api/company/compare-live)

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/loan/compare-live \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }' \
  -L
```

---

## Company Loans

### 1. Add Company

**Endpoint:** `POST /api/company/add`

**Description:** Add a new company/lender with loan eligibility criteria

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
  "allowed_employment": ["Salaried", "Self-Employed"],
  "allowed_business_types": [],
  "min_business_age": null,
  "max_business_age": null
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/company/add \
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

**Expected Response:**
```json
{
  "success": true,
  "message": "Company added successfully",
  "company": {
    "_id": "507f1f77bcf86cd799439012",
    "company_name": "XYZ Finance Ltd",
    "min_age": 21,
    "max_age": 65,
    ...
  }
}
```

---

### 2. Get Company by ID

**Endpoint:** `GET /api/company/:id`

**Description:** Get a specific company by its ID and show eligible users

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/company/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "company": {
    "_id": "507f1f77bcf86cd799439012",
    "company_name": "XYZ Finance Ltd",
    ...
  },
  "eligible_users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Raj Kumar",
      "phone": "9876543210",
      ...
    }
  ]
}
```

---

### 3. Compare Live Companies

**Endpoint:** `POST /api/company/compare-live`

**Description:** Get list of companies that a user is eligible for

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/company/compare-live \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "eligible_companies": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "company_name": "XYZ Finance Ltd",
      "interest_rate": 12.5,
      "max_loan": 5000000
    }
  ]
}
```

---

### 4. Update Company

**Endpoint:** `PUT /api/company/:id`

**Description:** Update company details

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
curl -X PUT http://localhost:5000/api/company/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "XYZ Finance Ltd Updated",
    "interest_rate": 11.5,
    "max_loan": 6000000
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Company updated successfully",
  "company": {
    "_id": "507f1f77bcf86cd799439012",
    "company_name": "XYZ Finance Ltd Updated",
    ...
  }
}
```

---

### 5. Remove Company

**Endpoint:** `DELETE /api/company/:id`

**Description:** Delete a company

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/company/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Company removed successfully"
}
```

---

## Business Loans

### 1. Create Business Loan

**Endpoint:** `POST /api/business/createbusinessman`

**Description:** Create a business loan application

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
curl -X POST http://localhost:5000/api/business/createbusinessman \
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

**Expected Response:**
```json
{
  "success": true,
  "message": "Business application created successfully",
  "business": {
    "_id": "507f1f77bcf86cd799439013",
    "business_owner_name": "Arjun Singh",
    ...
  }
}
```

---

### 2. Get All Business Loans

**Endpoint:** `GET /api/business/businessmen`

**Description:** Retrieve all business loan applications

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/business/businessmen \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "businesses": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "business_owner_name": "Arjun Singh",
      ...
    }
  ]
}
```

---

### 3. Update Business Loan

**Endpoint:** `PUT /api/business/updatebusinessman`

**Description:** Update business loan application

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
curl -X PUT http://localhost:5000/api/business/updatebusinessman \
  -H "Content-Type: application/json" \
  -d '{
    "business_owner_phone": "9876543210",
    "annual_revenue": 3000000,
    "business_loan_amount": 600000
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Business updated successfully",
  "business": {
    "_id": "507f1f77bcf86cd799439013",
    "business_owner_name": "Arjun Singh",
    ...
  }
}
```

---

## Business Lenders

### 1. Add Business Lender

**Endpoint:** `POST /api/business-lender/add`

**Description:** Add a business lender with eligibility criteria

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
curl -X POST http://localhost:5000/api/business-lender/add \
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

**Expected Response:**
```json
{
  "success": true,
  "message": "Business lender added successfully",
  "lender": {
    "_id": "507f1f77bcf86cd799439014",
    "lender_name": "Business Finance Co",
    ...
  }
}
```

---

### 2. Get Business Lender by ID

**Endpoint:** `GET /api/business-lender/:id`

**Description:** Get specific business lender and eligible businesses

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/business-lender/507f1f77bcf86cd799439014 \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "lender": {
    "_id": "507f1f77bcf86cd799439014",
    "lender_name": "Business Finance Co",
    ...
  },
  "eligible_businesses": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "business_name": "Singh Enterprises",
      ...
    }
  ]
}
```

---

### 3. Compare Business Loans Live

**Endpoint:** `POST /api/business-lender/compare-live`

**Description:** Get eligible lenders for a specific business

**Request Body:**
```json
{
  "business_owner_phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/business-lender/compare-live \
  -H "Content-Type: application/json" \
  -d '{
    "business_owner_phone": "9876543210"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "eligible_lenders": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "lender_name": "Business Finance Co",
      "interest_rate": 14.5,
      "business_loan_amount": 1000000
    }
  ]
}
```

---

### 4. Update Business Lender

**Endpoint:** `PUT /api/business-lender/update`

**Description:** Update business lender details

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
curl -X PUT http://localhost:5000/api/business-lender/update \
  -H "Content-Type: application/json" \
  -d '{
    "lender_name": "Business Finance Co Updated",
    "interest_rate": 13.5,
    "business_loan_amount": 1500000
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Business lender updated successfully",
  "lender": {
    "_id": "507f1f77bcf86cd799439014",
    ...
  }
}
```

---

### 5. Remove Business Lender

**Endpoint:** `DELETE /api/business-lender/delete`

**Description:** Delete a business lender

**Request Body:**
```json
{
  "lender_id": "507f1f77bcf86cd799439014"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/business-lender/delete \
  -H "Content-Type: application/json" \
  -d '{
    "lender_id": "507f1f77bcf86cd799439014"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Business lender removed successfully"
}
```

---

## Gold Loans

### 1. Create Gold Loan

**Endpoint:** `POST /api/gold-loan/add`

**Description:** Create a gold loan application

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
curl -X POST http://localhost:5000/api/gold-loan/add \
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

**Expected Response:**
```json
{
  "success": true,
  "message": "Gold loan application created successfully",
  "goldLoan": {
    "_id": "507f1f77bcf86cd799439015",
    "owner_name": "Priya Sharma",
    ...
  }
}
```

---

## Gold Lenders

### 1. Add Gold Lender

**Endpoint:** `POST /api/goldlender/add-lender`

**Description:** Add a gold lender with criteria

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
curl -X POST http://localhost:5000/api/goldlender/add-lender \
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

**Expected Response:**
```json
{
  "success": true,
  "message": "Gold lender added successfully",
  "lender": {
    "_id": "507f1f77bcf86cd799439016",
    "lender_name": "Gold Trust Finance",
    ...
  }
}
```

---

### 2. Compare Gold Loans Live

**Endpoint:** `POST /api/goldlender/compare-live`

**Description:** Get eligible gold lenders for a specific loan

**Request Body:**
```json
{
  "owner_phone": "9876543210"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/goldlender/compare-live \
  -H "Content-Type: application/json" \
  -d '{
    "owner_phone": "9876543210"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "eligible_lenders": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "lender_name": "Gold Trust Finance",
      "interest_rate": 10.5,
      "loan_amount": 500000
    }
  ]
}
```

---

### 3. Update Gold Lender

**Endpoint:** `PUT /api/goldlender/update`

**Description:** Update gold lender details

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
curl -X PUT http://localhost:5000/api/goldlender/update \
  -H "Content-Type: application/json" \
  -d '{
    "lender_name": "Gold Trust Finance Updated",
    "interest_rate": 9.5,
    "loan_amount": 600000
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Gold lender updated successfully",
  "lender": {
    "_id": "507f1f77bcf86cd799439016",
    ...
  }
}
```

---

### 4. Remove Gold Lender

**Endpoint:** `DELETE /api/goldlender/delete`

**Description:** Delete a gold lender

**Request Body:**
```json
{
  "lender_id": "507f1f77bcf86cd799439016"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/goldlender/delete \
  -H "Content-Type: application/json" \
  -d '{
    "lender_id": "507f1f77bcf86cd799439016"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Gold lender removed successfully"
}
```

---

## Notes

- All endpoints expect `Content-Type: application/json` header for POST/PUT/DELETE requests
- Phone numbers must be 10 digits
- Email must be valid Gmail address
- All required fields must be provided
- Dates should be in format: `YYYY-MM-DD`
- Numbers should be numeric values (no quotes around numbers in JSON)
- Replace `localhost:5000` with your actual server URL in production
- Replace example IDs with actual IDs from your database

---

## Testing Tips

1. Install curl if not already installed
2. Copy any curl command from above and run in terminal
3. For better formatting, install and use `jq`: `curl ... | jq`
4. Use Postman or Insomnia for GUI-based testing
5. Keep track of created IDs for testing update/delete operations

---

**Last Updated:** 2024-01-15
