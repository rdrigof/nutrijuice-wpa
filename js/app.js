var url = window.location.href;
var swLocation = '/nutrijuice/sw.js';

if ( navigator.serviceWorker ) {
   // if ( url.includes('localhost') ) {
        //git swLocation = '/sw.js';
    //}

    navigator.serviceWorker.register( swLocation );
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
