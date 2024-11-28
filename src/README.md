# Groceries Project Documentation


## **1. Features**

- Search for products dynamically.
- Add items to a cart and proceed to checkout.
- Maintain a wishlist for future purchases.
- Clean and responsive design optimized for usability.

---

## **2. Installation**

### **Prerequisites**
- Node.js and npm installed on your system.

### **Steps**
1. Clone the repository:
   ```bash
   git clone https://github.com/hitaarthh/Groceries.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Groceries
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

The application will run on `http://localhost:3000`.

---

## **3. Usage**

- Navigate to the home page to search for products.
- Add items to the cart and view a summary on the Checkout page.
- Save desired products in the Wishlist for later reference.

---

## **4. Component Documentation**

### **App.js**
- **Description**: The central entry point of the application, handling routing and global context.
- **Features**:
  - Implements `react-router-dom` for navigation.
  - Manages global search term state.
  - Provides cart context via `CartProvider`.
- **Routes**:
  - `/`: Displays the `SearchPage` component with a search bar.
  - `/checkout`: Renders the `CheckoutPage` for cart review and payment.
  - `/wishlist`: Displays saved products via the `WishlistPage`.

---

### **Pages**

#### **SearchPage.jsx**
- **Purpose**: Allows users to search for products dynamically.
- **Props**:
  - `searchTerm`: The current search query from the `App.js` state.
- **Features**:
  - Filters products based on the search query.
  - Integrates with other components like `ProductCard`.

#### **CheckoutPage.jsx**
- **Purpose**: Provides a summary of the cart and the option to proceed with payment.
- **Features**:
  - Displays the cart's contents using `CartSummary`.
  - Calculates totals and applies any applicable offers.

#### **WishlistPage.jsx**
- **Purpose**: Displays products saved by the user for future reference.
- **Features**:
  - Interacts with the global cart to allow quick additions.

---

### **Components**

#### **Header.jsx**
- **Purpose**: The top navigation bar of the application.
- **Props**:
  - `searchTerm`: Current search query.
  - `setSearchTerm`: Function to update the search query.
- **Features**:
  - Displays the app's name/logo.
  - Offers a search input field.
  - Links to pages like Wishlist and Checkout.

#### **OffersPanel.jsx**
- **Purpose**: Displays special offers and discounts.
- **Features**:
  - Provides a visually appealing panel to showcase promotions.
  - Intended for use across multiple pages.

#### **ProductCard.jsx**
- **Purpose**: Displays individual product information.
- **Props**:
  - `product`: Object containing product details.
- **Features**:
  - Includes "Add to Cart" and "Add to Wishlist" buttons.
  - Displays essential product data like name, price, and image.

#### **CartSummary.jsx**
- **Purpose**: Summarizes the cart for the checkout process.
- **Features**:
  - Lists all cart items.
  - Displays total cost and applicable discounts.
  - Provides a call-to-action button for checkout.

---

## **5. Context**

#### **CartContext.jsx**
- **Purpose**: Manages the application's global cart state.
- **Features**:
  - Functions to add, remove, and clear items.
  - Tracks the total price and item count.
  - Uses React's Context API for seamless state sharing.

---

## **6. Styling**

- **Approach**: The project uses Tailwind CSS for styling.
- **Features**:
  - Consistent design with responsive layouts.
  - Lightweight and maintainable CSS classes.
- **Customization**: All styling configurations can be found in `tailwind.config.js`.

---

## **7. Future Improvements**

- Add user authentication for a personalized experience.
- Integrate a backend service for dynamic product data.
- Enhance the UI with animations and transitions.

---
