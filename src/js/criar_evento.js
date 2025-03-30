import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const formCriarEvento = document.getElementById('formCriarEvento');

  formCriarEvento.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    // Captura os valores do formulário
    const nome_evento = document.getElementById('nome_evento').value;
    const data_evento = document.getElementById('data_evento').value;
    const hora_evento = document.getElementById('hora_evento').value;
    const local_evento = document.getElementById('local_evento').value;
    const descricao_evento = document.getElementById('descricao_evento').value;
    const organizador_id = localStorage.getItem('IDUsuario'); // Pega o organizador do localStorage

    if (!organizador_id) {
      alert('Erro: Usuário não autenticado. Faça login novamente.');
      window.location.href = 'index.html';
      return;
    }

    try {
      // Insere os dados no banco de dados
      const { error } = await banco_supabase
        .from('eventos')
        .insert({
          nome_evento: nome_evento,
          data: data_evento,
          hora: hora_evento,
          local: local_evento,
          descricao: descricao_evento,
          organizador: organizador_id, // Salva o organizador
          status: 'Ativo',
        });

      if (error) {
        console.error('Erro ao criar evento:', error.message);
        alert('Erro ao criar evento. Por favor, tente novamente.');
      } else {
        alert('Evento criado com sucesso!');
        window.location.href = 'home.html'; // Redireciona para a tela HOME
      }
    } catch (err) {
      console.error('Erro inesperado ao criar o evento:', err);
      alert('Erro inesperado. Por favor, tente novamente.');
    }
  });
});