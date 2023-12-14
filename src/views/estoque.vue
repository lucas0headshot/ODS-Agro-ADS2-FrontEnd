<template>
  <main>
    <h1>Estoque</h1>
    <br>
    <!-- Form Section -->
    <form @submit.prevent="isEditing ? updateProduto() : submitForm()">
     
      <label for="fornecedor">Fornecedor:</label>
      <select id="fornecedor" v-model="fornecedorSelecionado" required>
        <option v-for="fornecedor in fornecedores" :key="fornecedor.id" :value="fornecedor.id">
          {{ fornecedor.nomeFantasia }}
        </option>
      </select>

      <label for="nomeProduto">Nome do Produto:</label>
      <input type="text" id="nomeProduto" v-model="nomeProduto" required>

      <label for="valorProduto">Valor do Produto:</label>
      <input type="number" id="valorProduto" v-model="valorProduto" required>

      <label for="pesoProduto">Peso do Produto:</label>
      <input type="number" id="pesoProduto" v-model="pesoProduto" required>

      <label for="dataProducaoProduto">Data de Produção do Produto:</label>
      <input type="date" id="dataProducaoProduto" v-model="dataProducaoProduto">

      <label for="dataValidadeProduto">Data de Validade do Produto:</label>
      <input type="date" id="dataValidadeProduto" v-model="dataValidadeProduto">

      <label for="qtdEstoqueProduto">Quantidade em Estoque:</label>
      <input type="number" id="qtdEstoqueProduto" v-model="qtdEstoqueProduto" required>

      <div class="formActions">
        <button id="btnConfirm" type="submit">{{ isEditing ? 'Atualizar' : 'Enviar' }}</button>
        <button id="btnExcluir" v-if="isEditing" type="button" @click="cancelEditing">Cancelar</button>
      </div>

    </form>

    <!-- Produto Data Section -->
    <div class="get-response">
      <h2>Dados do Produto</h2>
      <table>
        <tbody>
          <tr>
            <th>Nome do Produto</th>
            <th>Valor do Produto</th>
            <th>Peso do Produto</th>
            <th>Data de Produção</th>
            <th>Data de Validade</th>
            <th>Quantidade em Estoque</th>
            <th>Actions</th>
          </tr>

          <tr v-for="(produto, index) in produto" :key="index">
            <td>{{ produto.nome }}</td>
            <td>{{ produto.valor}}</td>
            <td>{{ produto.peso }}</td>
            <td>{{ produto.dataProducao }}</td>
            <td>{{ produto.dataValidade }}</td>
            <td>{{ produto.qtdEstoque }}</td>

            <td class="actions">
              <button id="btnEditar" @click="startEditing(produto)">Editar</button>
              <button id="btnExcluir" @click="excluirProduto(produto)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isDeleteModalVisible" class="modal">
      <div class="modal-content">
        <h2>Tem certeza que deseja excluir este produto?</h2>
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
let produtoIdToDelete = null;
const produto = ref([]);

const nomeProduto = ref('');
const valorProduto = ref('');
const pesoProduto = ref('');
const dataProducaoProduto = ref('');
const dataValidadeProduto = ref('');
const qtdEstoqueProduto = ref('');
const editingProduto = ref(null);

const fornecedores = ref([]);
const fornecedorSelecionado = ref('');



const isEditing = computed(() => !!editingProduto.value);

const excluirProduto = (produto) => {
  produtoIdToDelete = produto.id;
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
  document.body.style.overflow = 'auto';
};

const confirmDelete = () => {
  axios.delete(`http://localhost:8080/api/produto/${produtoIdToDelete}`)
    .then(response => {
      console.log('Produto excluído:', response.data);
      hideDeleteModal();
      getProduto();
    })
    .catch(error => {
      console.error('Erro ao excluir produto:', error);
    });
};

const submitForm = () => {
  const data = {
    fornecedor: {
    id: fornecedorSelecionado.value
  },
    nome: nomeProduto.value,
		valor: valorProduto.value,
		peso: pesoProduto.value,
		dataProducao: dataProducaoProduto.value,
		dataValidade: dataValidadeProduto.value,
		qtdEstoque: qtdEstoqueProduto.value
  };

  console.log('Dados antes de enviar:', data);

  axios.post('http://localhost:8080/api/produto', data)
    .then(response => {
      console.log('Resposta do servidor:', response.data);
      getProduto();

      nomeProduto.value = '';
      valorProduto.value = '';
      pesoProduto.value = '';
      dataProducaoProduto.value = '';
      dataValidadeProduto.value = '';
      qtdEstoqueProduto.value = '';
    })
    .catch(error => {
      console.error('Erro ao enviar formulário:', error);
    });
};

const startEditing = (produto) => {
  editingProduto.value = { ...produto };

  nomeProduto.value = produto.nomeProduto;
  valorProduto.value = produto.valorProduto;
  pesoProduto.value = produto.pesoProduto;
  dataProducaoProduto.value = produto.dataProducaoProduto;
  dataValidadeProduto.value = produto.dataValidadeProduto;
  qtdEstoqueProduto.value = produto.qtdEstoqueProduto;
};

const cancelEditing = () => {
  editingProduto.value = null;
  nomeProduto.value = '';
  valorProduto.value = '';
  pesoProduto.value = '';
  dataProducaoProduto.value = '';
  dataValidadeProduto.value = '';
  qtdEstoqueProduto.value = '';
};

const updateProduto = () => {
  const data = {
    fornecedor: {
    id: 159
  },
    nome: nomeProduto.value,
		valor: valorProduto.value,
		peso: pesoProduto.value,
		dataProducao: dataProducaoProduto.value,
		dataValidade: dataValidadeProduto.value,
		qtdEstoque: qtdEstoqueProduto.value
  };

  axios.put(`http://localhost:8080/api/produto/${editingProduto.value.id}`, data)
    .then(response => {
      console.log('Produto atualizado:', response.data);
      cancelEditing();
      getProduto();
    })
    .catch(error => {
      console.error('Erro ao atualizar produto:', error);
    });
};

onMounted(() => {
  getProduto();
  getFornecedor();
});

function getProduto() {
  axios.get('http://localhost:8080/api/produto')
    .then(response => {
      console.log('Resposta do get:', response.data);
      produto.value = response.data;
    })
    .catch(error => {
      console.error('Erro ao obter produto:', error);
    });
}

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