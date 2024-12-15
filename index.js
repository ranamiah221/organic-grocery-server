const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8000;


// middleware...
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ungcn7e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // collection...
    const productCollection= client.db('organicDB').collection('products')
    const cartCollection= client.db('organicDB').collection('carts')
    // get product data from DB
    app.get('/products', async(req, res)=>{
      const result = await productCollection.find().toArray()
      res.send(result)
    })
    // get specific product
    app.get('/products/:id', async(req, res)=>{
      const id= req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result)
    })
    // post carts...
    app.post('/carts', async(req, res)=>{
      const cart = req.body;
      const result = await cartCollection.insertOne(cart)
      res.send(result)
    })
    app.get('/carts', async(req, res)=>{
      let query ={};
      if(req.params?.email){
         query={email: req.params?.email}
      }
      const result = await cartCollection.find(query).toArray()
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send('organic grocery server')
})
app.listen(port, ()=>{
    console.log(`organic grocery server running port ${port}`);
})