

 <template>
  <div class="tracking-container">
    <div class="order-header">
      <h1>Order #{{ orderId }}</h1>
      <p>Order Placed: {{ orderPlacedTime }}</p>
    </div>

    <div class="tracking-timeline">
      <div 
        v-for="(stage, index) in trackingStages" 
        :key="stage.status" 
        class="timeline-stage"
        :class="{
          'completed': currentStageIndex > index,
          'active': currentStageIndex === index,
          'cancelled': stage.status === 'CANCELLED' && currentStageIndex === index
        }"
      >
        <div class="stage-circle">{{ index + 1 }}</div>
        <div class="stage-label">{{ stage.label }}</div>
        <div class="stage-date">{{ stage.date }}</div>
      </div>
    </div>

    <div class="delivery-details">
      <h2>Delivery Information</h2>
      <p>{{ address }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderId: '',
      orderDetails: null,
      orderPlacedTime: '',
      address: '',
      currentStageIndex: 0,
      trackingStages: [
        { status: 'PLACED', label: 'Order Placed', date: '' },
        { status: 'SHIPPED', label: 'Order Shipped', date: '' },
        { status: 'DELIVERED', label: 'Order Delivered', date: '' },
        { status: 'CANCELED', label: 'Order Canceled', date: '' },
      ],
      user: null, 
      isPremiumUser: false, 
    };
  },
  methods: {
    calculateTrackingDates() {
      let deliveryTime = 4;
      console.log("Premium User:", this.isPremiumUser);
      if (this.isPremiumUser) {
        deliveryTime = 2;
      }
      const purchaseDate = new Date(this.orderDetails.date);
      this.trackingStages[0].date = purchaseDate.toLocaleString();

      const shippedDate = new Date(purchaseDate);
      shippedDate.setDate(purchaseDate.getDate() + deliveryTime);
      this.trackingStages[1].date = shippedDate.toLocaleString();

      const deliveredDate = this.orderDetails.datePreference
        ? new Date(this.orderDetails.datePreference)
        : new Date(shippedDate.setDate(shippedDate.getDate() + deliveryTime));
      this.trackingStages[2].date = deliveredDate.toLocaleString();

      this.updateCurrentStage();
    },
    updateCurrentStage() {
      const stageOrder = ['PLACED', 'SHIPPED', 'DELIVERED', 'CANCELED'];
      this.currentStageIndex = stageOrder.indexOf(this.orderDetails.orderStatus);
    },
    fetchOrderDetails() {
      const storedDetails = localStorage.getItem('currentOrderTracking');
      if (storedDetails) {
        this.orderDetails = JSON.parse(storedDetails);
        this.orderId = this.orderDetails.id;
        this.orderPlacedTime = new Date(this.orderDetails.date).toLocaleString();
        this.address = this.orderDetails.address || 'No delivery location specified';
        this.calculateTrackingDates();
      }
    },
    initializeUser() {
      const userDetails = sessionStorage.getItem('userDetails');
      if (userDetails) {
        try {
          this.user = JSON.parse(userDetails);
          this.isPremiumUser = this.user.type === "premium";
          console.log("User initialized:", this.user);
        } catch (error) {
          console.error("Error parsing userDetails from sessionStorage:", error);
        }
      } else {
        console.error('No user details found in session storage.');
      }
    },
  },
  mounted() {
    this.initializeUser(); 
    this.fetchOrderDetails();
  },
};
</script>




<style scoped>
/* General Container Styles */
.tracking-container {
  max-width: 700px;
  margin: 0 auto;
  background-color: white;
  color: #333;
  padding: 20px;
  font-family: Arial, sans-serif;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 100px;
}

/* Header */
.order-header {
  text-align: center;
  margin-bottom: 30px;
}

.order-header h1 {
  color: #007bff;
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.order-header p {
  font-size: 1rem;
  color: #555;
}

/* Timeline */
.tracking-timeline {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 30px 0;
}

.tracking-timeline::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #ddd;
  z-index: -1;
}

/* Each Stage */
.timeline-stage {
  text-align: center;
  position: relative;
  z-index: 1;
}

.stage-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ddd;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 10px;
  transition: background-color 0.3s ease;
}

/* Completed Stage */
.timeline-stage.completed .stage-circle {
  background-color: #28a745; 
}

/* Active Stage */
.timeline-stage.active .stage-circle {
  background-color: #ffc107; 
}

/* Cancelled Stage */
.timeline-stage.cancelled .stage-circle {
  background-color: #ffc107; 
}

.stage-label {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}

.stage-date {
  font-size: 0.9rem;
  color: #666;
}

/* Delivery Details */
.delivery-details {
  margin-top: 30px;
  padding: 15px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
}

.delivery-details h2 {
  color: #007bff;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.delivery-details p {
  color: #555;
  font-size: 1rem;
}
</style>