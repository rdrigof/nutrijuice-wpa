var btn_mdtoast = $('.mdt-action');

var url = window.location.href;
var swLocation = '/nutrijuice/sw.js';
var swReg;

if ( navigator.serviceWorker ) {
   // if ( url.includes('localhost') ) {
        //git swLocation = '/sw.js';
    //}

    navigator.serviceWorker.register( swLocation );

    window.addEventListener('load', function() {

        navigator.serviceWorker.register( swLocation ).then( function(reg){

            swReg = reg;
            swReg.pushManager.getSubscription().then( verificaSuscripcion );

        });

    });
}

// Detectar cambios de conexión
function isOnline() {

    if ( navigator.onLine ) {
        // tenemos conexión
        // console.log('online');
        $.mdtoast('Online', {
            interaction: true,
            interactionTimeout: 1000,
            actionText: 'OK!'
        });


    } else{
        // No tenemos conexión
        $.mdtoast('Offline', {
            interaction: true,
            actionText: 'OK',
            type: 'warning'
        });
    }

}

window.addEventListener('online', isOnline );
window.addEventListener('offline', isOnline );

isOnline();

//Cancelar suscripcion PUSH
function cancelarSuscripcionPush() {

    swReg.pushManager.getSubscription().then( subs => {

        subs.unsubscribe().then( () =>  verificaSuscripcion(false) );

    });

}

//Registrar suscripcion PUSH
function registrarNotificacionesPush() {

    if ( !swReg ) return console.log('No hay registro de SW');

    getPublicKey().then( function( key ) {

        swReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: key
        })
        .then( res => res.toJSON() )
        .then( suscripcion => {

            // console.log(suscripcion);
            // fetch('api/subscribe', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify( suscripcion )
            // })
            // .then( verificaSuscripcion )
            // .catch( cancelarSuscripcionPush );


        });


    });
}

// Notificaciones
function verificaSuscripcion( activadas ) {

    console.log(activadas);
    if ( navigator.onLine ) {
        if (!activadas) {
            $.mdtoast('', {
                interaction: true,
                actionText: 'Recibir Notificaciones',
                action: function () {
                    console.log('Activar!');
                    registrarNotificacionesPush();
                }
            });
        } else {
            $.mdtoast('', {
                interaction: true,
                actionText: 'Desactivar Notificaciones',
                action: function () {
                    console.log('Desactivar!');
                    cancelarSuscripcionPush();
                }
            });
        }


    }

} 
