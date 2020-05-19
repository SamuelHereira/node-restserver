const express = require('express');
let { verificaToken } = require('../middlewares/auth');
let Producto = require('../models/producto');

let app = express();

// OBTENER TODOS LOS PRODUCTOS
app.get('/productos', verificaToken, (req,res) => {
    //trae todos los productos
    //populate: usuarios y categorias
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec( (err, productosDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
    
            if( !productosDB ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: 'No hay productos'
                    }
                });
            }
    
            res.json({
                ok: true,
                productos: productosDB
            });

        });

})

app.get('/productos/:id', verificaToken, (req,res) => {
    //populate: usuarios y categorias
    //paginado

    let id = req.params.id;

    Producto.findById( id )
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec( (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        mensaje: 'No se encuentra el producto'
                    }
                });
            }

            if( !productoDB ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });

})

//Buscar productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre descripcion')
        .exec( (err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        mensaje: 'No se encuentra el producto'
                    }
                });
            }

            if( !productos ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productos
            });
        })
})

app.post('/productos', verificaToken, (req,res) => {
    //graba usuario
    //grabar categoria del listado

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id, 
        nombre: body.nombre,
        descripcion: body.descripcion,
        categoria: body.categoria,
        precioUni: body.precio,
	    disponible: true
        
    });

    producto.save( (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

})

app.put('/productos/:id', verificaToken, (req,res) => {
    //Actualiza los productos
    let id = req.params.id;

    let body = req.body;


    Producto.findById( id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precio;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save( (err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
    
            res.json({
                ok: true,
                producto: productoGuardado
            });

        });

    });

})

app.delete('/productos/:id', verificaToken, (req,res) => {
    //disponible false
    let id = req.params.id;

    Producto.findByIdAndUpdate( id, { disponible: false }, {new: true, runValidators: true}, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
            mensaje: 'Producto Borrado'
        });

    });

})


module.exports = app;