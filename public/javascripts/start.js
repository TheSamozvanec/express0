'user strict'
import { getBySelector} from "./modules/Elements.js";
import { APIjson } from "./modules/fetchs.js";

let elements=getBySelector(
    '.login',
    '.password',
    '.create',
    '.sign-in',
    '.auth',
    '.error',
    '.exit',
    '.author'
);
let [login, password, create, signIn, auth, error, exit, author]=elements

signIn.addEventListener('click', async ()=>{
    error.textContent='';
    try {
        if(!login.value.trim()) throw new Error ('А звать тебя как? (login)');
        if(!password.value.trim()) throw new Error ('Немой? Или скрываешь чего? (password)');
        let body = {
            login:login.value,
            password:password.value
        }
        const {err, data} = await APIjson.post('/auth/sign-in', body);
        if (err) return error.textContent=err//throw new Error (err);
        isAuth(`Вы авторизованы как ${data.login}`, `Приветствую тебя ${data.login}`);
    } catch(err) {
        error.textContent=err;
    }
});
create.addEventListener('click', async ()=>{
    error.textContent='';
    try {
        if(!login.value.trim()) throw new Error ('А зваться как будешь? (login)');
        if(!password.value.trim()) throw new Error ('А тайну какую хронишь? (password)');
        let body = {
            login:login.value,
            password:password.value
        }
        const {err, data} = await APIjson.post('/auth/create-new', body);
        if (err) throw err;
        isAuth(`Создан новый пользователь login:${data.login}`, `Приветствую тебя ${data.login}`); 
    } catch (err) {
         error.textContent=err;
    }
});
exit.addEventListener('click', async ()=>{
    APIjson.get('/auth/logaut');
    location.reload();
});
;(async ()=>{
    try{
        const {err, user} = await APIjson.auth.get('/auth/chek');
        if (err) throw new Error (err);
        isAuth(`Вы авторизованы как ${user.login}`, `Приветствую тебя ${user.login}`);
    } catch (err) {
        isUnauth('Авторизуйтесь или зарегистрируйтесь!!!');
    }  
})();
function isAuth(text1,text2){
    for (let elem of elements) {
         if (elem.classList.contains('exit')) {
            elem.disabled=false;
            continue;
         }
         elem.disabled=true;
    }
    auth.textContent=text1;
    author.textContent=text2;
}
function isUnauth(text){
    for (let elem of elements) {
         if (elem.classList.contains('exit')) {
            elem.disabled=true;
            continue;
         }
         elem.disabled=false;
    }
    auth.textContent=text;
    author.textContent='';
}