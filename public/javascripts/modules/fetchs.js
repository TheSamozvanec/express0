'use strict'
export const APIjson = {
    get: async function (path) {
        try {
                let err='';
                let status = 0;
                const REST = await fetch (path,{method:'GET'});
                status=REST.status
                if (status>=400) {
                    const err = await REST.json();
                    throw new Error (err.message);
                } 
                const data = await REST.json();
                return {err,status,data} 
            } catch(err) {
                return {err, status, data:{}}
            }
    },
    post: async function (path, obj) {
        try {
                let err='';
                let status = 0;
                const body=JSON.stringify(obj);
                const REST = await fetch (path,{
                method:'POST',
                headers:{'Content-Type':'application/json; charset=utf-8'},
                body
                });
                status=REST.status
                if (status>=400) {
                    const err = await REST.json();
                    throw new Error (err.message);
                } 
                const data = await REST.json();
                return {err,status,data} 
            } catch(err) {
                return {err, status, data:{}}
            }
    },
    auth:{
        get: async function (path) {
            try {
                    let err='';
                    let status = 0;
                    const REST = await fetch (path,{
                    method:'GET',
                    credentials:'include',
                    });
                    status=REST.status
                    if (status>=400) {
                        const err = await REST.json();
                        throw new Error (err.message);
                    } 
                    const {data, user} = await REST.json();

                    return {err, status, data, user} 
                } catch(err) {
                    return {err, status, data:{}}
                }
        },
        post: async function (path,obj) {
            try {
                    let err='';
                    let status = 0;
                    const body=JSON.stringify(obj);
                    const REST = await fetch (path,{
                    method:'POST',
                    credentials:'include',
                    headers:{'Content-Type':'application/json; charset=utf-8'},
                    body
                    });
                    status=REST.status
                    if (status>=400) {
                        const err = await REST.json();
                        throw new Error (err.message);
                    } 
                    const {data, user} = await REST.json();
                    return {err, status, data, user} 
                } catch(err) {
                    return {err, status, data:{}}
                }
        },
    }
}