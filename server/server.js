require('./config/config');

const express = require('express');
const app = express();

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded( { extended: false } ));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json('Hola mundo');
});

app.get('/usuario', (req, res) => {
    res.json('get usuario');
});

app.post('/usuario', (req, res) => {

    let body = req.body;
    
    res.json({
        persona: body
    });
});

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', (req, res) => {
    res.json('delete usuario');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
})
