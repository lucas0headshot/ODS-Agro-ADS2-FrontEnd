<template>
    <main>
        <h1>fornecedores</h1>
        
        <form @submit.prevent="submitForm">
            <label for="razaoSocial">Razão Social:</label>
            <input type="text" id="razaoSocial" v-model="razaoSocial" required>
    
            <label for="nomeFantasia">Nome Fantasia:</label>
            <input type="text" id="nomeFantasia" v-model="nomeFantasia" required>
    
            <label for="cnpj">CNPJ:</label>
            <input type="text" id="cnpj" v-model="cnpj" required>
    
            <label for="endereco">Endereço:</label>
            <input type="text" id="endereco" v-model="endereco" required>
    
            <button type="submit">Enviar</button>
        </form>

        <div class="get-response">
          <h2>Dados do Fornecedor</h2>
          <table>
            <tbody>
              <tr>
                <th>Razão Social</th>
                <th>Nome Fantasia</th>
                <th>CNPJ</th>
                <th>Endereço</th>
                <th>Actions</th>
              </tr>
              
              <tr v-for="(fornecedor, index) in fornecedores" :key="index">
                <td>{{ fornecedor.razaoSocial }}</td>
                <td>{{ fornecedor.nomeFantasia }}</td>
                <td>{{ fornecedor.cnpj }}</td>
                <td>{{ fornecedor.endereco }}</td>
                <td class="actions">
                  <button id="btnEditar" @click="editarFornecedor(fornecedor.id)">Editar</button>
                  <button id="btnExcluir" @click="excluirFornecedor(fornecedor.id)">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
  
    </main>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  onMounted(() => {
    getFornecedor();
  });

  const razaoSocial = ref('');
  const nomeFantasia = ref('');
  const cnpj = ref('');
  const endereco = ref('');
  const fornecedores = ref([]);

  const submitForm = () => 
  {
    const data = {
      razaoSocial: razaoSocial.value,
      nomeFantasia: nomeFantasia.value,
      cnpj: cnpj.value,
      endereco: endereco.value,
    };

    axios.post('http://localhost:8080/api/fornecedor', data)
    .then(response => 
    {
      console.log('Resposta do servidor:', response.data);
    })
    .catch(error => 
    {
      console.error('Erro ao enviar formulário:', error);
    });
  };


function getFornecedor()
{
  axios.get('http://localhost:8080/api/fornecedor')
  .then(response => 
  {
    console.log('Resposta do servidor:', response.data);
    fornecedores.value = response.data;

  })
  .catch(error => 
  {
    console.error('Erro ao enviar formulário:', error);
  });
}

</script>

<style scoped>
/* estilos do formulário */
.form-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

label {
  display: block;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #4caf50;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

/* estilos para o bloco do get*/

.get-response {
  margin: 20px auto;
  padding: 15px;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

#btnExcluir {
  background-color: #ff0000c9;
  color: #fff;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

#btnEditar {
  background-color: #ffc800c9;
  color: #000;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

</style>