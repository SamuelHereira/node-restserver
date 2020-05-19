const express = require('express');
let { verificaToken, verificaAdminRole } = require('../middlewares/auth');
const jwt = require('jsonwebtoken');

let app = express();

let Categoria = require('../models/categoria');

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .populate('usuario', 'nombre email')
        .sort('descripcion')
        .exec( (err, categoriasDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } 

            if( !categoriasDB ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: 'No hay categorias creadas'
                    }
                });
            }

            res.json({
                ok: true,
                categorias: categoriasDB,
            })

        })

});

app.get('/categoria/:id', verificaToken,(req, res) => {
    
    let id = req.params.id;

    Categoria.findById( id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } 

        if( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'El id no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
        })

    });

});

app.post('/categoria', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.usuario._id;

    let categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: id
    })
    
    categoria.save( (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    } )

});

app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //Actualiza el nombre de la categoria por ID

    let id = req.params.id;

    Categoria.findByIdAndUpdate( id, 
        {descripcion: req.body.descripcion},
        {new: true, runValidators: true},
        (err, categoriaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if( !categoriaDB ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });


    });

});


app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //Elimina una categoria por ID
    //Solo un admin puede borrarla, pide Token

    let id = req.params.id;

    Categoria.findByIdAndRemove( id, (err, categoriaBorrada) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        } 

        if ( !categoriaBorrada ) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            mensaje: 'Categoria Borrada'
        })

    });

});






module.exports = app;