
 <template>
  <section v-if="selectedProduct" class="product-page">
    <div class="product-image">
      <img :src="`/images/${selectedProduct.imageUrl}`" :alt="selectedProduct.name" />
    </div>
    <div class="product-description">
      <h1>{{ selectedProduct.name }}</h1>
      <p><strong>Brand:</strong> {{ selectedProduct.brand }}</p>
      <p><strong>Rating:</strong> {{ selectedProduct.rating }} ⭐</p>
      <p>{{ selectedProduct.description }}</p>

      <div class="product-variants" v-if="groupedVariants">
        <div
          v-for="(values, attributeName) in groupedVariants"
          :key="attributeName"
          class="variant-group"
        >
          <label class="variant-label">{{ attributeName }}:</label>
          <select
            class="variant-select"
            v-model="selectedAttributes[attributeName]"
            @change="onVariantChange"
          >
            <option disabled value="">Select {{ attributeName }}</option>
            <option
              v-for="value in values"
              :key="value"
              :value="value"
              class="variant-option"
            >
              {{ value }}
            </option>
          </select>
        </div>
      </div>

      <p v-if="selectedVariant">
        <strong>Price:</strong> ${{ selectedVariant.price }}
      </p>

      <p v-if="selectedVariant && selectedVariant.quantity === 0" class="out-of-stock">
        No stock available for the selected variant.
      </p>

      <div class="cart-buy">
        <button
          class="product-button"
          :disabled="!selectedVariant || selectedVariant.quantity === 0"
          @click="addToCart"
        >
          Add to Cart
        </button>
        <button 
          class="product-button" 
          id="buy-now" 
          :disabled="!selectedVariant || selectedVariant.quantity === 0"
          @click="buyNow"
        >
          Buy Now
      </button>
      </div>
    </div>
  </section>
  <p v-else>Loading product details...</p>
</template>

<script>
import { mapActions, mapState } from "pinia";
import ProductStore from "../../stores/product-store";
import VariantStore from "../../stores/variant-store";
import CartStore from "../../stores/cart-store";

export default {
  data() {
    return {
      user: null,
      selectedAttributes: {},
      selectedVariant: null,
    };
  },
  props: {
    id: String,
  },
  computed: {
    ...mapState(ProductStore, ["selectedProduct"]),
    ...mapState(VariantStore, ["variants"]),
    groupedVariants() {
      if (!this.variants) return null;
      return this.variants.reduce((acc, variant) => {
        Object.entries(variant.attributes).forEach(([key, value]) => {
          if (!acc[key]) acc[key] = [];
          if (!acc[key].includes(value)) acc[key].push(value);
        });
        return acc;
      }, {});
    },
  },
  methods: {
    ...mapActions(ProductStore, ["fetchProductById"]),
    ...mapActions(VariantStore, ["fetchVariantsByProductId"]),
    ...mapActions(CartStore, ["addCartItem"]),
    async fetchProductDetails() {
      try {
        await this.fetchProductById(this.id);
        await this.fetchVariantsByProductId(this.id);
      } catch (error) {
        console.error("Error fetching product details or variants:", error);
      }
    },
    onVariantChange() {
      this.selectedVariant = this.variants.find((variant) =>
        Object.entries(this.selectedAttributes).every(
          ([key, value]) => variant.attributes[key] === value
        )
      );
      if (this.selectedVariant) {
        console.log("Selected Variant:", this.selectedVariant);
      } else {
        console.error("No matching variant found for selected attributes.");
      }
    },
    addToCart() {
      if (!this.selectedVariant) {
        alert("Please select all attributes");
        return;
      }

      console.log(this.user?.type);
      const discountPrice = this.user?.type === "premium" 
      ? Math.round(this.selectedVariant.price * 0.9) 
      : Math.round(this.selectedVariant.price);
      console.log(discountPrice);

       console.log(discountPrice);
      const cartItem = {
        ...this.selectedProduct,
        selectedVariant: { ...this.selectedVariant, price: discountPrice },
        price: discountPrice,
      };
      // const cartItem = {
      //   ...this.selectedProduct,
      //   selectedVariant: this.selectedVariant,
      // };
      console.log("cart:",cartItem)
      this.addCartItem(cartItem);
      alert("Product added to cart!");
    },
    buyNow() {
      console.log("Buying now with variant:", this.selectedVariant);
      this.addToCart();
      this.$router.push('/cart')
    },
  },
  created() {
    this.fetchProductDetails();
    const user = sessionStorage.getItem("userDetails");
    if (user) {
      this.user = JSON.parse(user);
    }
    else {
    console.warn("User details not found, defaulting to guest.");
  }
  },
};
</script>



<style scoped>

template{
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
  color: #333;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.product-page {
  margin-top:60px;
  display: flex;
  align-items: flex-start;
  
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.product-image {
  width: 50%;
  display: flex;
  justify-content: center; /* Center the image horizontally */
  align-items: center;    /* Center the image vertically */
}

.product-image img {
  max-width: 100%; /* Ensure the image doesn’t exceed its container width */
  height: 500px; /* Limit the height for consistency */
  width:400px;
  object-fit: contain; /* Preserve aspect ratio */
  padding: 30px;
  border: 1px solid #ddd; /* Optional: Add a border for a polished look */
  border-radius: 8px; /* Optional: Add rounded corners */
  background-color: #fff; /* Optional: Set a background for better appearance */
}

.product-description {
  flex: 1;
  font-family: Arial, sans-serif;
  gap:10px;
}

.product-description h1 {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 15px;
}

.product-description p {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 10px;
}
.out-of-stock {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}


.product-button {
  margin-top:20px;
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width:150px;
  height:40px;
}

.product-button:hover {
  background: #0056b3;
}
.cart-buy{
  margin-top:35px;
  display:flex;
  gap:40px;
  height:50px;
}

.cart-buy #buy-now{
    background-color: #ffb300;
}

.product-variants {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap; 
  gap: 20px; 
  margin-top: 20px; 
}

.variant-group {
  display: flex;
  flex-direction: column; 
  min-width: 150px; 
  
}

.variant-label {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 8px; 
  color: #333;
}

.variant-select {
  width: 25%; 
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;
}

.variant-select:hover {
  border-color: #007bff;
}

.variant-select:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.variant-option {
  font-size: 1rem;
  color: #333;
}

@media (max-width: 768px) {
  .product-page {
    flex-direction: column; 
    align-items: center; 
  }

  .product-image {
    width: 100%; 
    margin-bottom: 20px; 
  }

  .product-image img {
    height: 400px;
    width: 90%; 
    max-width: 300px; 
  }

  .product-description {
    width: 100%; 
    text-align: center; 
    padding: 10px;
  }

  .product-description h1 {
    font-size: 1.5rem; 
  }

  .product-description p {
    font-size: 0.9rem; 
  }

  .variant-group {
  display: flex;
  flex-direction: column; 
  min-width: 150px; 
  align-items: center;
}
}
</style>