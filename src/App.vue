<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>

<template>
  <img alt="Vue logo" src="./assets/logo_hg.png" />
  <h1 class="dust-shtats-title"><span>Dust Shtats</span></h1>
  <router-view />
</template>

<style>
#app {
  font-family: "Comic Sans MS", "Comic Sans", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.dust-shtats-title {
  text-align: center; 
}

.dust-shtats-title span {
  font-size: 4rem;
  background-image: radial-gradient(circle, violet, indigo, blue, green, yellow, orange, red);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
