'use strict'
import { getBySelector} from "./modules/Elements.js";
import { APIjson } from "./modules/fetchs.js";

// const table=document.querySelector('.users_table');
// const error=document.querySelector('.error')
let elems = getBySelector(
    '.sheet',
    '.error',
    '.author'
);
const [table, error, author] = elems;
async function getUsers() {
    try {
        const {err, user, data}= await APIjson.auth.get('/user/');
        if (err) throw err;
        author.textContent = `Я знаю тебя! Имя твоё ${user.login}`
        for (let row of data){
            const tr=document.createElement('tr');
            const id=document.createElement('td');
            const login=document.createElement('td');
            id.textContent=row.id;
            login.textContent=row.login;
            tr.appendChild(login);
            tr.appendChild(id);
            if (row.login===user.login) tr.classList.add('select');
            table.appendChild(tr);
            tr.addEventListener('click', function(){
                window.location.href=`/page/${user.id}`
            });
        }
    } catch(err) {
        error.textContent=err
    }   
}
getUsers()