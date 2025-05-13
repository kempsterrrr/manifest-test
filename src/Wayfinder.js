// src/wayfinder.js
import { ARIO, Wayfinder, RandomGatewayRouter, NetworkGatewaysProvider } from '@ar.io/sdk'
import axios from 'axios'

// initialize ARIO client on mainnet
const ario = ARIO.mainnet()

// set up a router that picks a random gateway each time
export const wf = new Wayfinder({
     router: new RandomGatewayRouter({
     gatewaysProvider: new NetworkGatewaysProvider({ ario: ARIO.mainnet() })
     }), 
     httpClient: axios
    });

// create the Wayfinder instance
// export const wf = new Wayfinder({
//   router,
//   httpClient: axios
// })
