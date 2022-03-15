<template>
  <main>
    <h2>Lessons</h2>
    <input
      type="text"
      v-model="searchInput"
      @keyup="updateResults()"
      placeholder="Search lessons"
      class="search"
    />
    <div class="sortedBy">
      sorted by
      <select class="sortingFont" v-model="filter" @change="updateResults()">
        <option value="topic">Topic</option>
        <option value="location">Location</option>
        <option value="price">Price</option>
        <option value="available_space">Space</option>
      </select>

      <input type="radio" id="asc" value="asc" v-model="sortDirection" @change="updateResults()" />
      <label for="ascending">Ascending</label>
      <input type="radio" id="desc" value="desc" v-model="sortDirection" @change="updateResults()" />
      <label for="descending">Descending</label>
    </div>
    <br />
    <br />
    <div v-for="lesson in lessons" :key="lesson.id" class="lesson">
      <br />
      <img v-bind:src="getImage(lesson.image)" height="150" />
      <h2>
        {{lesson.topic}}
        <span v-bind:class="getFontAwesomeIcon(lesson)"></span>
      </h2>
      <p>Location: {{lesson.location}}</p>
      <p>Price: £{{lesson.price}}</p>
      <p>Spaces: {{lesson.available_space}}</p>
      <button
        @click="addToCart(lesson.id)"
        v-bind:disabled="!canAddToCart(lesson)"
        class="cartBtn"
      >Add to cart</button>
      <br />
      <br />
    </div>
  </main>
</template>

<script>
export default {
  name: "displayLessons",
  props: ["lessons"],
  data() {
    return {
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
    addToCart(id) {
      this.$emit("addLesson", id);
    },
    canAddToCart(lesson) {
      let spaces = lesson.available_space;
      return spaces > 0;
    },
    updateResults() {
      this.$emit(
        "updateResults",
        this.searchInput,
        this.filter,
        this.sortDirection
      );
    },
    getImage(imageName) {
      return "https://cst3145-booking-system.herokuapp.com/" + imageName;
    },
    getFontAwesomeIcon(lesson) {
      return lesson.font_awesome_icon;
    }
  }
};
</script>

<style>
.lesson {
  margin: auto;
  width: 50%;
  border: 3px solid green;
  padding: 10px;

  background-color: blanchedalmond;
  border-color: cadetblue;
  border-width: 10px;
  color: #5a3a10;
  margin-top: 60px;
}

.search[type="text"] {
  width: 50%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.search[type="submit"] {
  width: 100%;
  background-color: #4caf50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search[type="submit"]:hover {
  background-color: #45a049;
}
</style>