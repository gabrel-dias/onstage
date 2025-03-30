import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const formCadastro = document.getElementById('formCadastro');

  if (formCadastro) {
    formCadastro.addEventListener('submit', async (event) => {
      event.preventDefault();

      // Coleta os valores do formulário
      const nome = document.getElementById('NOME').value;
      const email = document.getElementById('EMAIL').value;
      const senha = document.getElementById('SENHA').value;
      const tipo = document.getElementById('TIPO').value;

      // Valida se os campos foram preenchidos
      if (!nome || !email || !senha || !tipo) {
        alert('Por favor, preencha todos os campos.');
        return;
      }

      try {
        // Insere no banco de dados
        const { error } = await banco_supabase
          .from('usuarios') // Tabela "usuarios"
          .insert({ 
            nome: nome, 
            email: email, 
            senha: senha, 
            tipo: tipo, 
            status: 'Ativo' // Define o status como ativo por padrão
          });

        if (error) {
          console.error('Erro ao inserir usuário:', error.message);
          alert('Erro ao inserir usuário. Por favor, tente novamente.');
        } else {
          alert('Cadastro realizado com sucesso!');
          window.location.href = 'index.html'; // Redireciona para a tela de login
        }
      } catch (err) {
        console.error('Erro inesperado:', err);
        alert('Ocorreu um erro inesperado. Por favor, tente novamente.');
      }
    });
  }
});
