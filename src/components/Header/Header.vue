<template>
  <header class="sticky-header">
    <div class="logo">
      <button class="filter-toggle" @click="toggleFilters">☰</button>
      <img class="go-home" src="@/assets/images/shopping-bag.png" alt="Logo" @click="moveToHome"/>
      <h1>{{ title }}</h1>
    </div>
    <div class="search-bar">
      <img src="@/assets/images/search.png" alt="Search" />
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search products..."
        @input="updateSearch"
      />
    </div>

    <div class="user-options">
      <router-link to="/cart" title="cart">
        <img
          src="@/assets/images/shopping-cart.png"
          alt="Cart"
          class="icon"
        />
      </router-link>
    
        <router-link to="/orders">
        <img
          src="@/assets/images/order.png"
          alt="Notifications"
          class="icon"
        />
      </router-link>
    
      <div class="user-dropdown">
        <img
          src="@/assets/images/user.png"
          alt="User Profile"
          class="icon"
          @click="toggleUserMenu"
        />
        <ul v-if="isUserMenuVisible" class="dropdown-menu">
          <li><router-link to="/profile" @click.native="closeUserMenu">User Profile</router-link></li>
          <li @click="logOut"><a>Logout</a></li>
        </ul>
      </div>
    </div>
  </header>
</template>



<script>
export default {
  name: "HeaderComponent",
  props: {
    title: {
      type: String,
      default: "Blibli",
    },
  },
  emits: ["updateSearch", "toggleFilters"],
  data() {
    return {
      searchQuery: "",
      isUserMenuVisible: false,
    };
  },
  methods: {
    closeUserMenu() {
      this.isUserMenuVisible = false;
    },
    moveToHome(){
      this.$router.push('/home')
    },
    updateSearch() {
      if (this.$route.name !== "Home") {
        this.$router.push("/home");
      } else {
        this.$emit("updateSearch", this.searchQuery);
      }
    },
    toggleFilters() {
      this.$emit("toggleFilters");
    },
    toggleUserMenu() {
      this.isUserMenuVisible = !this.isUserMenuVisible; 
    },
    logOut(){
      sessionStorage.removeItem("userDetails"); 
      sessionStorage.removeItem("isAuthenticated")
      localStorage.setItem("cartItems", JSON.stringify([])); 
      this.closeUserMenu();
      this.$router.push("/"); 
      alert("You have successfully logged out."); 
    }
  },
};
</script>

<style scoped>
.go-home :hover{
  cursor:pointer;
}

.user-dropdown {
  margin-top: 5px;
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: rgb(73, 202, 238);
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 0;
  margin: 0;
  list-style: none;
  width: 150px;
  z-index: 1000;
}

.dropdown-menu li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  background-color: #ffffff;
}

.dropdown-menu li:hover {
  background-color: #f9f9f9;
  color: darkblue; /* Slightly darker blue on hover */
}

.dropdown-menu li:last-child {
  border-bottom: none;
}

.dropdown-menu li:hover {
  background-color: #f9f9f9;
}

.sticky-header {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #007bff;
  color: white;
  padding: 10px 20px;
  z-index: 1000;
}

.filter-toggle {
  display: none; 
}

.sticky-header .logo {
  display: flex;
  align-items: center; 
  gap: 10px; 
}

.sticky-header .logo img {
  height: 40px; 
}

.sticky-header .search-bar {
  display: flex; 
  align-items: center; 
  background: white; 
  padding: 5px 10px;
  border-radius: 5px;
  gap: 10px; 
}

.sticky-header .search-bar img {
  height: 20px; /* Adjust size of search icon */
  width: 20px;
}

.sticky-header .search-bar input {
  width: 400px;
  border: none;
  outline: none;
  font-size: 14px;
  color: #333;
}

.sticky-header .user-options {
  display: flex; 
  gap: 20px; 
  align-items: center; 
}

.sticky-header .user-options a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
  display: flex; 
  align-items: center; 
  gap: 8px; 
}

.sticky-header .user-options .icon {
  width: 25px; /* Adjust icon size */
  height: 25px;
  object-fit: contain; /* Ensure icons fit properly */
  transition: transform 0.3s ease;
}

.sticky-header .user-options a:hover .icon {
  transform: scale(1.2); /* Slightly enlarge icon on hover */
}

@media (max-width: 768px) {

  .filter-toggle {
    display: block; 
    background: #007bff;
    color: white;
    border: none;
    padding: 10px;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
    border-radius: 5px;
    margin: 10px 0;
    font-size: 30px;
}

.sticky-filters {
    display: none; 
    position: sticky;
    top: 70px;
    left: 0;
    height: 100vh;
    z-index: 1000;
    overflow-y: auto;
    width: 90%;
}

.sticky-filters.active {
    display: block; 
}



.sticky-header .logo {
    justify-content: space-between;
    gap: 100px; 
}

.sticky-header .search-bar {
    width: 90%; 
}
.sticky-header {
    flex-wrap: wrap; 
    justify-content: center; 
    gap: 10px;
}

.sticky-header .user-options {
    display: flex;
    gap: 40px;
    align-items: center;
    margin-top: 10px;
}
}
</style>
