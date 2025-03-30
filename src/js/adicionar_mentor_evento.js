import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    const mentoresLista = document.getElementById('mentores-lista');
    const mentoresSelecionados = document.getElementById('mentores-selecionados-lista');
    const eventoId = new URLSearchParams(window.location.search).get('eventoId');

    if (!eventoId) {
        alert('Evento não encontrado. Redirecionando para a lista de eventos.');
        window.location.href = 'listar_eventos_criados.html';
        return;
    }

    // Configuração do formulário de busca de mentores
    const buscarMentorForm = document.getElementById('buscarMentorForm');
    buscarMentorForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const buscaMentor = document.getElementById('buscaMentor').value.trim();

        if (!buscaMentor) {
            alert('Por favor, insira o nome de um mentor para buscar.');
            return;
        }

        try {
            const { data, error } = await banco_supabase
                .from('mentores')
                .select('*')
                .ilike('nome', `%${buscaMentor}%`);

            if (error) {
                console.error('Erro ao buscar mentores:', error.message);
                alert('Erro ao buscar mentores. Por favor, tente novamente.');
                return;
            }

            if (data.length === 0) {
                mentoresLista.innerHTML = '<p>Nenhum mentor encontrado.</p>';
                return;
            }

            mentoresLista.innerHTML = data.map(mentor => `
                <div class="mentor">
                    <span>${mentor.nome} (${mentor.email})</span>
                    <button class="btn-selecionar-mentor" data-id="${mentor.id}">Selecionar</button>
                </div>
            `).join('');

            // Adicionar evento de clique para selecionar mentores
            const selecionarBotoes = document.querySelectorAll('.btn-selecionar-mentor');
            selecionarBotoes.forEach(botao => {
                botao.addEventListener('click', () => {
                    const mentorId = botao.getAttribute('data-id');
                    const mentorInfo = botao.parentElement.querySelector('span').textContent;

                    // Adiciona mentor selecionado à lista
                    const divMentor = document.createElement('div');
                    divMentor.setAttribute('data-id', mentorId);
                    divMentor.textContent = mentorInfo;
                    mentoresSelecionados.appendChild(divMentor);

                    // Remove o botão "Selecionar" após seleção
                    botao.remove();
                });
            });
        } catch (err) {
            console.error('Erro inesperado ao buscar mentores:', err);
            alert('Erro inesperado. Por favor, tente novamente.');
        }
    });

    // Salvando mentores selecionados no evento
    const btnSalvarMentores = document.getElementById('btnSalvarMentores');
    btnSalvarMentores.addEventListener('click', async () => {
        const mentorDivs = mentoresSelecionados.querySelectorAll('div');
        const mentoresIds = Array.from(mentorDivs).map(div => div.getAttribute('data-id'));

        if (mentoresIds.length === 0) {
            alert('Nenhum mentor selecionado. Por favor, selecione ao menos um mentor.');
            return;
        }

        try {
            const insertData = mentoresIds.map(mentorId => ({
                evento_id: eventoId, // ID do evento
                mentor_id: mentorId // ID do mentor
            }));

            const { error } = await banco_supabase
                .from('mentores_eventos') // Tabela que relaciona eventos e mentores
                .insert(insertData);

            if (error) {
                console.error('Erro ao salvar mentores:', error.message);
                alert('Erro ao salvar mentores. Por favor, tente novamente.');
                return;
            }

            alert('Mentores adicionados ao evento com sucesso!');
            window.location.href = 'listar_eventos_criados.html'; // Redireciona para a lista de eventos
        } catch (err) {
            console.error('Erro inesperado ao salvar mentores:', err);
            alert('Erro inesperado. Por favor, tente novamente.');
        }
    });

    // Navegação na sidebar
    const btnHome = document.getElementById('btnHome');
    if (btnHome) {
        btnHome.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'home.html';
        });
    }

    const btnEventos = document.getElementById('btnEventos');
    if (btnEventos) {
        btnEventos.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'evento.html';
        });
    }

    const btnMentores = document.getElementById('btnMentores');
    if (btnMentores) {
        btnMentores.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'mentores.html';
        });
    }

    const btnPerfil = document.getElementById('btnPerfil');
    if (btnPerfil) {
        btnPerfil.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'editar_cadastro.html';
        });
    }

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.clear(); // Limpa o localStorage
            window.location.href = 'index.html'; // Redireciona para a tela de login
        });
    }
});