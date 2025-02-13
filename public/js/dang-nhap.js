const openlogin = document.getElementById('open_login');
const loginform = document.getElementById('login_form');
const buttonclose = document.getElementById('button_close');
const usernamelogin = document.getElementById('username_login');
const password_login = document.getElementById('password_login');

openlogin.addEventListener('click', () => {
    loginform.classList.add('open_form');
});

buttonclose.addEventListener('click', () => {
    loginform.classList.remove('open_form');
});

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


