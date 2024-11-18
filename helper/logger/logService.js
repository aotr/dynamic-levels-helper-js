// utils/logService.js
let logService;

const isServer = typeof window === 'undefined';

if (isServer) {
  // If running on the server, use the server-side log service
  logService = (await import('./logServiceServer.js')).default;
} else {
  // If running in the browser, use the client-side log service
  logService = (await import('./logServiceClient.js')).default;
}

export default logService;
