

 <template>
  <div class="home-page">
    <div class="main-content">
      <Filter
        v-if="showFilters"
        :categories="categories"
        :brands="brands"
        :ratings="ratings"
        @updateCategory="updateCategory"
        @updateBrand="updateBrand"
        @updateRating="updateRating"
      />
      <ProductList v-if=!isProductError :products="paginatedProducts" @add-to-cart="handleAddToCart" :show-filters="showFilters" />
    </div>
    <div class="pagination">
      <button
        :disabled="currentPage === 1"
        class="pagination-btn"
        @click="changePage(currentPage - 1)"
      >
        <img src="@/assets/images/icons8-arrow-left-50 (1).png" alt="Previous" class="pagination-icon" />
      </button>
      <span
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="changePage(page)"
      >
        {{ page }}
      </span>
      <button
        :disabled="currentPage === totalPages"
        class="pagination-btn"
        @click="changePage(currentPage + 1)"
      >
        <img src="@/assets/images/icons8-arrow-right-50 (1).png" alt="Next" class="pagination-icon" />
      </button>
    </div>
  </div>
</template>

<script>
import Filter from "@/components/Filter/Filter.vue";
import ProductList from "@/components/ProductList/ProductList.vue";
import { mapState, mapActions } from "pinia";
import { ProductStore } from "@/stores/product-store";

export default {
  props: {
    searchQuery: {
      type: String,
      default: "",
    },
    showFilters: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Filter,
    ProductList,
  },
  data() {
    return {
      isLoading: true,
      error: null,
      filteredProducts: [],
      currentPage: 1,
      productsPerPage: 8,
      categories: [
        "Electronics",
        "Mobile",
        "Headphones",
        "Books",
        "Clothes",
        "Shoes",
        "Sports",
        "Home Appliances",
        "Furnitures",
      ],
      brands: ["Realme", "Apple", "Samsung", "Sony"],
      ratings: [1, 2, 3, 4, 5],
      selectedFilters: {
        category: [],
        brand: "",
        rating: null,
      },
    };
  },
  computed: {
    ...mapState(ProductStore, ["productList"]),
    paginatedProducts() {
      const startIndex = (this.currentPage - 1) * this.productsPerPage;
      const endIndex = startIndex + this.productsPerPage;
      return this.filteredProducts.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.productsPerPage);
    },
  },
  methods: {
    ...mapActions(ProductStore, ["fetchAllProducts"]),
    async loadProducts() {
      try {
        await this.fetchAllProducts(); 
        this.filteredProducts = [...this.productList]; 
        this.applyFilters(); 
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },
    applyFilters() {
      this.filteredProducts = this.productList.filter((product) => {
        const categoryMatch =
          !this.selectedFilters.category.length ||
          this.selectedFilters.category.includes(product.category);
        const brandMatch =
          !this.selectedFilters.brand || product.brand === this.selectedFilters.brand;
        const ratingMatch =
          this.selectedFilters.rating === null || product.rating >= this.selectedFilters.rating;
        const searchMatch =
          !this.searchQuery ||
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        return categoryMatch && brandMatch && ratingMatch && searchMatch;
      });
      this.currentPage = 1;
    },
    updateCategory({ category, isChecked }) {
      if (isChecked) {
        this.selectedFilters.category.push(category);
      } else {
        this.selectedFilters.category = this.selectedFilters.category.filter(
          (c) => c !== category
        );
      }
      this.applyFilters();
    },
    updateBrand(brand) {
      this.selectedFilters.brand = brand;
      this.applyFilters();
    },
    updateRating(rating) {
      this.selectedFilters.rating = rating;
      this.applyFilters();
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    handleAddToCart(product) {
      this.$router.push(`/products/${product.id}`);
    },
  },
  watch: {
    searchQuery: "applyFilters",
  },
  created() {
    this.loadProducts(); // Load products when the component is created
  },
};
</script>

<style scoped>
.home-page {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
  color: #333;
  box-sizing: border-box;
}
.main-content {
  display: flex;
  /* flex-wrap: wrap; */
  align-items: flex-start;
  gap: 15px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  /* overflow: hidden; */
}


.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px; /* Adjust spacing between buttons */
    margin: 20px auto;
    padding: 20px 0;
}

.pagination-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
}

.pagination-btn:hover {
    transform: scale(1.1);
   /* Slightly enlarge button on hover */
}

.pagination-icon {
    width: 25px;
    height: 25px;
    object-fit: contain;

}
.pagination span {
    cursor: pointer; /* Add pointer cursor for page numbers */
    padding: 5px 8px; /* Add consistent padding */
    border-radius: 5px; /* Rounded corners for better aesthetics */
    transition: background-color 0.3s ease, color 0.3s ease; /* Smooth hover effect */
}

.pagination span:hover {
    background-color: #f0f0f0; /* Light background on hover */
    color: #007bff; /* Change text color to match theme */
}


.pagination .active {
    font-weight: bold;
    color: #007bff;
    border: 1px solid #007bff;
    padding: 5px 8px;
    border-radius: 5px;
    cursor: default;
    opacity: 0.8; /* Slightly dim the active button */
}

@media (max-width: 768px) {

h1{
    font-size: 1.5em;
}
.main-content {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}
}
</style> 

 