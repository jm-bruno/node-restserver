const express = require('express');

let { verificaToken } = require('../middlewares/authentication');

let app = express();

let Producto = require('../models/producto');


// ============================
// Obtener todos los productos
// ============================
app.get('/productos', verificaToken, (req, res) => {
    // Trae todos los productos
    // Populate usuario y categoria
    // Paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);


    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });

});

// ============================
// Obtener producto por ID
// ============================
app.get('/productos/:id', verificaToken, (req, res) => {
    // Populate usuario y categoria
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });

        })
        .populate('usuario', 'email nombre')
        .populate('categoria', 'descripcion');

});

// ============================
// Buscar productos por filtro
// ============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex, disponible: true })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });

});

// ============================
// Crear un producto
// ============================
app.post('/productos', verificaToken, (req, res) => {
    // Grabar el usuario
    // Grabar la categoria

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });


});

// ============================
// Actualizar un producto
// ============================
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }
        productoDB.nombre = body.nombre;
        productoDB.descripcion = body.descripcion;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;

        productoDB.save((err, productoGuardado) => {
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
});

// ============================
// Eliminar un producto
// ============================
app.delete('/productos/:id', verificaToken, (req, res) => {
    // Borrado logico
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }
        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto Eliminado'
            });
        });

    });

});



module.exports = app;