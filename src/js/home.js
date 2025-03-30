document.addEventListener('DOMContentLoaded', () => {
    const btnPerfil = document.getElementById('btnPerfil');
    const btnLogout = document.getElementById('btnLogout');

    // Verificar se o usuário está logado
    const IDUsuario = localStorage.getItem('IDUsuario');
    if (!IDUsuario) {
        alert('Usuário não autenticado. Faça login.');
        window.location.href = 'index.html';
        return;
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

    if (btnCertificado) {
        btnCertificado.addEventListener('click', (event) => {
          event.preventDefault(); // Evita o comportamento padrão do link
          window.location.href = 'emitir_certificado.html'; // Redireciona para a página desejada
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
