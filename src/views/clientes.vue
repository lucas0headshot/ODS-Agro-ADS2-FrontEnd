<template>
  <main>
    <h1>Clientes</h1>
    <br>
    <!-- Form Section -->
    <form @submit.prevent="isEditing ? updateCliente() : submitForm()">
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

    <!-- Cliente Data Section -->
    <div class="get-response">
      <h2>Dados do Cliente</h2>
      <table>
        <tbody>
          <tr>
            <th>Razão Social</th>
            <th>Nome Fantasia</th>
            <th>CNPJ</th>
            <th>Endereço</th>
            <th>Actions</th>
          </tr>

          <tr v-for="(cliente, index) in clientes" :key="index">
            <td>{{ cliente.razaoSocial }}</td>
            <td>{{ cliente.nomeFantasia }}</td>
            <td>{{ cliente.cnpj }}</td>
            <td>{{ cliente.endereco }}</td>

            <td class="actions">
              <button id="btnEditar" @click="startEditing(cliente)">Editar</button>
              <button id="btnExcluir" @click="excluirCliente(cliente)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Modal Section -->
    <div v-if="isDeleteModalVisible" class="modal">
      <div class="modal-content">
        <h2>Tem certeza que deseja excluir este cliente?</h2>
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
let clienteIdToDelete = null;
const razaoSocial = ref('');
const nomeFantasia = ref('');
const cnpj = ref('');
const endereco = ref('');
const clientes = ref([]);
const editingCliente = ref(null);

// Computed Property
const isEditing = computed(() => !!editingCliente.value);

// Methods
const excluirCliente = (cliente) => {
  clienteIdToDelete = cliente.id;
  showDeleteModal();
  disableBodyScroll();
};

const showDeleteModal = () => {
  isDeleteModalVisible.value = true;
};

const hideDeleteModal = () => {
  isDeleteModalVisible.value = false;
  enableBodyScroll();
};

const disableBodyScroll = () => {
  document.body.style.overflow = 'hidden';
};

const enableBodyScroll = () => {
  document.body.style.overflow = 'auto'; // or use 'visible'
};

const confirmDelete = () => {
  axios.delete(`http://localhost:8080/api/cliente/${clienteIdToDelete}`)
    .then(response => {
      console.log('Cliente excluído:', response.data);
      hideDeleteModal();
      getCliente();
    })
    .catch(error => {
      console.error('Erro ao excluir cliente:', error);
    });
};

const submitForm = () => {
  const data = {
    razaoSocial: razaoSocial.value,
    nomeFantasia: nomeFantasia.value,
    cnpj: cnpj.value,
    endereco: endereco.value,
  };

  axios.post('http://localhost:8080/api/cliente', data)
    .then(response => {
      console.log('Resposta do servidor:', response.data);
      getCliente();

      razaoSocial.value = '';
      nomeFantasia.value = '';
      cnpj.value = '';
      endereco.value = '';
    })
    .catch(error => {
      console.error('Erro ao enviar formulário:', error);
    });
};

const startEditing = (cliente) => {
  editingCliente.value = { ...cliente };

  razaoSocial.value = cliente.razaoSocial;
  nomeFantasia.value = cliente.nomeFantasia;
  cnpj.value = cliente.cnpj;
  endereco.value = cliente.endereco;
};

const cancelEditing = () => {
  editingCliente.value = null;
  razaoSocial.value = '';
  nomeFantasia.value = '';
  cnpj.value = '';
  endereco.value = '';
};

const updateCliente = () => {
  const data = {
    razaoSocial: razaoSocial.value,
    nomeFantasia: nomeFantasia.value,
    cnpj: cnpj.value,
    endereco: endereco.value,
  };

  axios.put(`http://localhost:8080/api/cliente/${editingCliente.value.id}`, data)
    .then(response => {
      console.log('Cliente atualizado:', response.data);
      cancelEditing();
      getCliente();
    })
    .catch(error => {
      console.error('Erro ao atualizar cliente:', error);
    });
};

onMounted(() => {
  getCliente();
});

function getCliente() {
  axios.get('http://localhost:8080/api/cliente')
    .then(response => {
      console.log('Resposta do servidor:', response.data);
      clientes.value = response.data;
    })
    .catch(error => {
      console.error('Erro ao obter clientes:', error);
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