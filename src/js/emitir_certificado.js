import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

// Função para carregar os dados do certificado
async function carregarDadosDoCertificado() {
    const IDUsuario = localStorage.getItem('IDUsuario'); // Identifica o usuário logado

    if (!IDUsuario) {
        alert('ID do usuário não encontrado. Faça login novamente.');
        window.location.href = 'index.html'; // Redireciona caso o usuário não esteja logado
        return;
    }

    console.log(`IDUsuario: ${IDUsuario}`); // Log para depuração

    try {
        // Consulta a tabela "usuarios" para buscar o nome do cliente
        const { data: usuario, error: erroUsuario } = await banco_supabase
            .from('usuarios')
            .select('nome') // Seleciona apenas a coluna "nome"
            .eq('id', IDUsuario) // Filtra pelo ID do cliente logado
            .single();

        if (erroUsuario || !usuario) {
            console.error('Erro ao buscar os dados do cliente:', erroUsuario?.message || 'Sem dados encontrados');
            alert('Erro ao carregar os dados do cliente.');
            return null;
        }

        // Consulta a tabela "clientes_eventos" para obter o evento relacionado ao cliente
        const { data: relacionamento, error: erroRelacionamento } = await banco_supabase
            .from('clientes_eventos') // Nome da tabela de relação
            .select('evento_id')
            .eq('cliente_id', IDUsuario)
            .single();

        if (erroRelacionamento || !relacionamento) {
            console.error('Erro ao buscar os dados da relação cliente-evento:', erroRelacionamento?.message || 'Sem dados encontrados');
            alert('Erro ao carregar os dados da relação cliente-evento.');
            return null;
        }

        // Consulta a tabela "eventos" para buscar os detalhes do evento
        const { data: evento, error: erroEvento } = await banco_supabase
            .from('eventos')
            .select('nome_evento, data, hora') // Seleciona as colunas necessárias
            .eq('id', relacionamento.evento_id)
            .single();

        if (erroEvento || !evento) {
            console.error('Erro ao buscar os dados do evento:', erroEvento?.message || 'Sem dados encontrados');
            alert('Erro ao carregar os dados do evento.');
            return null;
        }

        // Combina os dados das tabelas "usuarios", "clientes_eventos" e "eventos"
        console.log('Dados carregados:', { usuario, evento }); // Log para depuração
        return {
            nome: usuario.nome,
            nome_evento: evento.nome_evento,
            data_evento: evento.data,
            hora_evento: evento.hora,
        };
    } catch (err) {
        console.error('Erro inesperado ao carregar os dados do certificado:', err);
        alert('Erro inesperado ao carregar os dados do certificado.');
        return null;
    }
}

// Adiciona evento ao botão para gerar o certificado
document.getElementById('btnCertificado').addEventListener('click', async () => {
    const dadosCertificado = await carregarDadosDoCertificado(); // Busca os dados do certificado

    if (!dadosCertificado) {
        return; // Caso os dados não sejam encontrados
    }

    // Preencher o conteúdo do certificado com os dados carregados
    const conteudoCertificado = document.getElementById('conteudoCertificado');
    const dataFormatada = new Date(dadosCertificado.data_evento).toLocaleDateString('pt-BR');
    const horaFormatada = dadosCertificado.hora_evento;

    conteudoCertificado.innerHTML = `
        <div style="text-align: center; border: 1px solid #ccc; padding: 20px; margin: 20px; font-family: Arial, sans-serif;">
            <h1>Certificado de Participação</h1>
            <p>Certificamos que <b>${dadosCertificado.nome}</b> participou do evento 
            <b>${dadosCertificado.nome_evento}</b> no dia <b>${dataFormatada}</b> às <b>${horaFormatada}</b>.</p>
        </div>
    `;

    console.log('Conteúdo do certificado:', conteudoCertificado.innerHTML); // Verifica o conteúdo gerado

    // Configurações do PDF
    const opcoes = {
        margin: 1,
        filename: 'certificado.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' },
    };

    // Gera o PDF usando html2pdf
    html2pdf().set(opcoes).from(conteudoCertificado).save();
});
// documentação: https://www.npmjs.com/package/html2pdf.js/v/0.9.0