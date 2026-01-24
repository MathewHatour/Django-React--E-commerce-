# Seller Dashboard Documentation

This document provides comprehensive information about the Seller Dashboard feature, including setup, usage, and API documentation.

## Overview

The Seller Dashboard allows authenticated users to:
- Create, read, update, and delete their own products
- Track sales and orders containing their products
- View sales statistics and revenue
- Manage product inventory and pricing
- Apply discounts to products

## Features

### Product Management
- **Add New Products**: Create products with title, description, price, stock, category, brand, tags, discount, and images
- **Edit Products**: Update product details inline or via modal
- **Delete Products**: Remove products with confirmation dialog
- **View Products**: Display all seller's products in a responsive table
- **Search & Filter**: Search products by title, category, or brand

### Sales Tracking
- **Sales Summary**: View total products, orders, items sold, and revenue
- **Order History**: See all orders containing seller's products
- **Order Details**: Expandable order items with product information
- **Customer Information**: View customer names and order dates

## Backend API Endpoints

### Base URL
```
http://127.0.0.1:8000/api/products/seller/
```

### Authentication
All seller endpoints require JWT authentication. Include the token in request headers:
```
Authorization: Bearer <access_token>
```

### Endpoints

#### 1. List Seller's Products
**GET** `/api/products/seller/`

**Response:**
```json
[
  {
    "id": 1,
    "title": "Product Name",
    "description": "Product description",
    "price": "99.99",
    "stock": 50,
    "category": "Electronics",
    "brand": "BrandName",
    "tags": "featured,new",
    "discount": "10.00",
    "image_url": "https://example.com/image.jpg",
    "additional_images": "[\"url1\", \"url2\"]",
    "rating": "4.50",
    "reviews_count": 25,
    "created_at": "2026-01-24T10:00:00Z",
    "updated_at": "2026-01-24T10:00:00Z",
    "discounted_price": "89.99"
  }
]
```

#### 2. Create New Product
**POST** `/api/products/seller/`

**Request Body:**
```json
{
  "title": "New Product",
  "description": "Product description",
  "price": "99.99",
  "stock": 50,
  "category": "Electronics",
  "brand": "BrandName",
  "tags": "featured,new",
  "discount": "10.00",
  "image_url": "https://example.com/image.jpg",
  "additional_images": "[\"url1\", \"url2\"]"
}
```

**Validation Rules:**
- `title`: Required, max 200 characters
- `description`: Required
- `price`: Required, must be > 0
- `stock`: Required, must be >= 0
- `discount`: Optional, must be 0-100
- `additional_images`: Must be valid JSON array

#### 3. Update Product
**PUT** `/api/products/seller/{id}/`

**Request Body:** Same as Create

#### 4. Partial Update Product
**PATCH** `/api/products/seller/{id}/`

**Request Body:** Include only fields to update

#### 5. Delete Product
**DELETE** `/api/products/seller/{id}/`

**Response:** `204 No Content`

#### 6. Sales Summary
**GET** `/api/products/seller/sales-summary/`

**Response:**
```json
{
  "total_products": 10,
  "total_orders": 45,
  "total_items_sold": 150,
  "total_revenue": 4599.50
}
```

#### 7. Sales Orders
**GET** `/api/products/seller/sales-orders/`

**Response:**
```json
[
  {
    "order_id": 1,
    "customer": "john_doe",
    "created_at": "2026-01-24T10:00:00Z",
    "items": [
      {
        "product_id": 1,
        "product_title": "Product Name",
        "quantity": 2,
        "price": 99.99,
        "total": 199.98
      }
    ],
    "total": 199.98
  }
]
```

## Frontend Components

### 1. SellerDashboard (`SellerDashboard.jsx`)
Main dashboard component with tabs for Products and Sales.

**Props:** None

**State:**
- `products`: Array of seller's products
- `loading`: Loading state
- `error`: Error message
- `showAddForm`: Show/hide add product form
- `editingProduct`: Product being edited
- `activeTab`: 'products' or 'sales'

### 2. ProductForm (`ProductForm.jsx`)
Form for adding/editing products.

**Props:**
- `product`: Product object (for editing) or null (for adding)
- `onSubmit(productId, productData)`: Callback when form is submitted
- `onCancel()`: Callback when form is cancelled

**Features:**
- Form validation
- Real-time error messages
- Image preview
- Responsive design

