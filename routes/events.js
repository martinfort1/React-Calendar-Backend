/* 
    Event routes
    /api/events
*/

const { Router } = require("express");
const { validarJWT } = require('../middlewares/validar-jwt')

const { validarCampos } = require('../middlewares/validar-campos');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { check } = require("express-validator");
const isDate = require("../helpers/isDate");

const router = Router();

router.use( validarJWT );

//Todas las peticiones tienen que pasar la validación del JWT.
// Obtener eventos
router.get('/', getEventos);

//Crear un nuevo evento
router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de fin es obligatoria').custom( isDate ),
        validarCampos
    ], crearEvento);

router.put('/:id', actualizarEvento);

router.delete('/:id', eliminarEvento);

module.exports = router;