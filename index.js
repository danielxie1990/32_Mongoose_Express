const express = require("express")
const app = express()
const path = require('path')
const mongoose = require("mongoose")
const Product = require('./models/product')
const { urlencoded } = require("express")

const methodOverride = require('method-override')


mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>{
    console.log("Mongo connection open!")
})
.catch(err=>{
    console.log("Oh no, Mongo connection error");
    console.log(err)
})


app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.get("/products", async (req, res)=>{
    const products = await Product.find({})
    res.render('products/index', {products})
})

app.post('/products', async (req, res)=>{
    const newProudct = new Product({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    })

    await newProudct.save()
    res.redirect('/products') 
})

app.get('/products/new', (req, res)=>{
    res.render('products/new')
})

app.get('/products/:id', async(req, res)=>{
    const id = req.params.id
    const product = await Product.findById(id)
    res.render('products/show', {product})
})

app.get('/products/:id/edit', async (req, res)=>{
    const id = req.params.id
    const product = await Product.findById(id)
    res.render('products/edit', {product})

})

app.put('/products/:id', async (req, res)=>{
    const id = req.params.id
    const {name, price, category} = req.body
    const newProduct = await Product.findByIdAndUpdate(id, {
        name:name,
        price: price,
        category: category
    }, {runValidators:true, new: true})

    res.redirect(`/products/${newProduct._id}`)

    
})

app.listen(3001, ()=>{
    console.log("Server running on port 3000!")
})
