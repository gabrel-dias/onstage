import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', async () => {
  const formEditarEvento = document.getElementById('formEditarEvento');
  const eventoId = new URLSearchParams(window.location.search).get('eventoId');

  if (!eventoId) {
    alert('Evento não encontrado. Redirecionando para a página de eventos.');
    window.location.href = 'eventos.html';
    return;
  }

  document.getElementById('evento_id').value = eventoId;

  // Carrega os dados do evento
  try {
    const { data, error } = await banco_supabase
      .from('eventos')
      .select('nome_evento, data, hora, local, descricao')
      .eq('id', eventoId)
      .single();

    if (error) {
      console.error('Erro ao carregar dados do evento:', error.message);
      alert('Erro ao carregar o evento. Por favor, tente novamente.');
      window.location.href = 'eventos.html';
      return;
    }

    // Preenche o formulário com os dados do evento
    document.getElementById('nome_evento').value = data.nome_evento;
    document.getElementById('data_evento').value = data.data;
    document.getElementById('hora_evento').value = data.hora;
    document.getElementById('local_evento').value = data.local;
    document.getElementById('descricao_evento').value = data.descricao;
  } catch (err) {
    console.error('Erro inesperado ao carregar o evento:', err);
    alert('Erro inesperado. Por favor, tente novamente.');
    window.location.href = 'eventos.html';
  }

  // Atualiza os dados do evento
  formEditarEvento.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome_evento = document.getElementById('nome_evento').value;
    const data_evento = document.getElementById('data_evento').value;
    const hora_evento = document.getElementById('hora_evento').value;
    const local_evento = document.getElementById('local_evento').value;
    const descricao_evento = document.getElementById('descricao_evento').value;

    try {
      const { error } = await banco_supabase
        .from('eventos')
        .update({
          nome_evento,
          data: data_evento,
          hora: hora_evento,
          local: local_evento,
          descricao: descricao_evento
        })
        .eq('id', eventoId);

      if (error) {
        console.error('Erro ao atualizar o evento:', error.message);
        alert('Erro ao atualizar o evento. Por favor, tente novamente.');
      } else {
        alert('Evento atualizado com sucesso!');
        window.location.href = 'evento.html'; // Redireciona para a lista de eventos
      }
    } catch (err) {
      console.error('Erro inesperado ao atualizar o evento:', err);
      alert('Erro inesperado. Por favor, tente novamente.');
    }
  });
});