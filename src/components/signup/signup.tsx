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
        <div className="flex flex-col items-center w-full justify-start text-white">
            <div className="px-8 rounded-lg x w-full text-center">
                <div className="space-y-4">
                    <Button
                        variant="primary"
                        className="w-full flex items-center justify-center border border-gray-600 p-2 rounded-md hover:bg-gray-800"
                        onClick={() => callGoogleSignIn()}
                    >
                        <div className="flex flex-row gap-2 items-center justify-between">
                            <div className="h-5 w-5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 326667 333333" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd"><path d="M326667 170370c0-13704-1112-23704-3518-34074H166667v61851h91851c-1851 15371-11851 38519-34074 54074l-311 2071 49476 38329 3428 342c31481-29074 49630-71852 49630-122593m0 0z" fill="#4285f4"/><path d="M166667 333333c44999 0 82776-14815 110370-40370l-52593-40742c-14074 9815-32963 16667-57777 16667-44074 0-81481-29073-94816-69258l-1954 166-51447 39815-673 1870c27407 54444 83704 91852 148890 91852z" fill="#34a853"/><path d="M71851 199630c-3518-10370-5555-21482-5555-32963 0-11482 2036-22593 5370-32963l-93-2209-52091-40455-1704 811C6482 114444 1 139814 1 166666s6482 52221 17777 74814l54074-41851m0 0z" fill="#fbbc04"/><path d="M166667 64444c31296 0 52406 13519 64444 24816l47037-45926C249260 16482 211666 1 166667 1 101481 1 45185 37408 17777 91852l53889 41853c13520-40185 50927-69260 95001-69260m0 0z" fill="#ea4335"/></svg>
                            </div>
                            Sign in with Google
                        </div>
                    </Button>
                    <Button
                        variant="primary"
                        className="w-full flex items-center justify-center border border-gray-600 p-2 rounded-md hover:bg-gray-800"
                        onClick={() => callGoogleSignIn()}
                    >
                        <div className="flex flex-row gap-2 items-center justify-between">
                            <div className="h-5 w-5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" className="shrink-0 size-[20px] mr-[12px]"><title>MS-SymbolLockup</title><path fill="#f25022" d="M1 1h9v9H1z"></path><path fill="#00a4ef" d="M1 11h9v9H1z"></path><path fill="#7fba00" d="M11 1h9v9h-9z"></path><path fill="#ffb900" d="M11 11h9v9h-9z"></path></svg>
                            </div>
                            Sign in with Microsoft
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    )
}
