import { defineStore } from "pinia";

export const CartStore = defineStore("cartStore", {
  state: () => ({
    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [], 
  }),

  actions: {
    addCartItem(item) {
      const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        existingItem.quantity += item.quantity || 1; 
      } else {
        console.log("New item added");
        this.cartItems.push({
          ...item,
          quantity: item.quantity||1,
        });
        console.log("Current Log Items:");
        console.log(this.cartItems);
      }
      
      this.saveToLocalStorage(); 
    },
      
    removeCartItem(item) {
      if (!item || !item.id) {
        console.error("Invalid item passed to removeCartItem:", item);
        return;
      }
      this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id); // Filter out the item
      console.log(this.cartItems);
      this.saveToLocalStorage(); 
    },

    clearCart() {
      this.cartItems = []; 
      this.saveToLocalStorage(); 
    },

    saveToLocalStorage() {
      console.log("Local Storage updated");
      localStorage.setItem("cartItems", JSON.stringify(this.cartItems)); // Save cartItems to localStorage
    },
  },
});

export default CartStore;
