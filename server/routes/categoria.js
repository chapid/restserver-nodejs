const express = require('express');

const { verficaToken, verficaAdminRole } = require('../middlewares/autenticacion');
const app = express();
const Categoria = require('../models/categoria');

//=============================
// Mostrar todas las categorias
//=============================
app.get('/categoria', verficaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });
        });
});

//=============================
// Mostrar una categoria por ID
//=============================
app.get('/categoria/:id', verficaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//=============================
// Crear nueva categoria
//=============================
app.post('/categoria', verficaToken, (req, res) => {
    //regresa la nueva categoria
    //req.usuario_id
    let body = req.body;
    console.log(req.usuario);
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
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

//=============================
// Actualizar categoria
//=============================
app.put('/categoria/:id', verficaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
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

//=============================
// Eliminar categoria
//=============================
app.delete('/categoria/:id', [verficaToken, verficaAdminRole], (req, res) => {
    //solo la puede borrar un administrador
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'EL id no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: 'Categoria borrada'
        });
    });
});


module.exports = app;