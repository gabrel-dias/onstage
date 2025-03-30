import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', async () => {
  const eventosActions = document.getElementById('eventos-actions');
  const tipoUsuario = localStorage.getItem('tipoUsuario'); // Pega o tipo do usuário no localStorage

  if (!tipoUsuario) {
    alert('Tipo de usuário não encontrado. Faça login novamente.');
    window.location.href = 'index.html';
    return;
  }

  // Exibe botões baseados no tipo de usuário
  let botoesHtml = `<button id="btnListarInscritos">Listar Eventos Inscritos</button>
                    <button id="btnParticiparEventos">Participar de Eventos</button>`; // Botões disponíveis para todos os usuários

  if (tipoUsuario === 'Adm' || tipoUsuario === 'TI') {
    botoesHtml += `<button id="btnCriarEvento">Criar Evento</button>
                   <button id="btnListarCriados">Listar Eventos Criados</button>`; // Botões adicionais para ADM e TI
  }

  eventosActions.innerHTML = botoesHtml;

  // Adiciona eventos aos botões
  document.getElementById('btnCriarEvento')?.addEventListener('click', () => {
    alert('Redirecionando para criar evento...');
    window.location.href = 'criar_evento.html'; // Redireciona para a página Criar Evento
  });

  document.getElementById('btnListarCriados')?.addEventListener('click', () => {
    alert('Redirecionando para listar eventos criados...');
    window.location.href = 'listar_eventos_criados.html'; // Redireciona para a página Listar Eventos Criados
  });

  document.getElementById('btnListarInscritos').addEventListener('click', () => {
    alert('Redirecionando para listar eventos inscritos...');
    window.location.href = 'listar_eventos_inscritos.html'; // Redireciona para a página Listar Eventos Inscritos
  });

  // Lógica para o botão "Participar de Eventos"
  document.getElementById('btnParticiparEventos')?.addEventListener('click', () => {
    alert('Redirecionando para eventos disponíveis...');
    window.location.href = 'participar_eventos.html'; // Redireciona para a página Participar de Eventos
  });

  // Redirecionar para home.html ao clicar no botão de home
  const btnHome = document.getElementById('btnHome');
  if (btnHome) {
    btnHome.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = 'home.html';
    });
  }

  // Redirecionar para evento.html ao clicar no botão de eventos
  const btnEventos = document.getElementById('btnEventos');
  if (btnEventos) {
    btnEventos.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = 'evento.html';
    });
  }

  // Redirecionar para mentores.html ao clicar no botão de mentores
  const btnMentores = document.getElementById('btnMentores');
  if (btnMentores) {
    btnMentores.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = 'mentores.html';
    });
  }

  // Redirecionar para editar_cadastro.html ao clicar no botão de perfil
  const btnPerfil = document.getElementById('btnPerfil');
  if (btnPerfil) {
    btnPerfil.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = 'editar_cadastro.html';
    });
  }

  // Logout do usuário
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.clear(); // Limpa o localStorage
      window.location.href = 'index.html'; // Redireciona para a tela de login
    });
  }
});