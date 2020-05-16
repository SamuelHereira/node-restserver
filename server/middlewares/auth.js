const jwt = require('jsonwebtoken');

// VERIFICAR TOKEN

let verificaToken = ( req, res, next ) => {

    let token = req.get('token'); //busca el header 'token'

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if ( err ) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decoded.usuario;
        next();

    } );

};

// VERIFICA ADMIN_ROLE
let verificaAdminRole = ( req, res, next ) => {

    let usuario = req.usuario;

    if ( !(usuario.role === 'ADMIN_ROLE') ) {

        console.log('No es admin');
        return res.status(400).json({
            ok: false,
            err: {
                message: 'NO es admin'  
            }
        });

    } else {
        
        console.log('Si es admin');
        next();
        
    }

   

}

module.exports = {
    verificaToken,
    verificaAdminRole
}