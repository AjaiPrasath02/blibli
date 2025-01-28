<!-- 
  <template>
    <div class="order-container">
      <h1>Your Orders</h1>
      <div class="filter-section">
      <label for="date-picker">Select Date:</label>
      <input 
        id="date-picker" 
        type="date" 
        v-model="selectedDate" 
        @change="fetchOrdersByDate"
      />
    </div>
      <OrderList 
        :orders="sortedOrders" 
        @fetch-orders="fetchOrders"
        @cancel-order="cancelOrder"
        @view-tracking="navigateToTracking"
      />
    </div>
  </template>
  
  <script>
  import OrderList from '@/components/Order/OrderComponent.vue';
  
  export default {
    components: {
      OrderList
    },
    data() {
      return {
        orders: [],
        selectedDate: "", 
        userId: "",
      }
    },
    computed: {
      sortedOrders() {
        return this.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    },
    methods: {
      async fetchOrders() {
        try {
          const response = await fetch(`http://localhost:9092/orders/get/user/${this.userId}`);
          this.orders = await response.json();
        } catch (error) {
          console.error('Order fetch failed:', error);
        }
      },
      async fetchOrdersByDate() {
      if (!this.selectedDate) return;

      try {
        const response = await fetch(`http://localhost:9092/orders/get/user/date?userId=${this.userId}&date=${this.selectedDate}`);
        if (response.ok) {
          this.orders = await response.json();
          console.log(this.orders)
        } else {
          console.error('Error fetching orders by date:', response.statusText);
          alert("Failed to fetch orders for the selected date.");
        }
      } catch (error) {
        console.error('Error fetching orders by date:', error);
      }
    },
      async cancelOrder(orderId) {

        try {
          const response = await fetch(`http://localhost:9092/orders/delete/${orderId}`, {
            method: 'DELETE'
          });
          if (response.ok) {
            this.orders = this.orders.filter(order => order.id !== orderId);
          }
          alert("Your Order has been Cancelled..Refund Processing")
        } catch (error) {
          console.error('Order cancellation failed:', error);
        }
        
      },
      navigateToTracking(orderId) {
        const orderToTrack = this.orders.find(order => order.id === orderId);
    
        if (orderToTrack) {
          localStorage.setItem('currentOrderTracking', JSON.stringify(orderToTrack));
          
          this.$router.push('/order-tracking');
        } else {
          console.error('Order not found for tracking');
        }
      }
    },
    mounted() {
    const userDetails = sessionStorage.getItem("userDetails");
    if (userDetails) {
      const user = JSON.parse(userDetails);
      this.userId = user.email;
      this.fetchOrders();
    } else {
      console.error("User details not found in session storage.");
    }
    }
  }
  </script>
  <style>
  .order-container {
    background-color: white;
    color: #0066cc;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  @media screen and (max-width: 600px) {
    .order-container {
      padding: 10px;
      width: 95%;
    }
  }
  </style>

   -->


   <template>
    <div class="order-container">
      <h1>Your Orders</h1>
      <div class="filter-section">
        <div>
        <label for="date-picker">Select Date:</label>
        <input 
          id="date-picker" 
          type="date" 
          v-model="selectedDate" 
          @change="fetchOrdersByDate"
        />
       </div>
        <img src="@/assets/images/sort.png" alt="Sort" width="20" height="20"class="sort-button" @click="isAsc=!isAsc">
 
      </div>
      <OrderList 
        :orders="sortedOrders" 
        @fetch-orders="fetchOrders"
        @cancel-order="showCancelModal"
        @view-tracking="navigateToTracking"
      />
  
  
      <DeleteComponent
        v-if="showModal"
        :message="'Are you sure you want to cancel this order? This action cannot be undone.'"
        @confirm="cancelOrder"
        @close="hideModal"
      />

    </div>
  </template>
  
  <script>
  import OrderList from '@/components/Order/OrderComponent.vue';
  import DeleteComponent from '../../components/Delete/DeleteComponent.vue';
  
  export default {
    components: {
      OrderList,
      DeleteComponent,
    },
    data() {
      return {
        orders: [],
        selectedDate: "",
        userId: "",
        showModal: false, 
        orderToCancel: null,
        isAsc:false,
      };
    },
    computed: {
      sortedOrders() {
        if(this.isAsc)
        return this.orders.sort((a, b) => new Date(a.date) - new Date(b.date));
        return this.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    },
    methods: {
      async fetchOrders() {
        try {
          const response = await fetch(`http://localhost:9092/orders/get/user/${this.userId}`);
          this.orders = await response.json();
        } catch (error) {
          console.error('Order fetch failed:', error);
        }
      },
      async fetchOrdersByDate() {
        if (!this.selectedDate) return;
  
        try {
          const response = await fetch(`http://localhost:9092/orders/get/user/date?userId=${this.userId}&date=${this.selectedDate}`);
          if (response.ok) {
            this.orders = await response.json();
          } else {
            console.error('Error fetching orders by date:', response.statusText);
            alert("Failed to fetch orders for the selected date.");
          }
        } catch (error) {
          console.error('Error fetching orders by date:', error);
        }
      },
      showCancelModal(orderId) {
        this.showModal = true;
        this.orderToCancel = orderId; 
      },
      hideModal() {
        this.showModal = false; 
        this.orderToCancel = null; 
      },
      async cancelOrder() {
        if (!this.orderToCancel) return;
  
        try {
          const response = await fetch(`http://localhost:9092/orders/delete/${this.orderToCancel}`, {
            method: 'DELETE'
          });
          if (response.ok) {
            this.orders = this.orders.filter(order => order.id !== this.orderToCancel);
            alert("Your Order has been Cancelled. Refund Processing.");
          }
        } catch (error) {
          console.error('Order cancellation failed:', error);
        } finally {
          this.hideModal(); 
        }
      },
      navigateToTracking(orderId) {
        const orderToTrack = this.orders.find(order => order.id === orderId);
        if (orderToTrack) {
          localStorage.setItem('currentOrderTracking', JSON.stringify(orderToTrack));
          this.$router.push('/order-tracking');
        } else {
          console.error('Order not found for tracking');
        }
      }
    },
    mounted() {
      const userDetails = sessionStorage.getItem("userDetails");
      if (userDetails) {
        const user = JSON.parse(userDetails);
        this.userId = user.email;
        this.fetchOrders();
      } else {
        console.error("User details not found in session storage.");
      }
    }
  };
  </script>

<style scoped>
.order-container {
  background-color: white;
  color: #2d2d2d;
  max-width: 950px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}
.filter-section{
  display: flex;
  flex-direction: row;
  gap:20px;
  margin-bottom:40px;
}

@media screen and (max-width: 600px) {
  .order-container {
    padding: 10px;
    width: 95%;
  }
}
</style>
  