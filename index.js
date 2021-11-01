
const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId



const cors = require('cors')
const app = express()
// cors policy
app.use(cors())
// data converted to json
app.use(express.json())
// configuration of dotenv
require('dotenv').config()
const port = process.env.PORT || 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n2jo3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("travelAgency");
        const servicesCollection = database.collection("services");


        const selectedCollection = database.collection("selectedItem");




        // get api method

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })
        app.get('/selectedItem', async (req, res) => {
            const cursor = selectedCollection.find({});
            const item = await cursor.toArray();
            res.send(item)
        })



        app.get("/services/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            console.log(service)
            res.send(service)

        })


        // post api  method
        app.post('/services', async (req, res) => {
            const data = req.body;
            const result = await servicesCollection.insertOne(data);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);

        })

        // post method for selected item

        app.post('/selectedItem', async (req, res) => {
            const data = req.body;
            const result = await selectedCollection.insertOne(data);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);



        })

        // Delete api
        app.delete('/selectedItem/:id', async (req, res) => {
            const id = req.params.id

            const query = { _id: ObjectId(id) }
            const result = await selectedCollection.deleteOne(query)
            console.log('deleted a item', id)
            console.log(result)

            res.json(result)

        })






    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})