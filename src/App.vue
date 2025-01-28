<template>
  <div id="app">
    <Header  @updateSearch="handleSearch" @toggleFilters="toggleFilters" />
    <main>
      <router-view :search-query="searchQuery" :show-filters="showFilters" :all-products="allProducts" />
    </main>
  </div>
</template>

<script>
import Header from "@/components/Header/Header.vue";
import { mapActions,mapState } from 'pinia';
import ProductStore from './stores/product-store';

export default {
  components: {
    Header,
  },
  data() {
    return {
      searchQuery: "",
      showFilters: true,
      allProducts:[]
    };
  },
  computed:{
    ...mapState(ProductStore, ['productList']),

  },
  methods: {
    handleSearch(searchTerm) {
      this.searchQuery = searchTerm;
    },
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    ...mapActions(ProductStore,['GetProducts']),

    getProducts(){
      this.GetProducts({
        success: this.onSucess,
         fail: this.onFailure
      });
    },
    onSucess() {
      this.allProducts = this.productList;
    console.log("App Page allProducts:", this.allProducts);
    console.log("App Page productList:", this.productList);
        },
    onFailure() {
            console.log("Data fetching array in App vue")
    }
  }
  }

</script>


<style scoped>
</style>
