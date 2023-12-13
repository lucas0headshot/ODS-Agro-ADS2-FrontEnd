<template>
  <SideBar></SideBar> <!-- tag do template -->
  
  <router-view></router-view>
</template>

<script setup>
  import SideBar from "./components/SideBar.vue"; //template importado
  
</script>

<!-- Esse main serve para jogar o conteudo para o lado da sidebar -->
<style scoped>
main { 
  margin-left: 200px;
  padding: 20px;
}
</style>