


  <!-- <template>
    <div class="order-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <span 
            class="order-id clickable" 
            @click="$emit('view-tracking', order.id)"
          >
            Order #{{ order.id }}
          </span>
          <span class="order-status">{{ order.orderStatus }}</span>
        </div>
        <div class="order-details">
          <div class="order-products">
            <h3>Products:</h3>
            <table>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in order.products" :key="product.id">
                  <td>{{ product.sku }}</td>
                  <td>{{ product.quantity }}</td>
                  <td>Rs. {{ product.price.toLocaleString() }}</td>
                  <td>Rs. {{ (product.quantity * product.price).toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="order-summary">
            <p>Total Value: Rs. {{ order.value.toLocaleString() }}</p>
            <p>Order Date: {{ formatDate(order.date) }}</p>
            <div class="order-actions">
              <button 
                @click="reorderEntireOrder(order)" 
                class="btn btn-reorder"
              >
                Reorder
              </button>
              <button 
                v-if="!['DELIVERED', 'CANCELED'].includes(order.orderStatus)"
                @click="updateOrder(order)" 
                class="btn btn-update"
              >
                Update Order
              </button>
              <button 
                v-if="!['DELIVERED', 'CANCELED'].includes(order.orderStatus)"
                @click="$emit('cancel-order', order.id)" 
                class="btn btn-cancel"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions } from "pinia";
  import CartStore from '../../stores/cart-store';
  import productApi from "../../api/product";
  export default {
    props: {
      orders: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      ...mapActions(CartStore, ["addCartItem", "saveToLocalStorage","clearCart"]),
      formatDate(dateString) {
        return new Date(dateString).toLocaleString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      },
      async updateOrder(order) {
        this.clearCart();
        localStorage.setItem("isUpdateOrder", "true"); 
        localStorage.setItem("currentOrderId", order.id);
        try {
        const products = await Promise.all(
          order.products.map(async (product) => {
            const productDetails = await productApi.getProductById(product.productId);
            return {
              id: product.productId,
              name: productDetails.name || "Unknown Product",
              sku: product.sku,
              price: product.price,
              quantity: product.quantity,
              selectedVariant: {
                id: product.id,
                sku: product.sku,
                attributes: product.attributes,
                price: product.price,
              },
              imageUrl: productDetails.imageUrl || "default.jpg",
            };
          })
        );

        products.forEach((cartItem) => {
          this.addCartItem(cartItem);
        });

        this.saveToLocalStorage();
        this.$router.push("/cart");
      } catch (error) {
        console.error("Error updating products:", error);
      }
    
       },
       async reorderEntireOrder(order) {
      try {
        const products = await Promise.all(
          order.products.map(async (product) => {
            const productDetails = await productApi.getProductById(product.productId);
            return {
              id: product.productId,
              name: productDetails.name || "Unknown Product",
              sku: product.sku,
              price: product.price,
              quantity: product.quantity,
              selectedVariant: {
                id: product.id,
                sku: product.sku,
                attributes: product.attributes,
                price: product.price,
              },
              imageUrl: productDetails.imageUrl || "default.jpg",
            };
          })
        );

        products.forEach((cartItem) => {
          this.addCartItem(cartItem);
        });

        this.saveToLocalStorage();
        this.$router.push("/cart");
      } catch (error) {
        console.error("Error reordering products:", error);
      }
    }

    }
  }
  </script>
  <style scoped>
  .order-list {
    background-color: #f0f4f8;
    border-radius: 8px;
  }
  
  .order-card {
    background-color: white;
    border: 1px solid #e1e8f0;
    margin: 10px 0;
    padding: 15px;
    border-radius: 5px;
  }
  
  .order-header {
    display: flex;
    justify-content: space-between;
    color: #0066cc;
    border-bottom: 1px solid #e1e8f0;
    padding-bottom: 10px;
  }
  
  .order-status {
    color: #4a90e2;
    font-weight: bold;
  }
  
  .order-details {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  
  .order-products table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .order-products th, 
  .order-products td {
    border: 1px solid #e1e8f0;
    padding: 8px;
    text-align: left;
  }
  
  .order-summary {
    text-align: right;
    color: #2c3e50;
  }
  
  @media screen and (max-width: 600px) {
    .order-details {
      flex-direction: column;
    }
  
    .order-products table {
      font-size: 0.9em;
    }
  
    .order-summary {
      text-align: left;
      margin-top: 10px;
    }
    .order-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    margin-bottom: 5px;
  }
  }

  .order-id.clickable {
  cursor: pointer;
  color: #0066cc;
  text-decoration: underline;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.btn {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-update {
  background-color: #4a90e2;
  color: white;
}

.btn-cancel {
  background-color: #ff4d4d;
  color: white;
}
.btn-reorder {
  background-color: #4CAF50;
  color: white;
}

</style> -->


<template>
      <div v-if="orders.length==0" class="no-orders"><p>Nothings's cooking here yet. Let's change that!</p></div>

  <div class="order-list" v-if = "orders.length != 0">
    <div v-for="order in orders" :key="order.id" class="order-card">
      <div class="order-header">
        <span 
          class="order-id clickable" 
          @click="$emit('view-tracking', order.id)"
        >
          Order #{{ order.id }}
        </span>
        <span :class="['order-status', order.orderStatus.toLowerCase()]">
          {{ order.orderStatus }}
        </span>
      </div>
      <div class="order-details">
        <div class="order-products">
          <h3>Products:</h3>
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in order.products" :key="product.id">
                <td>{{ product.sku }}</td>
                <td>{{ product.quantity }}</td>
                <td>Rs. {{ product.price.toLocaleString() }}</td>
                <td>Rs. {{ (product.quantity * product.price).toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="order-summary">
          <p><strong>Total Value:</strong> Rs. {{ order.value.toLocaleString() }}</p>
          <p><strong>Order Date:</strong> {{ formatDate(order.date) }}</p>
          <div class="order-actions">
            <button 
              @click="reorderEntireOrder(order)" 
              class="btn btn-reorder"
            >
              Reorder
            </button>
            <button 
              v-if="!['delivered', 'canceled'].includes(order.orderStatus.toLowerCase())"
              @click="updateOrder(order)" 
              class="btn btn-update"
            >
              Update Order
            </button>
            <button 
              v-if="!['delivered', 'canceled'].includes(order.orderStatus.toLowerCase())"
              @click="$emit('cancel-order', order.id)" 
              class="btn btn-cancel"
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from "pinia";
  import CartStore from '../../stores/cart-store';
  import productApi from "../../api/product";
  export default {
    props: {
      orders: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      ...mapActions(CartStore, ["addCartItem", "saveToLocalStorage","clearCart"]),
      formatDate(dateString) {
        return new Date(dateString).toLocaleString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      },
      async updateOrder(order) {
        this.clearCart();
        localStorage.setItem("isUpdateOrder", "true"); 
        localStorage.setItem("currentOrderId", order.id);
        try {
        const products = await Promise.all(
          order.products.map(async (product) => {
            const productDetails = await productApi.getProductById(product.productId);
            return {
              id: product.productId,
              name: productDetails.name || "Unknown Product",
              sku: product.sku,
              price: product.price,
              quantity: product.quantity,
              selectedVariant: {
                id: product.id,
                sku: product.sku,
                attributes: product.attributes,
                price: product.price,
              },
              imageUrl: productDetails.imageUrl || "default.jpg",
            };
          })
        );

        products.forEach((cartItem) => {
          this.addCartItem(cartItem);
        });

        this.saveToLocalStorage();
        this.$router.push("/cart");
      } catch (error) {
        console.error("Error updating products:", error);
      }
    
       },
       async reorderEntireOrder(order) {
      try {
        const products = await Promise.all(
          order.products.map(async (product) => {
            const productDetails = await productApi.getProductById(product.productId);
            return {
              id: product.productId,
              name: productDetails.name || "Unknown Product",
              sku: product.sku,
              price: product.price,
              quantity: product.quantity,
              selectedVariant: {
                id: product.id,
                sku: product.sku,
                attributes: product.attributes,
                price: product.price,
              },
              imageUrl: productDetails.imageUrl || "default.jpg",
            };
          })
        );

        products.forEach((cartItem) => {
          this.addCartItem(cartItem);
        });

        this.saveToLocalStorage();
        this.$router.push("/cart");
      } catch (error) {
        console.error("Error reordering products:", error);
      }
    }

    }
  }
  </script>

<style scoped>
.order-list {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-card {
  background-color: white;
  border: 1px solid #dee2e6;
  margin: 15px 0;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.order-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.order-id.clickable {
  cursor: pointer;
  color: #007bff;
  font-weight: bold;
  text-decoration: underline;
}

.order-id.clickable:hover {
  color: #0056b3;
}

.order-status {
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: capitalize;
  padding: 5px 10px;
  border-radius: 15px;
}

.order-status.delivered {
  background-color: #28a745;
  color: white;
}

.order-status.canceled {
  background-color: #dc3545;
  color: white;
}

.order-status.placed {
  background-color: #007bff;
  color: white;
}

.order-details {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 10px;
}

.order-products table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.order-products th, 
.order-products td {
  border: 1px solid #dee2e6;
  padding: 8px;
  text-align: left;
}

.order-summary {
  text-align: right;
  margin-top: 10px;
}

.order-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-reorder {
  background-color: #28a745;
  color: white;
}

.btn-reorder:hover {
  background-color: #218838;
}

.btn-update {
  background-color: #007bff;
  color: white;
}

.btn-update:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.btn-update:hover:enabled {
  background-color: #0056b3;
}

.btn-cancel {
  background-color: #dc3545;
  color: white;
}

.btn-cancel:hover {
  background-color: #c82333;
}

.no-orders {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20vh; /* Centers the text vertically on the page */
  text-align: center;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb); /* Gradient background */
  color: #0d47a1;
  font-family: 'Poppins', sans-serif; /* Modern, clean font */
  font-size: 1.0rem; /* Adjust the size as needed */
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* Soft shadow for a polished look */
  margin: 20px; /* Space around the container */
  padding: 20px; /* Inner padding for better spacing */
  animation: fadeIn 1.2s ease-in-out; /* Subtle entrance animation */
}

.no-orders p {
  max-width: 600px;
  line-height: 1;
  font-weight: 500;
  font-family: 'Segoe UI', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media screen and (max-width: 600px) {
  .order-details {
    flex-direction: column;
  }
  
  .order-summary {
    text-align: left;
  }
}
</style> 

