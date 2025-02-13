const openlogin = document.getElementById('open_login');
const loginform = document.getElementById('login_form');
const buttonclose = document.getElementById('button_close');

openlogin.addEventListener('click', () => {
    loginform.classList.add('open_form');
});

buttonclose.addEventListener('click', () => {
    loginform.classList.remove('open_form');
});