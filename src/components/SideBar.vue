<template>
  <aside>
    <ul>
      <li>
          <router-link to="/fornecedores">Fornecedores</router-link>
      </li>
      <li>
          <router-link to="/clientes">Clientes</router-link>
      </li>
      <li>
          <router-link to="/estoque">Estoque</router-link>
      </li>
      <li>
          <router-link to="/vendas">Vendas</router-link>
      </li>
    </ul>
  </aside>
</template>

<script>

</script>

<style>

aside {
  width: 200px;
  height: 100%;
  background-color: #f1f1f1;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
}

aside ul {
  list-style-type: none;
}

aside li {
  padding: 10px;
  border-bottom: 1px solid #ddd; 
}


aside a {
  text-decoration: none;
  color: #333; 
}


aside a:hover {
  color: #000;
}

</style>
