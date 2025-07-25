import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "687f82246cda38abd47cc9b3", 
  requiresAuth: true // Ensure authentication is required for all operations
});
