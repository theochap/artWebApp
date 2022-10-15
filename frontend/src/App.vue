<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <div>
    <header>
      <img alt="Vue logo" class="logo" src="@/assets/logo+image.png" width="150" height="120" />
  
      <div class="wrapper">
  
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
          <RouterLink to="/login">Login</RouterLink>
          <RouterLink to="/signin">Sign in</RouterLink>
        </nav>
      </div>
    </header>
  
    <RouterView />
  </div>
</template>

<style>
@import "@/assets/base.css";

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
  margin-bottom: 5%;
}

.section_head {
  margin-bottom: 1rem;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

input[type=text],
input[type=password] {
  width: 100%;
  padding: 12px 12px;
  margin: 4px 0 12px;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  margin: 4px 0px 12px;
  padding: 12px 0px;
  background-color: var(--vt-c-pistache-light);
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 7rem;
}

button:hover {
  background-color: var(--vt-c-pistache);
  cursor: pointer;
}

a,
.green {
  text-decoration: none;
  color: var(--vt-c-pistache);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

nav {
  font-size: 12px;
  text-align: center;
  margin-bottom: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  body {
    place-items: center;
    padding-left: 15%;
    padding-right: 15%;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
