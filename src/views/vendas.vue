<template>
    <main>
        <h1>vendas</h1>
        
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
    </main>
</template>

<script setup>
    import { ref } from 'vue';
    const razaoSocial = ref('');
    const nomeFantasia = ref('');
    const cnpj = ref('');
    const endereco = ref('');

    const submitForm = () => 
    {
        const data = {
            razaoSocial: razaoSocial.value,
            nomeFantasia: nomeFantasia.value,
            cnpj: cnpj.value,
            endereco: endereco.value,
    };

  axios.post('URL_DO_SEU_ENDPOINT', data)
    .then(response => 
    {
      console.log('Resposta do servidor:', response.data);
    })
    .catch(error => 
    {
      console.error('Erro ao enviar formulário:', error);
    });
};

</script>

<style scoped>
/* Estilos específicos para o formulário */
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
</style>