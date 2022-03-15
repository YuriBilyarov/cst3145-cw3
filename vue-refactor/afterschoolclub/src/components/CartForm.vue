<template>
  <main>
    <h2>Cart</h2>
    <div v-for="item in listOfCartQuantitiesForIds" :key="item.id">
      <div v-for="lesson in lessons" :key="lesson.id">
        <span v-if="item.id === lesson.id && item.amountInCart >= 1">
          <div class="lesson">
            <img v-bind:src="getImage(lesson.image)" height="150" />
            <h2>
              {{lesson.topic}}
              <span v-bind:class="getFontAwesomeIcon(lesson)"></span>
            </h2>
            <p>Location: {{lesson.location}}</p>
            <p>Price: £{{lesson.price}}</p>
            <p>Quantity: {{item.amountInCart}}</p>
            <button @click="removeFromCart(lesson.id)" class="cartBtn">Remove from cart</button>
          </div>
        </span>
      </div>
    </div>
    <br />
    <br />
    <div class="checkoutForm">
      <h2>Checkout</h2>
      <a>Full Name:</a>
      <input type="text" v-model="order.name" />

      <a class="phone">Phone Number:</a>
      <input v-model="order.phoneNumber" />
      <br />
      <br />
      <button
        @click="completeCheckout()"
        v-bind:disabled="!this.canCheckout"
        class="cartBtn"
      >Checkout</button>
    </div>
  </main>
</template>

<script>
export default {
  name: "displayLessons",
  props: ["listOfCartQuantitiesForIds", "lessons", "cart"],
  data() {
    return {
      order: {
        name: "",
        phoneNumber: ""
      }
    };
  },
  methods: {
    createNewOrder(orderObject) {
      fetch("https://cst3145-booking-system.herokuapp.com/collection/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderObject)
      })
        .then(response => response.json())
        .then(responseJSON => {
          console.log("Success:", responseJSON);
        });
    },
    createLessonOrder(id, amountInCart) {
      let newOrder = {
        name: this.order.name,
        phone_number: this.order.phoneNumber,
        lesson_id: id,
        space: amountInCart
      };
      this.createNewOrder(newOrder);
    },
    updateLessonSpaces(id, newSpaceAmount) {
      fetch(
        "https://cst3145-booking-system.herokuapp.com/collection/lesson/" + id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            available_space: newSpaceAmount
          })
        }
      )
        .then(response => response.json())
        .then(responseJSON => {
          console.log("Success:", responseJSON);
        });
    },
    updateSpecificLessonSpaces(id) {
      let index = this.lessons.findIndex(obj => obj.id == id);
      this.updateLessonSpaces(id, this.lessons[index].available_space);
    },
    orderAndUpdate() {
      for (let i = 0; i < this.listOfCartQuantitiesForIds.length; i++) {
        let id = this.listOfCartQuantitiesForIds[i].id;
        let amountInCart = this.listOfCartQuantitiesForIds[i].amountInCart;
        if (amountInCart > 0) {
          this.createLessonOrder(id, amountInCart);
          this.updateSpecificLessonSpaces(id);
        }
      }
      this.$emit("emptyCart");
      this.showLessons = true;
    },
    completeCheckout() {
      this.orderAndUpdate();
      alert("Checkout Complete");
    },
    getImage(imageName) {
      return "https://cst3145-booking-system.herokuapp.com/" + imageName;
    },
    removeFromCart(id) {
      this.$emit("removeFromCart", id);
    },
    getFontAwesomeIcon(lesson) {
      return lesson.font_awesome_icon;
    }
  },
  computed: {
    canCheckout() {
      if (
        /^[a-zA-Z]+$/.test(this.order.name) &&
        /^\d+$/.test(this.order.phoneNumber)
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style>
.checkoutForm {
  margin: auto;
  width: 50%;
  border: 3px solid cadetblue;
  padding: 10px;
}
.phone {
  padding-left: 10px;
}
</style>