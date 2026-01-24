# Seller Dashboard - Quick Start Guide

## Prerequisites
- Python 3.8+ installed
- Node.js and npm installed
- Virtual environment set up

## Step 1: Backend Setup (5 minutes)

### 1.1 Navigate to backend directory
```powershell
cd "e:\Course Project\AMIT Full Stack E-Commerce Project\backenddd"
```

### 1.2 Activate virtual environment
```powershell
# PowerShell
.\.venv\Scripts\Activate.ps1

# OR Command Prompt
.\.venv\Scripts\activate.bat
```

### 1.3 Install dependencies (if not already done)
```bash
pip install -r requirements.txt
```

### 1.4 Apply database migrations
```bash
python manage.py migrate
```

### 1.5 Create a superuser (optional, for admin access)
```bash
python manage.py createsuperuser
```

### 1.6 Start the backend server
```bash
python manage.py runserver
```

✅ Backend should now be running at: **http://127.0.0.1:8000**

---

## Step 2: Frontend Setup (3 minutes)

### 2.1 Open a NEW terminal and navigate to frontend
```powershell
cd "e:\Course Project\AMIT Full Stack E-Commerce Project\frontend"
```

### 2.2 Install dependencies (if not already done)
```bash
npm install
```

### 2.3 Start the frontend development server
```bash
npm run dev
```

✅ Frontend should now be running at: **http://localhost:5173**

---

## Step 3: Using the Seller Dashboard (2 minutes)

### 3.1 Register a new account
1. Open http://localhost:5173 in your browser
2. Click **"Register"** in the navigation
3. Fill in:
   - Username: `testseller`
   - Email: `testseller@example.com`
   - Password: `testpass123`
4. Click **"Register"**

### 3.2 Login
1. Click **"Login"** in the navigation
2. Enter:
   - Username: `testseller`
   - Password: `testpass123`
3. Click **"Login"**

### 3.3 Access Seller Dashboard
1. Click **"Seller Dashboard"** in the navigation
2. You should see the dashboard with two tabs:
   - **Products** - Manage your products
   - **Sales & Orders** - Track your sales

### 3.4 Add Your First Product
1. Click **"+ Add New Product"** button
2. Fill in the form:
   - **Title**: "Wireless Bluetooth Headphones"
   - **Description**: "Premium quality headphones with noise cancellation"
   - **Price**: 99.99
   - **Stock**: 50
   - **Category**: "Electronics"
   - **Brand**: "TechPro"
   - **Tags**: "featured,bestseller"
   - **Discount**: 10 (for 10% off)
   - **Image URL**: https://via.placeholder.com/300
3. Click **"Add Product"**

✅ Your product should now appear in the table!

### 3.5 Edit a Product
1. Click the **"Edit"** button on your product
2. Modify any field (e.g., change price to 89.99)
3. Click **"Update Product"**

### 3.6 View Sales
1. Click the **"Sales & Orders"** tab
2. View your sales summary cards
3. See order history (if any orders exist)

---

## Common Issues & Solutions

### Issue: "Cannot reach server"
**Solution:** Make sure the backend is running at http://127.0.0.1:8000
```bash
cd backenddd
python manage.py runserver
```

### Issue: "Authentication credentials were not provided"
**Solution:** Make sure you're logged in. Check the navbar shows "Hi, [username]"

### Issue: "npm is not recognized"
**Solution:** Install Node.js from https://nodejs.org and restart your terminal

### Issue: Port already in use
**Solution for Backend:**
```bash
python manage.py runserver 8001
```
Then update frontend API URL in `frontend/src/services/api.js`

**Solution for Frontend:**
```bash
npm run dev -- --port 5174
```

### Issue: Migration errors
**Solution:**
```bash
cd backenddd
python manage.py makemigrations
python manage.py migrate
```

---

## API Endpoints Reference

### Authentication
- **POST** `/api/users/register/` - Register new user
- **POST** `/api/users/login/` - Login and get token

### Products (Seller)
- **GET** `/api/products/seller/` - List your products
- **POST** `/api/products/seller/` - Create product
- **PUT** `/api/products/seller/{id}/` - Update product
- **DELETE** `/api/products/seller/{id}/` - Delete product

### Sales (Seller)
- **GET** `/api/products/seller/sales-summary/` - Get statistics
- **GET** `/api/products/seller/sales-orders/` - Get order history

---

## Testing the API (Optional)

### Using curl (PowerShell)
```powershell
# Login and get token
$response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/users/login/" -Method POST -Body (@{username="testseller"; password="testpass123"} | ConvertTo-Json) -ContentType "application/json"
$token = $response.access

# List products
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/products/seller/" -Headers @{Authorization="Bearer $token"}
```

### Using Python script
```bash
python test_seller_api.py
```

---

## File Structure Overview

```
backenddd/
├── products/
│   ├── models.py          # Product model with new fields
│   ├── serializers.py     # ProductSerializer, SellerProductSerializer
│   ├── views.py           # SellerProductViewSet with CRUD + sales
│   └── urls.py            # /api/products/seller/ endpoints

frontend/
├── src/
│   ├── pages/
│   │   └── SellerDashboard.jsx    # Main dashboard page
│   ├── components/
│   │   ├── ProductForm.jsx        # Add/Edit product form
│   │   └── SalesTracker.jsx       # Sales statistics & orders
│   └── styles/
│       ├── SellerDashboard.css    # Dashboard styles
│       ├── ProductForm.css        # Form styles
│       └── SalesTracker.css       # Sales tracker styles
```

---

## Next Steps

1. ✅ Add more products to your store
2. ✅ Test editing and deleting products
3. ✅ Create orders to see sales tracking in action
4. ✅ Test responsive design on mobile
5. ✅ Explore the sales summary and order details

## Need More Help?

- 📖 **Full Documentation**: See `SELLER_DASHBOARD.md`
- 📋 **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- 🔧 **API Testing**: Run `test_seller_api.py`

---

## Success Checklist

- [ ] Backend server running at http://127.0.0.1:8000
- [ ] Frontend server running at http://localhost:5173
- [ ] User registered and logged in
- [ ] "Seller Dashboard" link visible in navbar
- [ ] Dashboard loads without errors
- [ ] Can add a new product
- [ ] Can edit a product
- [ ] Can delete a product
- [ ] Sales tab displays summary cards
- [ ] No console errors in browser

If all boxes are checked, you're ready to go! 🎉

---

**Estimated total setup time:** ~10 minutes

**Congratulations!** You now have a fully functional Seller Dashboard! 🚀
