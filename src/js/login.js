import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

// Evento para validar login
document.getElementById('formLogin').addEventListener('submit', async (event) => {
  event.preventDefault(); // Evita o comportamento padrão do formulário

  // Obtém os valores do formulário
  const email = document.getElementById('EMAIL').value;
  const senha = document.getElementById('SENHA').value;

  // Verifica se os campos estão preenchidos
  if (!email || !senha) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  try {
    // Verifica se o email existe no banco de dados
    const { data: emailData, error: emailError } = await banco_supabase
      .from('usuarios') // Ajustado para o nome correto da tabela
      .select('*')
      .eq('email', email)
      .single(); // Retorna apenas um registro com o email correspondente

    if (emailError) {
      // Se o erro indica que o email não existe
      alert('Email não cadastrado. Por favor, verifique o email.');
      return;
    }

    // Verifica se a senha está correta para o email encontrado
    if (emailData.senha !== senha) {
      alert('Senha incorreta. Por favor, tente novamente.');
      return;
    }

    // Login realizado com sucesso
    alert('Login realizado com sucesso!');
    localStorage.setItem('IDUsuario', emailData.id);
    localStorage.setItem('nomeUsuario', emailData.nome);
    localStorage.setItem('tipoUsuario', emailData.tipo);
    window.location.href = 'home.html'; // Redireciona para a tela HOME

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    alert('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
  }
});
