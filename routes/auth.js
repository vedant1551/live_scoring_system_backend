const router = require('express').Router();
const Scorer = require('../models/Scorer');
const jwt = require('jsonwebtoken');
router.post('/register', async (req,res) =>{


        const scorer = new Scorer(req.body);
        try{
                const savedScorer = await scorer.save();
                res.send(savedScorer)

        }catch(err){

            res.status(400).send(err); 
        
        }
        
      

});

router.post('/login',async (req,res) => {

   
    const scorer = await Scorer.findOne({username: req.body.username});
    if(!scorer) return res.status(400).send('Username doestn exist!');
    
    if(req.body.password != scorer.password)
        return res.status(400).send('paswword is not correct!')
    
    //creat and assign jwt
    const token = jwt.sign({_id: scorer._id}, 'unvunv');
    res.header('auth-token',token).send(token);
});
module.exports = router;