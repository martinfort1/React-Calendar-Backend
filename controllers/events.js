const { response } = require("express");
const Evento = require('../models/Evento');

const getEventos = async (req, res = response) => {

    const eventos = await Evento.find()
                                .populate('user', 'name')

        res.json({
            ok: true,
            eventos
        })
    }

const crearEvento = async (req, res = response) => {
    
    try{
        const evento = new Evento( {...req.body, user: req.uid} );
        const eventoGuardado = await evento.save();

        res.status(201).json({
            ok: true,
            evento: eventoGuardado
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

    res.json({
        ok: true,
        msg: 'crearEventos'
    })
}
const actualizarEvento = async(req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;
    try {
        const evento = await Evento.findById( eventoId );
        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe evento con ese ID'
            })
        }
        if( evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'Solo puede editar eventos que le pertenezcan'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true });

        res.json({
            ok: true,
            evento: eventoActualizado
        })

    }
    catch(err){
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

    res.json({
        ok: true,
        eventoId
    })
};

const eliminarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid= req.uid;
    try{
        const evento = await Evento.findById( eventoId );
        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe evento con ese ID'
            })
        }
        if( evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'Solo puede eliminar eventos que le pertenezcan'
            })
        }
        await Evento.findByIdAndDelete( eventoId );
        
        res.status(200).json({
            ok: true,
            msg: 'Evento eliminado'
        });
    }
    catch(err){
        res.status(500).json({
            ok: false,
            msg:'Hable con el admnistrador'
        })
    }
}
    
    module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}