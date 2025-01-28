<template>
    <div class="modal-overlay">
      <div class="modal-content">
        <h2>Confirmation</h2>
        <p>{{ message }}</p>
        <div class="modal-buttons">
          <button @click="$emit('confirm')">Yes</button>
          <button @click="$emit('close')">No</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Confirmation',
    props: {
      message: {
        type: String,
        required: true
      }
    },
    mounted() {
        console.log("DeleteComponent mounted");
    }
 
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    width: 90%;
  }
  
  .modal-buttons {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }
  
  button {
    background-color: #2563eb;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:last-child {
    background-color: #a0a0a0;
  }
  
  button:hover {
    opacity: 0.9;
  }
  </style>
  