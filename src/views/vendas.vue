<template>
  <main>
    <h1>Vendas</h1>
    <br>
    <!-- Form Section -->
    <form @submit.prevent="isEditing ? updateVendas() : submitForm()">
      <label for="produto">Produto:</label>
      <input type="text" id="produto" v-model="produto" required>
  
      <label for="quantidade">Quantidade:</label>
      <input type="number" id="quantidade" v-model="quantidade" required>
  
      <label for="dataVenda">Data de Venda:</label>
      <input type="date" id="dataVenda" v-model="dataVenda" required>

      <div class="formActions">
        <button id="btnConfirm" type="submit">{{ isEditing ? 'Atualizar' : 'Enviar' }}</button>
        <button id="btnExcluir" v-if="isEditing" type="button" @click="cancelEditing">Cancelar</button>
      </div>

    </form>

    <!-- Vendas Data Section -->
    <div class="get-response">
      <h2>Dados do Vendas</h2>
      <table>
        <tbody>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Data Venda</th>
            <th>Actions</th>
          </tr>

          <tr v-for="(vendas, index) in vendas" :key="index">
            <td>{{ vendas.produto.nome }}</td>
            <td>{{ vendas.qtdVendida }}</td>
            <td>{{ vendas.dataVenda }}</td>

            <td class="actions">
              <button id="btnEditar" @click="startEditing(vendas)">Editar</button>
              <button id="btnExcluir" @click="excluirVendas(vendas)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Modal Section -->
    <div v-if="isDeleteModalVisible" class="modal">
      <div class="modal-content">
        <h2>Tem certeza que deseja excluir este vendas?</h2>
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
let vendasIdToDelete = null;
const produto = ref('');
const quantidade = ref(''); 
const dataVenda = ref('');
const vendas = ref([]);
const editingVendas = ref(null);


// Computed Property
const isEditing = computed(() => !!editingVendas.value);

// Methods
const excluirVendas = (vendas) => {
  vendasIdToDelete = vendas.id;
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
  axios.delete(`http://localhost:8080/api/vendas/${vendasIdToDelete}`)
    .then(response => {
      console.log('Vendas excluído:', response.data);
      hideDeleteModal();
      getVendas();
    })
    .catch(error => {
      console.error('Erro ao excluir vendas:', error);
    });
};

const submitForm = () => {
  const data = {
    cliente: {
      id: 2
    },
    produto: {
      id: 55
    },
    qtdVendida: quantidade.value,
    dataVenda: dataVenda.value,
  };


  axios.post('http://localhost:8080/api/vendas', data)
    .then(response => {
      console.log('Resposta do servidor:', response.data);
      getVendas();

      produto.value = '';
      quantidade.value = '';
      dataVenda.value = '';
    })
    .catch(error => {
      console.error('Erro ao enviar formulário:', error);
    });
};

const startEditing = (vendas) => {
  editingVendas.value = { ...vendas };

  razaoSocial.value = vendas.razaoSocial;
  nomeFantasia.value = vendas.nomeFantasia;
  cnpj.value = vendas.cnpj;
  endereco.value = vendas.endereco;
};

const cancelEditing = () => {

};

const updateVendas = () => {
  const data = {
    produto: produto.value,
    quantidade: quantidade.value,
    dataVenda: dataVenda.value,
  };

  axios.patch(`http://localhost:8080/api/vendas/${editingVendas.value.id}`, data)
    .then(response => {
      console.log('Vendas atualizado:', response.data);
      cancelEditing();
      getVendas();
    })
    .catch(error => {
      console.error('Erro ao atualizar vendas:', error);
    });
};

onMounted(() => {
  getVendas();
});

// Fetch Vendas Data
function getVendas() {
  axios.get('http://localhost:8080/api/vendas')
    .then(response => {
      console.log('Resposta do servidor:', response.data);
      vendas.value = response.data;
    })
    .catch(error => {
      console.error('Erro ao obter vendas:', error);
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