<template>
  <div id="app">
    <header>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
      />
      <h1>After School Club</h1>
    </header>

    <button @click="switchView()" v-bind:disabled="cartItemCount<1" class="cartBtn">
      {{cartItemCount }} Checkout
      <span class="fas fa-cart-plus"></span>
    </button>

    <div id="shopping" v-if="showLessons">
      <display-lessons :lessons="lessons" @addLesson="addToCart" @updateResults="updateResults"></display-lessons>
    </div>
    <div v-else>
      <cart-form
        :listOfCartQuantitiesForIds="listOfCartQuantitiesForIds"
        :lessons="lessons"
        @emptyCart="emptyCart"
        @removeFromCart="removeFromCart"
      ></cart-form>
    </div>
  </div>
</template>

<script>
import displayLessons from "./components/DisplayLessons.vue";
import cartForm from "./components/CartForm.vue";

export default {
  name: "App",
  data() {
    return {
      showLessons: true,
      lessons: [],
      cart: [],
      filter: "price",
      sortDirection: "asc",
      order: {
        name: "",
        phoneNumber: ""
      },
      searchInput: ""
    };
  },
  methods: {
    switchView() {
      this.showLessons = this.showLessons ? false : true;
    },
    addToCart(id) {
      this.cart.push(id);
      let index = this.lessons.findIndex(obj => obj.id == id);
      this.lessons[index].available_space =
        this.lessons[index].available_space - 1;
    },
    removeFromCart(id) {
      const cartIndex = this.cart.indexOf(id);
      const lessonsIndex = this.lessons.findIndex(obj => obj.id == id);
      if (cartIndex > -1) {
        this.cart.splice(cartIndex, 1);
        this.lessons[lessonsIndex].available_space =
          this.lessons[lessonsIndex].available_space + 1;
      }
      if (this.cart.length === 0) {
        this.switchView();
      }
    },
    populateResultArray() {
      fetch(this.fetchString()).then(response => {
        response.json().then(lessons => {
          this.lessons = lessons;
        });
      });
    },
    fetchString() {
      if (this.searchInput == "") {
        return (
          "https://cst3145-booking-system.herokuapp.com/collection/lesson/" +
          this.filter +
          "/" +
          this.sortDirection
        );
      } else {
        return (
          "https://cst3145-booking-system.herokuapp.com/collection/lesson/" +
          this.searchInput +
          "/" +
          this.filter +
          "/" +
          this.sortDirection
        );
      }
    },
    emptyCart() {
      this.cart = [];
      this.switchView();
    },
    updateResults(searchInput, filter, sortDirection) {
      this.searchInput = searchInput;
      this.filter = filter;
      this.sortDirection = sortDirection;
      this.populateResultArray();
    }
  },
  computed: {
    cartItemCount() {
      return this.cart.length;
    },
    allItemIds() {
      let ids = [];
      for (let i = 0; i < this.lessons.length; i++) {
        ids.push(this.lessons[i].id);
      }
      return ids;
    },
    listOfCartQuantitiesForIds() {
      let ids = this.allItemIds;
      let result = [];
      for (let i = 0; i < ids.length; i++) {
        let counter = 0;
        for (let j = 0; j < this.cart.length; j++) {
          if (ids[i] === this.cart[j]) {
            counter++;
          }
        }
        result.push({
          id: ids[i],
          amountInCart: counter
        });
      }
      return result;
    }
  },
  created: function() {
    this.populateResultArray();
  },
  components: {
    displayLessons,
    cartForm
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.cartBtn {
  align-items: center;
  background-color: #fff;
  border: 2px solid #000;
  box-sizing: border-box;
  color: #000;
  cursor: pointer;
  display: inline-flex;
  fill: #000;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 600;
  height: 48px;
  justify-content: center;
  letter-spacing: -0.8px;
  line-height: 24px;
  min-width: 140px;
  outline: 0;
  padding: 0 17px;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.cartBtn:focus {
  color: #171e29;
}

.cartBtn:hover {
  border-color: cadetblue;
  color: cadetblue;
  fill: cadetblue;
}

.cartBtn:disabled {
  border-color: darkred;
  color: darkred;
  fill: darkred;
}

@media (min-width: 768px) {
  .cartBtn {
    min-width: 170px;
  }
}
</style>
