# Jumboi Shipping

This is a B2B e-commerce marketplace shipping charge calculator application.

## Prerequisites

- Node.js (v14 or later)
- MongoDB

## Installation

1. Clone the repository: git clone

2. Install dependencies: npm install

3. Set up environment variables:
   Copy the `.env.example` file to `.env` and update the values as needed.

4. Start MongoDB:
   Make sure your MongoDB server is running.

## Running the Application

To start the server in development mode: npm run dev

To start the server in production mode: npm start

The server will start on the port specified in your `.env` file (default is 3000).

## Running Tests

To run the test suite: npm test

## API Endpoints

1. Create Customer:
   Endpoint: /api/v1/customer
   Method: POST
   Description: Creates a new customer in the system

2. Create Warehouse
   Endpoint: /api/v1/warehouse
   Method: POST
   Description: Adds a new warehouse to the system

3. Create Seller
   Endpoint: /api/v1/seller
   Method: POST
   Description: Registers a new seller in the system

4. Create Product
   Endpoint: /api/v1/product
   Method: POST
   Description: Adds a new product to the system

5. Get All Warehouses
   Endpoint: /api/v1/warehouse/all
   Method: GET
   Description: Retrieves a list of all warehouses in the system

6. Get Nearest Warehouse
   Endpoint: /api/v1/warehouse/nearest
   Method: GET
   Query Parameters: sellerId, productId
   Description: Finds the nearest warehouse based on seller and product information

7. Get Shipping Charge for Customer from Warehouse
   Endpoint: /api/v1/shipping-charge
   Method: GET
   Body Parameters: warehouseId, customerId, deliverySpeed
   Description: Calculates the shipping charge for a customer from a specific warehouse

8. Calculate Shipping Charges for Multiple Items
   Endpoint: /api/v1/shipping-charge/calculate
   Method: POST
   Body Parameters: sellerId, customerId, deliverySpeed, items (array of itemId and quantity)
   Description: Calculates shipping charges for multiple items from a seller to a customer

## Project Structure

- `src/`: Source code
- `controllers/`: Request handlers
- `models/`: Database models
- `services/`: Business logic
- `routes/`: API routes
- `utils/`: Utility functions
- `tests/`: Test files
- `config/`: Configuration files

# Necessary Powershell Commands:

1. Create Customer :

   $customerData = @{
   customerId = "customer123"
   name = "Test Customer"
   phoneNumber = "9876543210"
   location = @{
   lat = 40.7589
   lng = -73.9851
   }
   address = "789 Customer St, New York, NY 10003"
   email = "customer@test.com"
   } | ConvertTo-Json

2. Create Warehouse :

   $warehouseData = @{
   name = "Test Warehouse"
   location = @{
   lat = 40.7128
   lng = -74.0060
   }
   address = "123 Test St, New York, NY 10001"
   capacity = 1000
   } | ConvertTo-Json

   $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/warehouse" -Method Post -Body $warehouseData -ContentType "application/json"
   $warehouseId = $response.warehouseId
   Write-Output "Created Warehouse ID: $warehouseId"

3. Create Seller:

   $sellerData = @{
   sellerId = "seller123"
   name = "Test Seller"
   email = "seller@test.com"
   phoneNumber = "1234567890"
   address = "456 Seller St, New York, NY 10002"
   location = @{
   lat = 40.7282
   lng = -73.9942
   }
   } | ConvertTo-Json

   $seller = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/seller" -Method Post -Body $sellerData -ContentType "application/json"
   Write-Output "Created Seller:"
   $seller | Format-List

4. Create product :

   $productData = @{
   productId = "product123"
   name = "Test Product"
   category = "Test Category"
   sellerId = "seller123"
   sellingPrice = 100
   weight = 1
   dimensions = @{
   length = 10
   width = 10
   height = 10
   }
   stockQuantity = 100
   } | ConvertTo-Json

   $product = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/product" -Method Post -Body $productData -ContentType "application/json"
   Write-Output "Created Product:"
   $product | Format-List

5. Get all Warehouse :

   $warehouses = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/warehouse/all" -Method Get
   Write-Output "All Warehouses:"
   $warehouses | Format-Table -AutoSize

6. Get Nearest Warehouse:
   $nearestWarehouse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/warehouse/nearest?sellerId=seller123&productId=product123" -Method Get
   Write-Output "Nearest Warehouse:"
   $nearestWarehouse | Format-List

7. Get the Shipping Charge for a Customer from a Warehousee:
   $warehouseId = "warehouseID"
   $customerId = "customerID"
   $deliverySpeed = "standard"
   $uri = "http://localhost:3000/api/v1/shipping-charge?warehouseId=$warehouseId&customerId=$customerId&deliverySpeed=$deliverySpeed"
   $shippingCharge = Invoke-RestMethod -Uri $uri -Method Get
   Write-Output "Shipping Charge:"
   $shippingCharge | Format-List

8. Get the Shipping Charges for a Seller and Customer:
   $multipleItemsData = @{
   sellerId = "sellerID"
   customerId = "CustomerID"
   deliverySpeed = "standard"
   items = @(
   @{
   itemId = "product123"
   quantity = 2
   },
   @{
   itemId = "product456"
   quantity = 1
   }
   )
   } | ConvertTo-Json

   $multipleItemsCharge = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/shipping-charge/calculate" -Method Post -Body $multipleItemsData -ContentType "application/json"
   Write-Output "Shipping Charges for Multiple Items:"
   $multipleItemsCharge | Format-List
