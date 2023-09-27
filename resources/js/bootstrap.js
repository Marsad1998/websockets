/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

// import axios from 'axios';
// window.axios = axios;

// window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from "laravel-echo";
import pusher from "pusher-js";

window.Pusher = pusher;

window.Echo = new Echo({
    broadcaster: "pusher",
    key: process.env.PUSHER_APP_KEY,
    cluster: process.env.PUSHER_APP_CLUSTER,
    // wsHost: window.location.hostname,
    wsHost: "site.montyslocksmith.ca", // Your domain
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    encrypted: false,
    enabledTransports: ["ws", "wss"],
});

window.Echo.channel("messages").listen("Notifications", (e) => {
    console.log(e.id);
    document.getElementById("connected").innerText = e.id;
});
