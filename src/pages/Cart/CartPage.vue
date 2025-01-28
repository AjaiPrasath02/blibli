<template>
  <main class="cart-main">
    <div class="cart-title">
      <h2 v-if="cartItems.length === 0">Your Cart is Empty</h2>
      <h2 v-else>Your Cart: <b>{{ cartItems.length }}</b></h2>
    </div>

    <div class="cart-container">
      <div v-if="cartItems.length > 0" class="cart-items">
        <div v-for="item in cartItems" :key="item.sku" class="cart-item">
          <hr />
          <div class="cart-item-row">
            <div class="cart-item-image">
              <img :src="`/images/${item.imageUrl}`" :alt="item.name" />
            </div>
            <div class="cart-item-name">
              <router-link :to="`/products/${item.id}`">{{ item.name }}</router-link>
            </div>
            <div class="cart-item-price">
              <p class="price">${{ item.price }}</p>
              <span v-if="user?.type === 'premium'" class="discount-text">(10% Discount)</span>
            </div>
            <div class="cart-item-quantity">
              <button class="btn-minus" @click="decreaseQty(item)">-</button>
              <input type="number" class="quantity-input" :value="item.quantity" readonly />
              <button class="btn-plus" @click="increaseQty(item)">+</button>
            </div>
            <img src="/images/delete_icon.png" alt="Remove Item" class="delete-icon" @click="removeItem(item)" />
          </div>
        </div>
        <hr />
      </div>

      <div :class="['order-summary', { 'empty-cart-summary': cartItems.length === 0 }]">
        <h4>Order Summary</h4>
        <hr />
        <p>Subtotal: <span>{{ totalUnits }} (Units)</span></p>
        <p>Est. Total: <span>${{ totalPrice }}</span></p>
        <hr />
        <button class="checkout-btn" @click="checkoutHandler">Place Order</button>
      </div>
    </div>

    <div class="update-section">
      <a href="#" @click.prevent="toggleUpdateSection">
        {{ showUpdateSection ? 'Cancel' : 'Do you want to update your address?' }}
      </a>
      <div v-if="showUpdateSection" class="update-form">
        <div>
          <label for="address">Update Address:</label>
          <textarea id="address" v-model="address" rows="3" placeholder="Enter your address"></textarea>
        </div>
        <div v-if="isPremiumUser">
          <label for="date-preference">Date Preference (Premium Users Only):</label>
          <input
              id="date-preference"
              type="date"
              v-model="datePreference"
              :min="minDatePreference"
            />
        </div>
      </div>
    </div>
  </main>
</template>


<script>
import { mapState, mapActions } from "pinia";
import CartStore from "../../stores/cart-store";
import order from "../../api/order";
import VariantStore from "../../stores/variant-store";


