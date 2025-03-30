import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    const eventosLista = document.getElementById('eventos-lista');
    const tipoUsuario = localStorage.getItem('tipoUsuario'); // Pega o tipo do usuário no localStorage

    if (!tipoUsuario || (tipoUsuario !== 'Adm' && tipoUsuario !== 'TI')) {
        alert('Acesso negado. Somente administradores podem acessar esta página.');
        window.location.href = 'home.html';
        return;
    }

    try {
        // Busca eventos criados no banco de dados
        const { data, error } = await banco_supabase
            .from('eventos')
            .select('id, nome_evento, data, hora, local, descricao, status');

        if (error) {
            console.error('Erro ao buscar eventos:', error.message);
            alert('Erro ao carregar os eventos. Por favor, tente novamente.');
            return;
        }

        if (data.length === 0) {
            eventosLista.innerHTML = '<p>Nenhum evento encontrado.</p>';
            return;
        }

        // Monta a lista de eventos
        const eventosHtml = data.map(evento => `
            <div class="evento">
                <h2>${evento.nome_evento}</h2>
                <p><strong>Data:</strong> ${evento.data}</p>
                <p><strong>Hora:</strong> ${evento.hora}</p>
                <p><strong>Local:</strong> ${evento.local}</p>
                <p><strong>Status:</strong> ${evento.status}</p>
                <p>${evento.descricao}</p>
                <button class="btn-editar-evento" data-id="${evento.id}">Editar</button>
                <button class="btn-adicionar-mentor" data-id="${evento.id}">Adicionar Mentor(es)</button>
            </div>
        `).join('');

        eventosLista.innerHTML = eventosHtml;

        // Adiciona eventos de clique aos botões "Editar"
        const editarBotoes = document.querySelectorAll('.btn-editar-evento');
        editarBotoes.forEach(botao => {
            botao.addEventListener('click', () => {
                const eventoId = botao.getAttribute('data-id'); // Captura o ID do evento
                if (eventoId) {
                    window.location.href = `editar_evento.html?eventoId=${eventoId}`; // Redireciona para editar_evento.html com o ID na URL
                } else {
                    alert('ID do evento não encontrado.');
                }
            });
        });

        // Adiciona eventos de clique aos botões "Adicionar Mentor(es)"
        const adicionarMentorBotoes = document.querySelectorAll('.btn-adicionar-mentor');
        adicionarMentorBotoes.forEach(botao => {
            botao.addEventListener('click', () => {
                const eventoId = botao.getAttribute('data-id'); // Captura o ID do evento
                if (eventoId) {
                    window.location.href = `adicionar_mentor_evento.html?eventoId=${eventoId}`; // Redireciona para adicionar_mentor_evento.html com o ID na URL
                } else {
                    alert('ID do evento não encontrado.');
                }
            });
        });
    } catch (err) {
        console.error('Erro inesperado ao carregar os eventos:', err);
        alert('Erro inesperado. Por favor, tente novamente.');
    }

    // Redirecionar para home ao clicar no botão "Home"
    const btnHome = document.getElementById('btnHome');
    if (btnHome) {
        btnHome.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'home.html';
        });
    }

    // Redirecionar para eventos ao clicar no botão "Eventos"
    const btnEventos = document.getElementById('btnEventos');
    if (btnEventos) {
        btnEventos.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'evento.html';
        });
    }

    // Redirecionar para mentores ao clicar no botão "Mentores"
    const btnMentores = document.getElementById('btnMentores');
    if (btnMentores) {
        btnMentores.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'mentores.html';
        });
    }

    // Redirecionar para editar perfil ao clicar no botão "Perfil"
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