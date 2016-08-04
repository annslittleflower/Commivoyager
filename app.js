var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
 
var url = 'mongodb://localhost/diploma';
mongoose.connect(url);


////////////////////mongoose\\\\\\\\\\\\\\\\\\\\\\\\\\\

var schemaOrder = new mongoose.Schema({
    goods:{
        type: String,
        require: true,
    },
    address:{
        type: String,
        require: true
    },
    reward:{
        type:Number,
        require:true
    }

});

var Orders = mongoose.model('Orders', schemaOrder); 

//////////////////////MONGOOSE END \\\\\\\\\\\\\\\\\\\
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true
})); 

app.listen(8080, function(){
    console.log("magic happens on 8080");
});

app.use(express.static(path.join(__dirname, 'public')));

var engine = require('ejs-locals');
app.engine('ejs', engine);

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('index');
});

app.get('/order', function(req, res){
    res.render('order');
});

app.post('/order', function(req, res){
    var f = req.body;
    if(!f.goods || !f.address || !f.reward){
        res.render('404', {error: 'Ви не заповнили всі поля в замовленні',
                            link: '/order'});
    }
    else {
    var o = new Orders({
        goods: req.body.goods,
        address: req.body.address,
        reward: req.body.reward
    }).save(function(err){
        console.log("order created");
    });
    res.redirect('/order');
}});

app.get('/map', function(req, res){
    res.render('map');
});

app.get('/404', function(req,res){
    res.render('404',  {error: 'Чого ви тут? все ж добре', link: '/'});
});

app.get('/orders' , function(req, res){
    Orders.find({}, function(err, orders){
        if(err) console.log(err);
        res.render('orders', {orders:orders});
    });
});


app.post('/orders', function(req,res){
    var ids = req.body.orders;
    Orders.find({_id: {$in: ids}}, function(err, orders){
        if(err) console.log(err);
        console.log(orders);
        res.render('map', {orders:orders});
    });
});
