'use strict'
const form = document.querySelector('form');
const p = document.querySelector('.test');

form[3].addEventListener('click', function(e){
    e.preventDefault();
    for (let obj of form){
        if (obj===this) continue;
        if (obj.value.length<3) {
            p.innerHTML=`Не буду отправлять! ты не запонил <b>${obj.placeholder}</b>`;
            return
        }
    }
    form.submit();
    
    // fetch('',{
    //     method:'post', 
    //     headers:{'Content-Type':'application/json'},
    //     body:JSON.stringify({
    //         login:form[0].value,
    //         surname:form[1].value,
    //         password:form[2].value
    //     })})
    //     .then(res=>res.text())
    //     .then(html=>{
    //         document.open();
    //         document.write(html);
    //         document.close();
    //     })
    //     .catch(err=>console.error(err)) //пример работы через fetch
});
