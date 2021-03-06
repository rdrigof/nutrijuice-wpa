// imports
importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js')

importScripts('js/sw-db.js');
importScripts('js/sw-utils.js');


const STATIC_CACHE    = 'static-v2';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';


const APP_SHELL = [
    // '/',
    'index.html',
    'css/contact.css',
    'css/custom.css',
    'css/mi-estilo.css',
    'fancy-img/blank.gif',
    'fancy-img/fancybox_loading.gif',
    'fancy-img/fancybox_loading@2x.gif',
    'fancy-img/fancybox_overlay.png',
    'fancy-img/fancybox_sprite.png',

    'images/info_nutricional/alcalinizante.jpg',
    'images/info_nutricional/antioxidante.jpg',
    'images/info_nutricional/depurativo.jpg',
    'images/info_nutricional/energizante.jpg',
    'images/info_nutricional/info_alcalinizante.jpg',
    'images/info_nutricional/info_antioxidante.jpg',
    'images/info_nutricional/info_depurativo.jpg',
    'images/info_nutricional/info_energizante.jpg',
    'images/info_nutricional/info_inmunizador.jpg',
    'images/info_nutricional/info_rejuvenecedor.jpg',
    'images/info_nutricional/inmunizador.jpg',
    'images/info_nutricional/rejuvenecedor.jpg',

    'images/jugos/alcalinizante.jpg',
    'images/jugos/antioxidante.jpg',
    'images/jugos/depurativo.jpg',
    'images/jugos/energizante.jpg',
    'images/jugos/inmunizador.jpg',
    'images/jugos/rejuvenecedor.jpg',

    'images/slider/slider1.jpg',
    'images/slider/slider2.jpg',
    'images/slider/slider3.jpg',
    'images/slider/slider4.jpg',
    'images/slider/slider_img.jpg',
    'images/slider/slider_img2.jpg',

    'images/testimonios/testimonio_1.png',
    'images/testimonios/testimonio_2.png',
    'images/testimonios/testimonio_3.png',

    'images/about_bg.png',
    'images/Encabezado.png',
    'images/footer_bg.jpg',
    'images/logo - copia (2).png',
    'images/logo - copia.png',
    'images/logo.png',
    'images/logo_slider.png',
    'images/man.png',
    'images/portfolio_bg.jpg',
    'images/testimonial_bg - copia.jpg',
    'images/testimonial_bg.jpg',
    'images/top.png',
    
    'js/contact/contact-form.js',
    'js/app.js',
    'js/bootsnav.js',
    'js/bootstrap.min.js',
    'js/isotope-active.js',
    'js/isotope.js',
    'js/jquery-1.12.1.min.js',
    'js/jquery.fancybox.js',
    'js/jquery.scrollUp.min.js',
    'js/main.js',
    'js/sw-utils.js',
    'js/libs/plugins/mdtoast.min.js',
    'js/libs/plugins/mdtoast.min.css'
];

const APP_SHELL_INMUTABLE = [
    'custom-font/fonts.css',
    'custom-font/futuralt-bold-webfont.eot',
    'custom-font/futuralt-bold-webfont.svg',
    'custom-font/futuralt-bold-webfont.ttf',
    'custom-font/futuralt-bold-webfont.woff',
    'custom-font/futuralt-book-webfont.eot',
    'custom-font/futuralt-book-webfont.svg',
    'custom-font/futuralt-book-webfont.ttf',
    'custom-font/futuralt-book-webfont.woff',
    'custom-font/GillSansMT-UltraBold.eot',
    'custom-font/GillSansMT-UltraBold.svg',
    'custom-font/GillSansMT-UltraBold.ttf',
    'custom-font/GillSansMT-UltraBold.woff',
    'fonts/fontawesome-webfont.eot',
    'fonts/fontawesome-webfont.svg',
    'fonts/fontawesome-webfont.ttf',
    'fonts/fontawesome-webfont.woff',
    'fonts/fontawesome-webfont.woff2',
    'fonts/FontAwesome.otf',
    'fonts/glyphicons-halflings-regular.eot',
    'fonts/glyphicons-halflings-regular.svg',
    'fonts/glyphicons-halflings-regular.ttf',
    'fonts/glyphicons-halflings-regular.woff',
    'fonts/glyphicons-halflings-regular.woff2',
    'css/bootsnav.css',
    'css/bootstrap.min.css',
    'css/font-awesome.min.css',
    'css/jquery.fancybox.css',

    'php/functions.php',
    'php/mail.php'
];

self.addEventListener('install', e => {


    const cacheStatic = caches.open( STATIC_CACHE ).then(cache => 
        cache.addAll( APP_SHELL ));

    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => 
        cache.addAll( APP_SHELL_INMUTABLE ));



    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ])  );

});


self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

            if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );

});





self.addEventListener( 'fetch', e => {

    let respuesta;

    if ( e.request.url.includes('/api') ) {

        // return respuesta????
        respuesta = manejoApiMensajes( DYNAMIC_CACHE, e.request );

    } else {

        respuesta = caches.match( e.request ).then( res => {

            if ( res ) {
                
                actualizaCacheStatico( STATIC_CACHE, e.request, APP_SHELL_INMUTABLE );
                return res;
                
            } else {
    
                return fetch( e.request ).then( newRes => {
    
                    return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );
    
                });
    
            }
    
        });

    }

    e.respondWith( respuesta );

});


// tareas asíncronas
self.addEventListener('sync', e => {

    console.log('SW: Sync');

    if ( e.tag === 'nuevo-post' ) {

        // postear a BD cuando hay conexión
        const respuesta = postearMensajes();
        
        e.waitUntil( respuesta );
    }

});



// Escuchar PUSH
self.addEventListener('push', e => {

    // console.log(e);

    const data = JSON.parse( e.data.text() );

    // console.log(data);


    const title = data.titulo;
    const options = {
        body: data.cuerpo,
        icon: 'images/icons/icon-72x72.png',
        // icon: `img/avatars/${ data.usuario }.jpg`,
        badge: 'images/icon-72x72.png',
        image: 'http://nutrijuice.cl/images/portfolio_bg.jpg',
        vibrate: [125,75,125,275,200,275,125,75,125,275,200,600,200,600],
        openUrl: '/',
        data: {
            // url: 'https://google.com',
            url: '/',
            id: data.usuario
        },
        actions: [
            {
                action: '',
                title: '',
                icon: ''
            }
        ]
    };


    e.waitUntil( self.registration.showNotification( title, options) );


});

// Cierra la notificacion
self.addEventListener('notificationclose', e => {
    console.log('Notificación cerrada', e);
});


self.addEventListener('notificationclick', e => {


    const notificacion = e.notification;
    const accion = e.action;


    console.log({ notificacion, accion });
    // console.log(notificacion);
    // console.log(accion);
    

    const respuesta = clients.matchAll()
    .then( clientes => {

        let cliente = clientes.find( c => {
            return c.visibilityState === 'visible';
        });

        if ( cliente !== undefined ) {
            cliente.navigate( notificacion.data.url );
            cliente.focus();
        } else {
            clients.openWindow( notificacion.data.url );
        }

        return notificacion.close();

    });

    e.waitUntil( respuesta );


});
