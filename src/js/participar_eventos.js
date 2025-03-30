import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    const eventosDisponiveis = document.getElementById('eventos-disponiveis');
    const clienteId = localStorage.getItem('IDUsuario'); // ID do cliente (usuário logado)

    if (!clienteId) {
        alert('ID do usuário não encontrado. Faça login novamente.');
        window.location.href = 'index.html';
        return;
    }

    try {
        // Busca eventos com status "ATIVO"
        const { data: eventos, error } = await banco_supabase
            .from('eventos')
            .select('id, nome_evento, data, hora, local, descricao')
            .eq('status', 'Ativo');

        if (error) {
            console.error('Erro ao buscar eventos ativos:', error.message);
            alert('Erro ao carregar eventos disponíveis. Por favor, tente novamente.');
            return;
        }

        if (eventos.length === 0) {
            eventosDisponiveis.innerHTML = '<p>Nenhum evento disponível no momento.</p>';
            return;
        }

        // Busca os eventos nos quais o usuário já está inscrito
        const { data: inscritos, error: inscritosError } = await banco_supabase
            .from('clientes_eventos')
            .select('evento_id')
            .eq('cliente_id', clienteId);

        if (inscritosError) {
            console.error('Erro ao buscar eventos inscritos:', inscritosError.message);
            alert('Erro ao carregar inscrições. Por favor, tente novamente.');
            return;
        }

        const eventosInscritos = inscritos.map(inscricao => inscricao.evento_id);

        // Monta a lista de eventos
        eventosDisponiveis.innerHTML = eventos.map(evento => {
            const inscrito = eventosInscritos.includes(evento.id);
            const botaoTexto = inscrito ? 'Inscrito' : 'Participar';
            const botaoClasse = inscrito ? 'btn-inscrito' : 'participar-btn';

            return `
                <div class="evento">
                    <div>
                        <h2>${evento.nome_evento}</h2>
                        <p><strong>Data:</strong> ${evento.data}</p>
                        <p><strong>Hora:</strong> ${evento.hora}</p>
                        <p><strong>Local:</strong> ${evento.local}</p>
                        <p>${evento.descricao}</p>
                    </div>
                    <button class="${botaoClasse}" data-id="${evento.id}">${botaoTexto}</button>
                </div>
            `;
        }).join('');

        // Adiciona evento de clique aos botões
        const participarBotoes = document.querySelectorAll('.participar-btn, .btn-inscrito');
        participarBotoes.forEach(botao => {
            botao.addEventListener('click', async () => {
                const eventoId = botao.getAttribute('data-id');
                const estaInscrito = botao.classList.contains('btn-inscrito');

                try {
                    if (estaInscrito) {
                        // Desfazer inscrição
                        const { error: excluirError } = await banco_supabase
                            .from('clientes_eventos')
                            .delete()
                            .match({ cliente_id: clienteId, evento_id: eventoId });

                        if (excluirError) {
                            console.error('Erro ao desfazer inscrição:', excluirError.message);
                            alert('Erro ao desfazer inscrição. Por favor, tente novamente.');
                            return;
                        }

                        alert('Inscrição cancelada com sucesso!');
                        botao.classList.remove('btn-inscrito');
                        botao.classList.add('participar-btn');
                        botao.textContent = 'Participar';
                    } else {
                        // Inscrever no evento
                        const { error: inserirError } = await banco_supabase
                            .from('clientes_eventos')
                            .insert({ cliente_id: clienteId, evento_id: eventoId });

                        if (inserirError) {
                            console.error('Erro ao se inscrever no evento:', inserirError.message);
                            alert('Erro ao se inscrever no evento. Por favor, tente novamente.');
                            return;
                        }

                        alert('Inscrição realizada com sucesso!');
                        botao.classList.remove('participar-btn');
                        botao.classList.add('btn-inscrito');
                        botao.textContent = 'Inscrito';
                    }
                } catch (err) {
                    console.error('Erro inesperado:', err);
                    alert('Erro inesperado. Por favor, tente novamente.');
                }
            });
        });
    } catch (err) {
        console.error('Erro inesperado ao carregar eventos disponíveis:', err);
        alert('Erro inesperado. Por favor, tente novamente.');
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
    
        // Logout do usuário
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                localStorage.clear(); // Limpa o localStorage
                window.location.href = 'index.html'; // Redireciona para a tela de login
            });
        }
});