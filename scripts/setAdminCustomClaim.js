/**
 * Secure Server-Side Firebase Admin Custom Claim Assignment Script
 *
 * CRITICAL SECURITY PRINCIPLE:
 * The admin custom claim must be assigned securely from a trusted server environment;
 * never let users set their own admin claim from the Android app or web client.
 *
 * Firebase Auth custom claims are cryptographically signed inside the user's JWT ID Token.
 * Only environments with Firebase Admin SDK privileges (using a Service Account key)
 * can modify user claims via `admin.auth().setCustomUserClaims(uid, { admin: true })`.
 */

// In production Node server / Cloud Functions: const admin = require('firebase-admin');
let admin;
try {
  admin = require('firebase-admin');
  if (!admin.apps.length) {
    admin.initializeApp();
  }
} catch {
  // Mock / fallback placeholder when running outside production server environment
  admin = null;
}

/**
 * Assigns the `admin: true` custom claim to a target user UID.
 *
 * @param {string} targetUid The UID of the authenticated user to promote to administrator
 */
export async function assignAdminClaim(targetUid) {
  if (!targetUid || typeof targetUid !== 'string') {
    throw new Error('Invalid user ID provided.');
  }

  try {
    // 1. Verify user exists
    const userRecord = await admin.auth().getUser(targetUid);

    // 2. Set the custom claim { admin: true } securely
    await admin.auth().setCustomUserClaims(targetUid, {
      admin: true,
      role: 'admin',
      assignedAt: new Date().toISOString(),
    });

    console.log(`[Security] Successfully assigned admin custom claim to user: ${userRecord.email || targetUid}`);
    return {
      success: true,
      message: `Admin custom claim granted to ${userRecord.email || targetUid}. User must refresh token to apply.`,
    };
  } catch (error) {
    console.error(`[Security Error] Failed to set admin claim for ${targetUid}:`, error);
    throw error;
  }
}

/**
 * Revokes the admin custom claim from a user.
 *
 * @param {string} targetUid The UID of the user whose admin claim is revoked
 */
export async function revokeAdminClaim(targetUid) {
  try {
    await admin.auth().setCustomUserClaims(targetUid, {
      admin: false,
      role: 'student',
      revokedAt: new Date().toISOString(),
    });
    return {
      success: true,
      message: `Admin custom claim revoked for UID ${targetUid}.`,
    };
  } catch (error) {
    console.error(`[Security Error] Failed to revoke admin claim:`, error);
    throw error;
  }
}

/**
 * Example Cloud Function (Callable) for Super Admin use:
 *
 * exports.setAdminClaim = functions.https.onCall(async (data, context) => {
 *   // Ensure caller is already a verified super-admin
 *   if (!context.auth || context.auth.token.admin !== true) {
 *     throw new functions.https.HttpsError('permission-denied', 'Only existing administrators can assign admin privileges.');
 *   }
 *   const { targetUid } = data;
 *   return await assignAdminClaim(targetUid);
 * });
 */