export default {
  data() {
    return {
      user: null,
      address: "",
      datePreference: null,
      showUpdateSection: false,
      isUpdateOrder: false,
      currentOrderId: null,
    };
  },
  computed: {
    ...mapState(CartStore, ["cartItems"]),
    ...mapState(VariantStore,['variants']),
    totalUnits() {
      return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    },
    totalPrice() {
      return this.cartItems.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      );
    },
    isPremiumUser() {
      return this.user?.type === "premium";
    },
    minDatePreference() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 4); 
    return currentDate.toISOString().split("T")[0]; 
  },
  },
  methods: {
    ...mapActions(CartStore, ["addCartItem", "removeCartItem", "clearCart", "saveToLocalStorage"]),
    decreaseQty(item) {
      if (item.quantity > 1) {
        item.quantity--;
        this.saveToLocalStorage();
      }
    },
    increaseQty(item) {
      if (item.quantity < item.selectedVariant.quantity) {
      item.quantity++; 
      this.saveToLocalStorage(); 
      } 
      else {
        alert(`Only ${item.selectedVariant.quantity} units are available for ${item.name}.`); 
      }
    },
    removeItem(item) {
      this.removeCartItem(item);
    },
    toggleUpdateSection() {
      this.showUpdateSection = !this.showUpdateSection;
    },
    async checkoutHandler() {
      const userId = this.user?.email;
      const phoneNumber = this.user?.mobileNumber;
      if (this.cartItems.length === 0) {
        alert("Your cart is empty. Add items to place an order.");
        return;
      }

      try {
        const orderDto = this.createOrderDto(this.cartItems, userId, phoneNumber);
        const isUpdateOrder = localStorage.getItem("isUpdateOrder") === "true";
        const currentOrderId = localStorage.getItem("currentOrderId");

        if (isUpdateOrder && currentOrderId) {
          orderDto.id = currentOrderId;
          const response = await order.updateOrder(orderDto);
          console.log("Order updated successfully:", response);
          alert("Order updated successfully!");
        } else {
          const response = await order.placeOrder(orderDto);
          console.log("Order placed successfully:", response);
          alert("Order placed successfully!");
        }

        this.clearCart();
        this.saveToLocalStorage();
        localStorage.removeItem("isUpdateOrder");
        localStorage.removeItem("currentOrderId");
        this.$router.push("/home");
      } catch (error) {
        console.error("Error processing the order:", error);
        alert("Failed to process the order. Please try again.");
      }
    },
    createOrderDto(cartItems, userId, phoneNumber) {
      const products = cartItems.map((item) => ({
        id: item.selectedVariant.id,
        sku: item.selectedVariant.sku,
        productId: item.id,
        attributes: item.selectedVariant.attributes,
        price: item.selectedVariant.price,
        quantity: item.quantity,
      }));

      const totalValue = products.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      );

      return {
        id: this.isUpdateOrder ? this.currentOrderId : this.generateUniqueId(), // Use existing ID for updates
        products: products,
        userId: userId,
        phoneNumber: phoneNumber,
        value: totalValue,
        orderStatus: "PLACED",
        address: this.address,
        datePreference: this.datePreference,
      };
    },
    generateUniqueId() {
      return `ORDER-${Date.now()}`;
    },
  },
  created() {
    
    const user = sessionStorage.getItem("userDetails");
    if (user) {
      this.user = JSON.parse(user);
      this.address = this.user?.address || "";
    }
  },
};
</script>



<style scoped>
.update-section {
  margin-top: 20px;
  text-align: center;
  margin-bottom: 40px;
}

.update-section a {
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
}

.update-form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.update-form label {
  font-weight: bold;
}

textarea,
input[type="date"] {
  width: 90%;
  max-width: 500px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  resize: none;
}

.btn-minus {
  background-color: #ff4339;
  /* Blue color */
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-minus:hover {
  background-color: #0056b3;
  /* Darker blue for hover */
}

/* Plus Button */
.btn-plus {
  background-color: #007bff;
  /* Blue color */
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-plus:hover {
  background-color: #0056b3;
  /* Darker blue for hover */
}



.cart-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

/* Cart Title */
.cart-title {
  margin-bottom: 20px;
}

.cart-title h2 {
  text-align: center;
  font-size: 1.8rem;
}

/* Cart Layout */
.cart-container {
  display: flex;
  justify-content: space-between;
  width: 90%;
  max-width: 1200px;
  gap: 40px;
}

/* Cart Items Section */
.cart-items {
  flex: 2;
  margin-right: 20px;
}

.delete-icon {
  width: 20px;
  /* Adjust size as needed */
  height: 20px;
  object-fit: contain;
  margin-left: 40px;
  cursor: pointer;
}

.price {
  margin-right: 40px;
}


.cart-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cart-item-image img {
  width: 115px;
  height: 90px;
  object-fit: contain;
}

.cart-item-name {
  flex: 1;
  padding: 0 10px;
  margin-left: 20px;
}

.cart-item-price,
.cart-item-remove {
  text-align: center;
}

.cart-item-price {
  margin-right: 30px;
}

.cart-item-quantity {
  display: flex;
  gap: 10px;
}

.quantity-input {
  width: 50px;
  text-align: center;
  margin: 0 5px;
}

/* Order Summary Section */
.order-summary {
  flex: 1;
  padding: 50px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: center;
  max-width: 300px;
  max-height: 350px;
}

.order-summary h4 {
  font-size: 1.4rem;
  margin-bottom: 10px;
}

.checkout-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
}



.checkout-btn:hover {
  background: #007bff;
}

.empty-cart-summary {
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .cart-container {
    flex-direction: column;
    align-items: center;
  }

  .order-summary {
    margin-top: 20px;
    width: 100%;
    max-width: none;
    padding: 30px;
  }

  .cart-item-row {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .cart-item-image img {
    margin-bottom: 10px;
  }

  .quantity-input {
    margin: 5px 0;
  }

  .price {
    margin-left: 40px
  }

  .delete-icon {
    margin-top: 10px;
    margin-right: 40px;
  }

  .cart-item-quantity {
    margin-top: 10px;
  }

}
</style>