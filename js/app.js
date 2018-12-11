var url = window.location.href;
var swLocation = '/nutrijuice/sw.js';

if ( navigator.serviceWorker ) {
   // if ( url.includes('localhost') ) {
        //git swLocation = '/sw.js';
    //}

    navigator.serviceWorker.register( swLocation );
}