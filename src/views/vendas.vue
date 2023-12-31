<template>
  <main>
    <h1>Vendas</h1>
    <br>
    <!-- Form Section -->
    <form @submit.prevent="isEditing ? updateVendas() : submitForm()">
      <label for="produto">Produto:</label>
      <select id="produto" v-model="produtoSelecionado" required>
        <option selected value="">
          Nenhum
        </option>
        <option v-for="produto in produtos" :key="produto.id" :value="produto.id">
          {{ produto.nome }}
        </option>
      </select>

      <p>Em estoque: {{ quantidadeEstoque }}</p>
    
      <label for="cliente">Cliente:</label>
      <select id="cliente" v-model="clienteSelecionado" required>
        <option selected value="">
          Nenhum
        </option>
        <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
          {{ cliente.nomeFantasia }}
        </option>
      </select>


      <label for="quantidade">Quantidade:</label>
      <input type="number" id="quantidade" v-model="quantidade" placeholder="un" min="1" required>
  
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

          <tr v-for="(venda, index) in vendas" :key="index">
            <td>{{ venda.produto.nome }}</td>
            <td>{{ venda.qtdVendida }}</td>
            <td>{{ venda.dataVenda }}</td>

            <td class="actions">
              <button id="btnEditar" @click="startEditing(venda)">Editar</button>
              <button id="btnExcluir" @click="excluirVendas(venda)">Excluir</button>
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
import { ref, onMounted, computed, watchEffect } from 'vue';
import axios from 'axios';

const isDeleteModalVisible = ref(false);
let vendasIdToDelete = null;
const quantidade = ref(''); 
const originalQuantidade = ref('');
const dataVenda = ref('');
const vendas = ref([]);
const produtos = ref([]);
const clientes = ref([]);
const editingVendas = ref(null);
const clienteSelecionado = ref(null);
const produtoSelecionado = ref(null);

const quantidadeEstoque = ref(0);

const isEditing = computed(() => !!editingVendas.value);

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

      if (error.response.status === 400) {
        alert('Esta venda não pode ser excluída!');
      }
    });
};

const submitForm = () => {
  const data = {
    cliente: {
      id: clienteSelecionado.value
    },
    produto: {
      id: produtoSelecionado.value
    },
    qtdVendida: quantidade.value,
    dataVenda: dataVenda.value,
  };

  axios.post('http://localhost:8080/api/vendas', data)
    .then(response => {
      console.log('Resposta do servidor:', response.data);
      getVendas();

      getProduto(produtoSelecionado.value);

      produtos.value = '';
      quantidade.value = '';
      dataVenda.value = '';
      quantidadeEstoque.value = "";
    })
    .catch(error => {
      console.error('Erro ao enviar formulário:', error);
      if (error.response.status = 422) {
        alert(error.response.data.erro)
      } 
    });
};

const startEditing = (venda) => {
  editingVendas.value = { ...venda };
  originalQuantidade.value = venda.qtdVendida || '';
  clienteSelecionado.value = venda.cliente.id;
  produtoSelecionado.value = venda.produto.id;
  quantidade.value = originalQuantidade.value;
  dataVenda.value = venda.dataVenda || '';
};

const cancelEditing = () => {
  editingVendas.value = null;
  clienteSelecionado.value = null;
  produtoSelecionado.value = null;
  quantidade.value = null;
  dataVenda.value = '';
};

const updateVendas = () => {
  const data = {
    cliente: {
      id: clienteSelecionado.value
    },
    produto: {
      id: produtoSelecionado.value
    },
    qtdVendida: quantidade.value,
    dataVenda: dataVenda.value,
  };

  axios.put(`http://localhost:8080/api/vendas/${editingVendas.value.id}`, data)
    .then(response => {
      console.log('Vendas atualizado:', response.data);
      originalQuantidade.value = quantidade.value; // Atualiza a quantidade original
      cancelEditing();
      getVendas();
    })
    .catch(error => {
      console.error('Erro ao atualizar vendas:', error);
    });
};


const obterDetalhesDoProduto = (produtoId) => {
  if (Array.isArray(produtos.value)) {
    return produtos.value.find((produto) => produto.id === produtoId);
  } else {
    return null;
  }
};


const obterEstoqueDoProduto = (detalhesProduto) => {
  return detalhesProduto ? detalhesProduto.qtdEstoque : 0;
};

watchEffect(() => {
  const detalhesProduto = obterDetalhesDoProduto(produtoSelecionado.value);
  quantidadeEstoque.value = obterEstoqueDoProduto(detalhesProduto);
});

onMounted(() => {
  getVendas();
  getProduto();
  getCliente();
});

function getVendas() {
  axios.get('http://localhost:8080/api/vendas')
    .then(response => {
      console.log('Resposta do servidor get:', response.data);
      vendas.value = response.data;
    })
    .catch(error => {
      console.error('Erro ao obter vendas:', error);
    });
}

function getProduto() {
  axios.get('http://localhost:8080/api/produto')
    .then(response => {
      console.log('Resposta do get:', response.data);
      produtos.value = response.data;

      const detalhesProduto = response.data;
      quantidadeEstoque.value = detalhesProduto.qtdEstoque;
    })
    .catch(error => {
      console.error('Erro ao obter produto:', error);
    });
}

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