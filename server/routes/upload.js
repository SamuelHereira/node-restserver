const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


app.use( fileUpload() );

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if(!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                mensaje: 'No se ha seleccionado ningun archivo',
                ext: extension
            }
        });
    }

    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if( tiposValidos.indexOf(tipo) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                mensaje: `Los tipos validos son: ${tiposValidos.join(', ')}`
            }
        });
    }

    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split('.');

    let extension = nombreCortado[nombreCortado.length -1];

    // EXTENSIONES PERMITIDAS
    let extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if( extensionesValidas.indexOf(extension) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                mensaje: `Las extensiones validas son: ${extensionesValidas.join(', ')}`
            }
        });
    }

    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //

        if( tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }


    });



});

function cargarImagen( id, res, nombreArchivo, tipo ) {

    let tipoSchema;
    if( tipo === 'usuarios' ) {
        tipoSchema = Usuario;
    } else {
        tipoSchema = Producto;
    }

    tipoSchema.findById( id, (err, tipoDB) => {

        if (err) {

            borraArchivo(nombreArchivo, tipo);

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!tipoDB) {
            borraArchivo(nombreArchivo, tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: `${ tipo.slice(3, -2) } no existe`
                }
            });
        }

        borraArchivo(tipoDB.img, tipo)
        


        tipoDB.img = nombreArchivo;
        tipoDB.save( (err, tipooGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                guardado: tipoGuardado,
                img: nombreArchivo
            })
        })


    })
    


}

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById( id, (err, usuarioDB) => {

        if (err) {

            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios')
        


        usuarioDB.img = nombreArchivo;

        usuarioDB.save( (err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })


    }) 

}

function imagenProducto( id, res, nombreArchivo ) {

    Producto.findById( id, (err, productoDB) => {

        if (err) {

            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'producto no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos')
        


        productoDB.img = nombreArchivo;

        productoDB.save( (err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })


    })


}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImagen }`)

    if( fs.existsSync(pathImagen) ) {
        fs.unlinkSync(pathImagen);
    }
}


module.exports = app;
