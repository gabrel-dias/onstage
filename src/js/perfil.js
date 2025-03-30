import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const formPerfil = document.getElementById('formPerfil');
  const btnLogout = document.getElementById('btnLogout');

  // Carrega os dados do perfil no formulário
  carregarDadosDoPerfil();

  // Evento para salvar alterações no perfil
  formPerfil.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value; // Nova senha (opcional)
    const IDUsuario = localStorage.getItem('IDUsuario');

    if (!IDUsuario) {
      alert('ID do usuário não encontrado. Faça login novamente.');
      window.location.href = 'index.html';
      return;
    }

    // Define os dados a serem atualizados
    const dadosAtualizar = { nome, email };
    if (senha) {
      dadosAtualizar.senha = senha; // Inclui senha apenas se preenchida
    }

    try {
      const { error } = await banco_supabase
        .from('usuarios') // Nome correto da tabela
        .update(dadosAtualizar)
        .eq('id', IDUsuario);

      if (error) {
        console.error('Erro ao atualizar perfil:', error.message);
        alert('Erro ao atualizar perfil. Por favor, tente novamente.');
      } else {
        alert('Perfil atualizado com sucesso!');
        localStorage.setItem('nomeUsuario', nome); // Atualiza localStorage
        window.location.href = 'home.html'; // Redireciona para a tela HOME
      }
    } catch (err) {
      console.error('Erro inesperado ao atualizar o perfil:', err);
      alert('Ocorreu um erro inesperado. Por favor, tente novamente.');
    }
  });

  // Logout do usuário
  btnLogout.addEventListener('click', () => {
    localStorage.clear(); // Limpa o localStorage
    window.location.href = 'index.html'; // Redireciona para a tela de login
  });
});

// Função para carregar os dados do perfil no formulário
async function carregarDadosDoPerfil() {
  const IDUsuario = localStorage.getItem('IDUsuario');

  if (!IDUsuario) {
    alert('ID do usuário não encontrado. Faça login novamente.');
    window.location.href = 'index.html';
    return;
  }

  console.log(`IDUsuario: ${IDUsuario}`); // Log para depuração

  try {
    const { data, error } = await banco_supabase
      .from('usuarios')
      .select('nome, email') // Apenas os campos existentes
      .eq('id', IDUsuario)
      .single(); // Retorna um único registro

    if (error) {
      console.error('Erro ao buscar os dados do perfil:', error.message, error);
      alert('Erro ao carregar os dados do perfil. Verifique a tabela no banco.');
      return;
    }

    if (data) {
      console.log('Dados do usuário carregados:', data); // Log para depuração
      document.getElementById('nome').value = data.nome || '';
      document.getElementById('email').value = data.email || '';
    } else {
      alert('Nenhum dado encontrado para o usuário.');
    }
  } catch (err) {
    console.error('Erro inesperado ao carregar os dados do perfil:', err);
    alert('Erro inesperado ao carregar os dados do perfil.');
  }

  // Redirecionar para mentores.html ao clicar no botão de home
  if (btnHome) {
    btnHome.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = 'home.html';
    });
  }

  // Redirecionar para mentores.html ao clicar no botão de eventos
  if (btnEventos) {
    btnEventos.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = 'evento.html';
    });
  }

  // Redirecionar para mentores.html ao clicar no botão de mentores
  if (btnMentores) {
    btnMentores.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = 'mentores.html';
    });
  }

  // Redirecionar para editar_cadastro.html ao clicar no botão de perfil
  if (btnPerfil) {
    btnPerfil.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = 'editar_cadastro.html';
    });
  }
}

  // Logout do usuário
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.clear(); // Limpa o localStorage
      window.location.href = 'index.html'; // Redireciona para a tela de login
    });
  }