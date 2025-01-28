

<template>
  <aside class="sticky-filters">
    <h2>Filters</h2>
    <div class="filter">
      <h3>Category</h3>
      <label v-for="category in categories" :key="category">
        <input
          type="checkbox"
          :value="category"
          @change="emitCategoryChange(category, $event.target.checked)"
        />
        {{ category }}
      </label>
    </div>

    <div class="filter">
      <h3>Brand</h3>
      <select @change="updateBrand($event.target.value)">
        <option value="">Select a Brand</option>
        <option v-for="brand in brands" :key="brand" :value="brand">
          {{ brand }}
        </option>
      </select>
    </div>

    <div class="filter">
      <h3>Rating</h3>
      <label v-for="rating in ratings" :key="rating">
        <input
          type="radio"
          :value="rating"
          name="rating"
          @change="updateRating(rating)"
        />
        {{ '⭐'.repeat(rating) + '☆'.repeat(5 - rating) }}
        <!-- {{ '★'.repeat(rating) + '☆'.repeat(5 - rating) }} -->
      </label>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'FilterComponent',
  props: {
    categories: {
      type: Array,
      required: true,
    },
    brands: {
      type: Array,
      required: true,
    },
    ratings: {
      type: Array,
      required: true,
    },
  },
  emits: ['updateCategory', 'updateBrand', 'updateRating'],
  methods: {
    emitCategoryChange(category, isChecked) {
      console.log('Category change emitted:', { category, isChecked });
      this.$emit('updateCategory', { category, isChecked });
    },
    updateBrand(brand) {
      this.$emit('updateBrand', brand);
    },
    updateRating(rating) {
      this.$emit('updateRating', rating);
    },
  },
};
</script>

<style scoped>
.sticky-filters {
    position: sticky;
    top: 70px;
    width: 260px; 
    background: #e9ecef;
    padding: 20px;
    border-radius: 5px;
    margin-right: 20px;
    flex-shrink: 0; /* Prevent shrinking */
    display: block; /* Always display filters on desktop */
}

.sticky-filters h2 {
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
}

.sticky-filters .filter {
    margin-bottom: 20px;
}

.sticky-filters label {
    display: block;
    margin: 5px 0;
}

.sticky-filters select {
    width: 100%;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background: white;
}



.sticky-filters input[type='checkbox'],
.sticky-filters input[type='radio'] {
  margin-right: 8px;
}

.sticky-filters label:hover {
  color: #007bff;
  cursor: pointer;
}

@media (max-width: 768px) {
  .sticky-filters {
    width: 100%;
    margin: 0 0 20px 0;
    border-radius: 0;
  }

  .sticky-filters h2 {
    text-align: center;
  }
}






</style>