### 3. SalesTracker (`SalesTracker.jsx`)
Component for displaying sales statistics and order history.

**Props:** None

**Features:**
- Summary cards with statistics
- Expandable order cards
- Real-time data fetching
- Responsive grid layout

## Frontend Usage

### Accessing the Dashboard
Navigate to: `http://localhost:5173/seller/dashboard`

**Note:** User must be logged in to access the dashboard.

### Adding a Product
1. Click "Add New Product" button
2. Fill in the form fields:
   - Title (required)
   - Description (required)
   - Price (required, > 0)
   - Stock (required, >= 0)
   - Category (optional)
   - Brand (optional)
   - Tags (optional, comma-separated)
   - Discount (optional, 0-100%)
   - Image URL (optional)
   - Additional Images (optional, JSON array)
3. Click "Add Product"

### Editing a Product
1. Click "Edit" button on a product row
2. Modify the fields
3. Click "Update Product"

### Deleting a Product
1. Click "Delete" button on a product row
2. Confirm deletion in the dialog

### Viewing Sales
1. Click "Sales & Orders" tab
2. View summary statistics
3. Click on an order to expand and see items

## Database Schema

### Product Model Extensions
New fields added to the Product model:

```python
category = models.CharField(max_length=100, blank=True, default='')
brand = models.CharField(max_length=100, blank=True, default='')
tags = models.CharField(max_length=500, blank=True, default='')
discount = models.DecimalField(max_digits=5, decimal_places=2, default=0, blank=True)
additional_images = models.TextField(blank=True, default='[]')
created_at = models.DateTimeField(auto_now_add=True)
updated_at = models.DateTimeField(auto_now=True)
```

### Migration
A migration file has been created: `0004_product_additional_images_product_brand_and_more.py`

To apply: `python manage.py migrate`

## Styling

### CSS Files
- `SellerDashboard.css`: Main dashboard styles
- `ProductForm.css`: Form component styles
- `SalesTracker.css`: Sales tracking component styles

### Responsive Breakpoints
- Desktop: > 1200px
- Tablet: 768px - 1200px
- Mobile: < 768px

### Color Scheme
- Primary: `#3b82f6` (Blue)
- Success: `#16a34a` (Green)
- Error: `#dc2626` (Red)
- Background: `#f9fafb` (Light Gray)
- Text: `#1f2937` (Dark Gray)

## Security Features

### Authentication
- JWT token required for all seller endpoints
- Token sent in Authorization header

### Authorization
- Sellers can only view/edit/delete their own products
- `perform_create` automatically sets seller to current user
- `perform_update` prevents seller field from being changed
- `get_queryset` filters products by current user

### Input Validation
- Backend: DRF serializer validation
- Frontend: Form validation before submission
- Price, stock, and discount range validation
- JSON validation for additional_images

## Testing

### Backend Testing
```bash
# Test seller product creation
curl -X POST http://127.0.0.1:8000/api/products/seller/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Product",
    "description": "Test description",
    "price": "99.99",
    "stock": 10
  }'

# Test sales summary
curl http://127.0.0.1:8000/api/products/seller/sales-summary/ \
  -H "Authorization: Bearer <token>"
```

### Frontend Testing
1. Login to the application
2. Navigate to `/seller/dashboard`
3. Test adding a product
4. Test editing a product
5. Test deleting a product
6. Test switching between tabs
7. Test responsive design on mobile

## Troubleshooting

### "Authentication credentials were not provided"
- Ensure user is logged in
- Check that JWT token is in localStorage
- Verify token is being sent in Authorization header

### "Failed to load products"
- Check that backend server is running
- Verify API endpoint URL is correct
- Check browser console for errors

### Images not displaying
- Verify image URL is accessible
- Check CORS settings if images are from external domain
- Ensure URL is properly formatted

### Form validation errors
- Check all required fields are filled
- Verify price and stock are positive numbers
- Ensure discount is between 0-100
- Validate additional_images is valid JSON array

## Future Enhancements

Potential improvements for future versions:
- Image upload to server (not just URLs)
- Bulk product import/export (CSV)
- Product variants (size, color, etc.)
- Inventory alerts for low stock
- Sales analytics with charts
- Product reviews management
- Shipping management
- Multi-currency support
- Product categorization with hierarchy
- SEO optimization fields

## Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Check backend logs
4. Verify database migrations are applied
5. Ensure all dependencies are installed
