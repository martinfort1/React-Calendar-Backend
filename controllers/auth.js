const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response) => {

    const { email, password} = req.body;

    try{
        let usuario = await Usuario.findOne({ email });
        if( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese correo'
            })
        }
        usuario = new Usuario( req.body );
        // Encriptar contraseña

        const salt = bcrypt.genSaltSync(  );
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();
        
        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );
        
        return res.status(201).json({
            ok: true,
            msg: 'registro',
            uid: usuario.id,
            name: usuario.name,
            token
        })
    }
    catch(error){
        return res.status(500).json({
            ok:false,
            msg:'Por favor hable con el administrador'
        })
    }
}

const loginUsuario = async (req, res = response) => {
    const { email, password} = req.body;

    try{

        let usuario = await Usuario.findOne({ email });

        if( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario/contraseña invalido'
            })
        }

        //Confirmar passwords
        const validPassword = bcrypt.compareSync( password, usuario.password);
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        };

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

        return res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch(error){
        return res.status(500).json({
            ok:false,
            msg:'Por favor hable con el administrador'
        })
    }

}

const revalidarToken = async (req, res = response) => {

    const { uid, name } = req;

    //Generar nuevo JWT y retornarlo en esta petición
    const token = await generarJWT( uid, name );

    return res.json({
        ok: true,
        token,
        uid,
        name
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
};