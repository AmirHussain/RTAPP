
var http = new XMLHttpRequest();
document.addEventListener('DOMContentLoaded', () => {


    const messageForm = document.querySelector('#login-form')

    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('hello')
        http.open("get", "login", true);
        const resp = await http.send();
        console.log(resp)
    })



})