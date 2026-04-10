import express from 'express' // роутер
// import usersController from '../controllers/usersController.js';
import debugLib from 'debug'

const debug = debugLib('express0:user');
const pageRouter = express.Router();

pageRouter.get('/',(req,res)=>{
    res.render('page',{title:'users', script:'/javascripts/page.js'})
});
pageRouter.get('/:id',(req,res)=>{
    res.render('id',{
        title:'Редактирование', 
        id:req.params.id,
        script:'/javascripts/id.js' 
    });
})

export default pageRouter