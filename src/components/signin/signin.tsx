'use client'

import { useEffect, useState } from "react"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import Button from "@/components/button/button"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { Input } from "../ui/input"
import { useRouter } from 'next/navigation'
import { useAuth } from "@/app/firebase/AuthContext"
import { fetchSignInMethodsForEmail } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "@/app/firebase/firebase"

async function callGoogleSignIn() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        var signInMethods = [];

        if (user.email) {
            signInMethods = await fetchSignInMethodsForEmail(auth, user.email);
        } else {
            throw new Error("User email is null");
        }
        if (signInMethods.length === 0) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || "",
                photoURL: user.photoURL || "",
                provider: "google",
                createdAt: new Date()
            }, { merge: true });
        } else {
            console.log("Existing account found, signing in");
        }
    } catch (error) {
        console.error("Google sign-in error:", error);
    }
}
export default function SignIn() {
    const auth = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        if (auth.currentUser || getAuth().currentUser) {
            router.push('/1/dashboard')
        }
    }, [auth, router])

    function handleEmailSignIn() {
        const auth = getAuth()
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("Signed in successfully:", userCredential.user)
            })
            .catch((error) => {
                setError(error.message)
            })
    }

    return (
        <div className="flex flex-col items-center w-full justify-start min-h-screen text-white">
            <div className="px-8 rounded-lg w-full text-center">
                <div className="space-y-4">
                    <Button
                        variant="ghost-heavy"
                        className="w-full flex items-center justify-center border border-gray-600 p-2 rounded-md hover:bg-gray-800"
                        onClick={callGoogleSignIn}
                    >
                        <div className="flex flex-row gap-2 items-center justify-between">
                            <div className="h-5 w-5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z"></path></svg>
                            </div>
                            Continue with Google
                        </div>
                    </Button>
                </div>
                <div className="my-6 text-muted-foreground">or</div>
                <div>
                    <Input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-4"
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-4"
                    />
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <Button
                        variant="fill"
                        className="w-full mt-4 p-2 border-muted rounded-md text-white font-semibold hover:bg-muted"
                        onClick={handleEmailSignIn}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    )
}
