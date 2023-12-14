<template>
  <main>
    <h1>Fornecedores</h1>
    <br>
    <!-- Form Section -->
    <form @submit.prevent="isEditing ? updateFornecedor() : submitForm()">
      <label for="razaoSocial">Razão Social:</label>
      <input type="text" id="razaoSocial" v-model="razaoSocial" required>

      <label for="nomeFantasia">Nome Fantasia:</label>
      <input type="text" id="nomeFantasia" v-model="nomeFantasia" required>

      <label for="cnpj">CNPJ:</label>
      <input type="text" id="cnpj" v-model="cnpj" required>

      <label for="endereco">Endereço:</label>
      <input type="text" id="endereco" v-model="endereco" required>

      <div class="formActions">
        <button id="btnConfirm" type="submit">{{ isEditing ? 'Atualizar' : 'Enviar' }}</button>
        <button id="btnExcluir" v-if="isEditing" type="button" @click="cancelEditing">Cancelar</button>
      </div>

    </form>

    <!-- Fornecedor Data Section -->
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
              <button id="btnEditar" @click="startEditing(fornecedor)">Editar</button>
              <button id="btnExcluir" @click="excluirFornecedor(fornecedor)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Modal Section -->
    <div v-if="isDeleteModalVisible" class="modal">
      <div class="modal-content">
        <h2>Tem certeza que deseja excluir este fornecedor?</h2>
        <div class="actions">
          <button id="btnConfirm" @click="confirmDelete">Sim</button>
          <button id="btnExcluir" @click="hideDeleteModal">Cancelar</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// State
const isDeleteModalVisible = ref(false);
let fornecedorIdToDelete = null;
const razaoSocial = ref('');
const nomeFantasia = ref('');
const cnpj = ref('');
const endereco = ref('');
const fornecedores = ref([]);
const editingFornecedor = ref(null);

const isEditing = computed(() => !!editingFornecedor.value);

const excluirFornecedor = (fornecedor) => {
  editingFornecedor.value = fornecedor;
  showDeleteModal();
};

const showDeleteModal = () => {
  isDeleteModalVisible.value = true;
};

const hideDeleteModal = () => {
  isDeleteModalVisible.value = false;
};

const confirmDelete = () => {
  const idToDelete = editingFornecedor.value.id;
  axios.delete(`http://localhost:8080/api/fornecedor/${idToDelete}`)
    .then(response => {
      console.log('Fornecedor excluído:', response.data);
      hideDeleteModal();
      getFornecedor();
    })
    .catch(error => {
      console.error('Erro ao excluir fornecedor:', error);
    });
};

const submitForm = () => {
  const data = {
    razaoSocial: razaoSocial.value,
    nomeFantasia: nomeFantasia.value,
    cnpj: cnpj.value,
    endereco: endereco.value,
  };

  axios.post('http://localhost:8080/api/fornecedor', data)
    .then(response => {
      console.log('Resposta do servidor:', response.data);
      getFornecedor();

      razaoSocial.value = '';
      nomeFantasia.value = '';
      cnpj.value = '';
      endereco.value = '';
    })
    .catch(error => {
      console.error('Erro ao enviar formulário:', error);
    });
};

const startEditing = (fornecedor) => {
  editingFornecedor.value = { ...fornecedor };

  razaoSocial.value = fornecedor.razaoSocial;
  nomeFantasia.value = fornecedor.nomeFantasia;
  cnpj.value = fornecedor.cnpj;
  endereco.value = fornecedor.endereco;
};

const cancelEditing = () => {
  editingFornecedor.value = null;
  razaoSocial.value = '';
  nomeFantasia.value = '';
  cnpj.value = '';
  endereco.value = '';
};

const updateFornecedor = () => {
  const data = {
    razaoSocial: razaoSocial.value,
    nomeFantasia: nomeFantasia.value,
    cnpj: cnpj.value,
    endereco: endereco.value,
  };

  axios.put(`http://localhost:8080/api/fornecedor/${editingFornecedor.value.id}`, data)
    .then(response => {
      console.log('Fornecedor atualizado:', response.data);
      cancelEditing();
      getFornecedor();
    })
    .catch(error => {
      console.error('Erro ao atualizar fornecedor:', error);
    });
};

onMounted(() => {
  getFornecedor();
});

// Fetch Fornecedor Data
function getFornecedor() {
  axios.get('http://localhost:8080/api/fornecedor')
    .then(response => {
      console.log('Resposta do servidor:', response.data);
      fornecedores.value = response.data;
    })
    .catch(error => {
      console.error('Erro ao obter fornecedores:', error);
    });
}
</script>

<style scoped>
/* estilos para o bloco do formulário */
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

.formActions{
  display: flex;
  gap: 10px;
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
  width: 80px;
  background-color: #ff0000c9;
  color: #fff;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

#btnEditar {
  width: 80px;
  background-color: #ffc800c9;
  color: #000;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

#btnConfirm{
  width: 80px;
  background-color: #45a049;
  color: #fff;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/*Estilos para o Modal de deleção*/
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: #fff;
  padding: 30px 50px;
  border-radius: 8px;
  text-align: center;
  gap: 20px;
}
</style>