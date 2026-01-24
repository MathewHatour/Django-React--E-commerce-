"""
Test script for Seller Dashboard API endpoints
This script verifies that all seller endpoints are working correctly.
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def print_result(title, response):
    """Print formatted response"""
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")

def test_seller_endpoints():
    """Test all seller endpoints"""
    
    # Step 1: Register a test user
    print("\n1. Registering test user...")
    register_data = {
        "username": "testseller",
        "email": "testseller@example.com",
        "password": "testpass123"
    }
    response = requests.post(f"{BASE_URL}/users/register/", json=register_data)
    print_result("Register User", response)
    
    # Step 2: Login to get token
    print("\n2. Logging in...")
    login_data = {
        "username": "testseller",
        "password": "testpass123"
    }
    response = requests.post(f"{BASE_URL}/users/login/", json=login_data)
    print_result("Login", response)
    
    if response.status_code != 200:
        print("\n❌ Login failed. Cannot continue with tests.")
        return
    
    token = response.json().get("access")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Step 3: Create a product
    print("\n3. Creating a product...")
    product_data = {
        "title": "Test Product",
        "description": "This is a test product from the API test script",
        "price": "99.99",
        "stock": 50,
        "category": "Electronics",
        "brand": "TestBrand",
        "tags": "test,featured",
        "discount": "10.00",
        "image_url": "https://via.placeholder.com/300"
    }
    response = requests.post(f"{BASE_URL}/products/seller/", json=product_data, headers=headers)
    print_result("Create Product", response)
    
    if response.status_code not in [200, 201]:
        print("\n❌ Product creation failed. Continuing anyway...")
        product_id = None
    else:
        product_id = response.json().get("id")
        print(f"\n✅ Product created with ID: {product_id}")
    
    # Step 4: List seller's products
    print("\n4. Listing seller's products...")
    response = requests.get(f"{BASE_URL}/products/seller/", headers=headers)
    print_result("List Products", response)
    
    # Step 5: Get sales summary
    print("\n5. Getting sales summary...")
    response = requests.get(f"{BASE_URL}/products/seller/sales-summary/", headers=headers)
    print_result("Sales Summary", response)
    
    # Step 6: Get sales orders
    print("\n6. Getting sales orders...")
    response = requests.get(f"{BASE_URL}/products/seller/sales-orders/", headers=headers)
    print_result("Sales Orders", response)
    
    # Step 7: Update product (if created)
    if product_id:
        print(f"\n7. Updating product {product_id}...")
        update_data = {
            **product_data,
            "title": "Updated Test Product",
            "price": "89.99"
        }
        response = requests.put(f"{BASE_URL}/products/seller/{product_id}/", json=update_data, headers=headers)
        print_result("Update Product", response)
    
    # Step 8: Delete product (if created)
    if product_id:
        print(f"\n8. Deleting product {product_id}...")
        response = requests.delete(f"{BASE_URL}/products/seller/{product_id}/", headers=headers)
        print_result("Delete Product", response)
    
    print("\n" + "="*60)
    print("✅ Test completed!")
    print("="*60)

if __name__ == "__main__":
    print("="*60)
    print("Seller Dashboard API Test Script")
    print("="*60)
    print(f"Testing endpoints at: {BASE_URL}")
    print("\nNote: This script will create and delete test data.")
    
    try:
        test_seller_endpoints()
    except Exception as e:
        print(f"\n❌ Error during testing: {str(e)}")
