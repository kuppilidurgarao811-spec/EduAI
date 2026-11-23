package com.eduai.auth

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser

/**
 * 13. Firestore Security Rules & Admin Custom Claim Helper
 *
 * CRITICAL SECURITY ARCHITECTURE:
 * Users CANNOT set their own admin custom claim from the Android app!
 * The custom claim { admin: true } is assigned exclusively in a trusted server environment
 * (e.g. Firebase Admin SDK / Cloud Functions).
 *
 * Once assigned on the server, the Android app calls `getIdTokenResult(true)`
 * to force-refresh the JWT token and read the cryptographically signed `admin` claim.
 */
object AdminAuthHelper {

    /**
     * Checks if the currently authenticated user has the server-signed `admin: true` custom claim.
     *
     * @param forceRefresh Set to true to fetch the latest claims directly from Firebase Auth servers.
     * @param onResult Callback returning true if user has admin claim, false otherwise.
     */
    fun checkIsAdmin(forceRefresh: Boolean = false, onResult: (Boolean) -> Unit) {
        val user: FirebaseUser? = FirebaseAuth.getInstance().currentUser
        if (user == null) {
            onResult(false)
            return
        }

        user.getIdToken(forceRefresh)
            .addOnSuccessListener { result ->
                val claims = result.claims
                val isAdmin = claims["admin"] as? Boolean ?: false
                onResult(isAdmin)
            }
            .addOnFailureListener {
                onResult(false)
            }
    }

    /**
     * Retrieves the current user's UID and email for server-side claim provisioning.
     */
    fun getCurrentUserInfo(): Pair<String, String>? {
        val user = FirebaseAuth.getInstance().currentUser ?: return null
        return Pair(user.uid, user.email ?: "")
    }
}
