const express= require('express');
const keys= require('./config/keys.js');
const stripe = require('stripe')(keys.stripeSectretkey);
const bodyparser= require('body-parser');
const exphbs= require ('express-handlebars');
const { request } = require('express');


const app= express();

//handlebars middleware
app.engine('handlebars', exphbs({defaultlayout:'main'}));
app.set('view engine','handlebars');

//body-parser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

//static folder
app.use(express.static(`${__dirname}/public`));
//index route
app.get('/', (req,res)=>{
    res.render('index', {stripePublishableKey: keys.stripePublichablekey});
    //index is the template name
})
//charge route
app.post('/charge', (req,res)=>{
    //console.log(req.body);
    const amount= 2500;
                    stripe.customers.create({
                    email: req.body.stripeEmail,
                    source: req.body.stripeToken
                }).then(customer=>stripe.charges.create({amount,
                                description:'7-habits-book',
                                currency:'usd',
                                customer: customer.id
                            })).then(charge=>res.render('success'))
   // res.send('TEST');
    
})
// app.get('/success', (req,res)=>{
//     res.render('success');
    
// })

const port= process.env.PORT || 5000;
app.listen(port,()=>{console.log(`server started on port ${port}`)});