import { account, databases, APPWRITE_DATABASE_ID, APPWRITE_USERS_COLLECTION_ID } from '../lib/appwrite';

export const AuthService = {
  // Check if session exists
  async getSession() {
    try {
      return await account.getSession('current');
    } catch (e) {
      return null;
    }
  },

  // Get current logged-in user details
  async getCurrentUser() {
    try {
      return await account.get();
    } catch (e) {
      return null;
    }
  },

  // Start Google OAuth flow using token-based flow (required for Appwrite SDK v13+)
  async loginWithGoogleWeb(source = null, extId = null) {
    try {
      if (source) {
        sessionStorage.setItem('folio_login_source', source);
      } else {
        sessionStorage.removeItem('folio_login_source');
      }
      if (extId) {
        sessionStorage.setItem('folio_ext_id', extId);
      }

      let successUrl = `${window.location.origin}/login`;
      const queryParams = [];
      if (source) queryParams.push(`source=${encodeURIComponent(source)}`);
      if (extId) queryParams.push(`extId=${encodeURIComponent(extId)}`);
      if (queryParams.length > 0) {
        successUrl += `?${queryParams.join('&')}`;
      }
      // createOAuth2Token is the new flow for Appwrite 1.5+ / SDK v25
      account.createOAuth2Token(
        'google',
        successUrl,
        `${window.location.origin}/login`
      );
    } catch (e) {
      console.error('OAuth initiation failed', e);
      throw e;
    }
  },

  // Sync user to Appwrite Database on first login
  async syncUserToDB(appwriteUser) {
    if (!appwriteUser) return;
    
    try {
      // Check if user document already exists
      try {
        await databases.getDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_USERS_COLLECTION_ID,
          appwriteUser.$id
        );
        // User exists: update document to record activity and refresh $updatedAt
        await databases.updateDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_USERS_COLLECTION_ID,
          appwriteUser.$id,
          {
            email: appwriteUser.email
          }
        );
        return;
      } catch (e) {
        if (e.code === 404) {
          await databases.createDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_USERS_COLLECTION_ID,
            appwriteUser.$id,
            {
              email: appwriteUser.email,
              trial_start: new Date().toISOString(),
              paid: false
            }
          );
        } else {
          throw e;
        }
      }
    } catch (e) {
      console.error('Error syncing user to DB:', e);
    }
  },

  // Logout
  async logout() {
    try {
      await account.deleteSession('current');
      return true;
    } catch (e) {
      return false;
    }
  }
};
