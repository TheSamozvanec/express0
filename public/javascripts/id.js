'use strict'
const id=+document.querySelector('.identifier').textContent;
const input = document.querySelector('.inp-pass');
const submit = document.querySelector('.submit-pass');
const login = document.querySelector('.login');
const password = document.querySelector('.password');
const error = document.querySelector('.error');
const del = document.querySelector('.delete');
const update = document.querySelector ('.update');


submit.addEventListener('click',async ()=>{
    try {
        const response = await fetch (`/user/login/${id}`,{
            method:'post',
            headers:{'Content-Type':'application/json; charset=utf-8'},
            body:JSON.stringify({password:input.value})
        });
        if (response.status>=400) throw new Error ('Ошипко, стало быть!!!');
        const result = await response.json();
        if (!result.data) throw new Error ('Неверный пароль!');
        submit.disabled=true;
        login.disabled=false;
        password.disabled=false;
        del.disabled=false;
        update.disabled=false;
        password.value=result.data.password;
        login.value=result.data.login;
    } catch (err) {
        error.textContent=err
    }
});
del.addEventListener('click', async ()=>{
    try {
        const response = await fetch (`/user/${id}`,{
            method:'delete',    
        });
        if (response.status>=400) throw new Error ('Ошипко, стало быть!!!');
        window.location.href='/page/'
    } catch(err) {
        error.textContent=err
    }
});
update.addEventListener('click', async ()=>{
    try {
        if (!login.value.trim()) throw Error ('Нельзя отправить пусттой логин')
        if (!password.value.trim()) throw Error ('Нельзя отправить пусттой пароль')
        const body = JSON.stringify({
            login:login.value,
            password:password.value
        });
        const response = await fetch(`/user/${id}`,{
            method:'PATCH',
            headers:{'Content-Type':'application/json; charset=utf-8'},
            body
        });
        if (response.status>=400) throw new Error ('Ошипко, стало быть!!!');
        window.location.href='/page/'
    } catch (err){
        error.textContent=err
    }
})