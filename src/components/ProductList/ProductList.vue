
<template>
  <section class="product-list" >
    <template v-if="products.length > 0">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
      >
      <img :src="`/images/${product.imageUrl}`" :alt="product.name" />
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <p>Price: ${{ product.price }}</p>
        <button @click="addToCart(product)">Add to Cart</button>
      </div>
    </template>
    <p v-else>No products found.</p>
  </section>
</template>

<script>


export default {
  name: "ProductList",
  props: {
    products: {
      type: Array,
      required: true,
    },
    showFilters: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["add-to-cart"],
  methods: {
    
    addToCart(product) {
      console.log(this.showFilters);
      this.$emit("add-to-cart", product);
    },
    printFilter(){
      console.log(this.showFilters);
    }
  },
  watch: {
    showFilters: "printFilter", 
  },
};

</script>

<style scoped>
.product-list {
  display: flex;
  flex-wrap: wrap; 
  gap: 25px;
  margin-top: 20px;
  justify-content: center;
  padding: 0 20px; 
  box-sizing: border-box; 
}

/* Product Card Styles */
.product-card {
  width: 240px;
  height: 400px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.product-card:hover {
  transform: translateY(-5px); /* Moves the card slightly upward */
  box-shadow: 0 10px 20px rgba(0, 123, 255, 0.5); /* Adds blue box shadow */
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: contain; /* Maintain aspect ratio without cropping */
  border-radius: 5px;
  background-color: #f4f4f4;
}

/* Product Name and Description */
.product-card h3 {
  font-size: 18px;
  margin: 5px 0;
}

.product-card p {
  font-size: 14px;
  margin: 5px 0;
}


.product-card button {
  background: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.product-card button:hover {
  background: #0056b3;
}


@media (max-width: 768px) {

.product-list {
    gap: 15px;
    justify-content: center;
    width: 95%;
}

.product-card {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
    margin-bottom: 15px;
}

}
</style>
