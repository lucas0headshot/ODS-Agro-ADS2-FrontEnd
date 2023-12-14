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
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  list-style-type: none;
}

aside li {
  padding: 30px 0px 0px 30px;
}

aside a {
  width: 100%;
  text-decoration: none;
  color: #333; 
  font-size: large;
}

aside a:hover {
  color: #000;
}

</style>
