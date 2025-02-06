'use client'

import { useState } from "react"
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import Button from "@/components/button/button"
import { Input } from "../ui/input"
import { auth, db } from "@/app/firebase/firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"

async function callGoogleSignIn() {
    
    try {
        console.log("Signing in with Google...")
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            window.location.href = '/1/dashboard';
            return;
        }

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
            provider: "google",
            createdAt: new Date()
        }, { merge: true });

        window.location.href = '/1/dashboard';

    } catch (error) {
        console.error("Google sign-in error:", error);
        alert("Google sign-in failed. Please try again.");
    }
}

export default function SignUp() {
    const auth = getAuth()

    if (auth.currentUser) {
        window.location.href = '/1/dashboard'
        return null
    }

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const handleEmailSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
    
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                createdAt: new Date(),
                role: "user"
            })
    
            setError("")
        } catch (err: any) {
            console.error("Email sign-up error:", err)
            let errorMessage = "An error occurred during sign-up.";
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = "The email address is already in use by another account.";
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = "The email address is not valid.";
            } else if (err.code === 'auth/operation-not-allowed') {
                errorMessage = "Email/password accounts are not enabled.";
            } else if (err.code === 'auth/weak-password') {
                errorMessage = "The password is too weak.";
            }        }
    }
    return (
        <div className="flex flex-col items-center w-full justify-start min-h-screen text-white">
            <div className="px-8 rounded-lg x w-full text-center">
                <div className="space-y-4">
                    <Button
                        variant="ghost-heavy"
                        className="w-full flex items-center justify-center border border-gray-600 p-2 rounded-md hover:bg-gray-800"
                        onClick={() => callGoogleSignIn()}
                    >
                        <div className="flex flex-row gap-2 items-center justify-between">
                            <div className="h-5 w-5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2</svg> 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z"></path>
                                </svg>
                            </div>
                            Sign in with Google
                        </div>
                    </Button>
                </div>
                <div className="my-6 text-muted-foreground">or</div>
                <div>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        className="mt-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        variant="fill"
                        className="w-full mt-4 p-2 border-muted rounded-md text-white font-semibold hover:bg-muted"
                        onClick={handleEmailSignUp}
                    >
                        Sign Up
                    </Button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
            </div>
        </div>
    )
}
