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
import { DotsLoader } from "../loaders/mainloader"
import { Mail } from "lucide-react"

var loadinggoogle = false;
var loadingsignin = false;

async function callGoogleSignIn() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    loadinggoogle = true;

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        var signInMethods = [];

        if (user.email) {
            signInMethods = await fetchSignInMethodsForEmail(auth, user.email);
            loadinggoogle = false;
            localStorage.setItem("provider", "Google");
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
            localStorage.setItem("provider", "Google");
        } else {
            console.log("Existing account found, signing in");
            loadinggoogle = false;
        }
    } catch (error) {
        console.error("Google sign-in error:", error);
        loadinggoogle = false;
    } finally {
        loadinggoogle = false; 
    }
}

async function callEmailSignIn(email, password, setLoadingSignIn) {
    const auth = getAuth();
    const normalizedEMAIL = email.trim().toLowerCase();
    console.log("Normalized email being checked:", normalizedEMAIL);

    try {
        setLoadingSignIn(true);

        // Log the auth instance details
        console.log("Auth instance project ID:", auth.app.options.projectId);

        // Check sign-in methods for the email
        let signInMethods;
        try {
            signInMethods = await fetchSignInMethodsForEmail(auth, normalizedEMAIL);
            console.log("Sign-in methods:", signInMethods);
        } catch (error) {
            console.error("Error fetching sign-in methods:", error.message);
            alert("Error checking sign-in methods. Please try again.");
            return;
        }

        if (signInMethods.length === 0) {
            console.log("No account exists for this email.");
            alert("No account found for this email. Please sign up first or check the email.");

            // Try direct sign-in as a fallback
            console.log("Attempting direct sign-in as a fallback...");
            try {
                await signInWithEmailAndPassword(auth, normalizedEMAIL, password);
                console.log("Direct sign-in successful");
                localStorage.setItem("provider", "Email");
            } catch (directError) {
                console.error("Direct sign-in error:", directError.message);
            }
            return;
        }

        if (!signInMethods.includes("password")) {
            console.log("This email is registered with another provider (e.g., Google).");
            alert("This email is registered with another provider (e.g., Google). Please use that sign-in method.");
            return;
        }

        await signInWithEmailAndPassword(auth, normalizedEMAIL, password);
        localStorage.setItem("provider", "Email");
        console.log("Signed in successfully with email/password");
    } catch (error) {
        console.error("Email sign-in error:", error.message);
        alert(`Sign-in failed: ${error.message}`);
    } finally {
        setLoadingSignIn(false);
    }
}

export default function SignIn() {
    const auth = useAuth()
    const router = useRouter()
    const [openEmail, setOpenEmail] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loadinggoogle, setLoadingGoogle] = useState(false)
    const [loadingSignIn, setLoadingSignIn] = useState(false)
    const provider = localStorage.getItem("provider");

    useEffect(() => {
        if (auth.currentUser || getAuth().currentUser) {
            loadingsignin = true;
            router.push('/1/dashboard')
        }
    }, [auth, router])

    return (
        <div className="flex flex-col items-center w-full mt-3 justify-start text-white">
            <div className="px-8 rounded-lg w-full text-center">
                {
                    loadingsignin ? (
                        <DotsLoader color="#ffffff" />
                    ) : (
                        <div className="space-y-4 w-full">
                            <div
                                className={`w-full min-w-full cursor-pointer bg-white text-black hover:bg-white/90 transition-all font-semibold flex items-center relative justify-center p-2 rounded-md ${provider === "Google" ? "shadow-md shadow-cyan-50" : "border-gray-600 hover:bg-gray-800 border"} ${loadinggoogle ? 'bg-muted-foreground/40 text-white border-white' : ''}`}
                                onClick={callGoogleSignIn}
                            >
                                <div className="w-full flex gap-2 items-center justify-between inset-0 flex-col">
                                    {provider === "Google" && (
                                        <div className="w-full absolute right-1">
                                            <PreviouslySignedInWith providercookie={provider} />
                                        </div>
                                    )}
                                    <div className="flex flex-row gap-2 text-black items-center justify-between">
                                        <div className="h-5 w-5">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 326667 333333" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd">
                                                <path d="M326667 170370c0-13704-1112-23704-3518-34074H166667v61851h91851c-1851 15371-11851 38519-34074 54074l-311 2071 49476 38329 3428 342c31481-29074 49630-71852 49630-122593m0 0z" fill="#4285f4" />
                                                <path d="M166667 333333c44999 0 82776-14815 110370-40370l-52593-40742c-14074 9815-32963 16667-57777 16667-44074 0-81481-29073-94816-69258l-1954 166-51447 39815-673 1870c27407 54444 83704 91852 148890 91852z" fill="#34a853" />
                                                <path d="M71851 199630c-3518-10370-5555-21482-5555-32963 0-11482 2036-22593 5370-32963l-93-2209-52091-40455-1704 811C6482 114444 1 139814 1 166666s6482 52221 17777 74814l54074-41851m0 0z" fill="#fbbc04" />
                                                <path d="M166667 64444c31296 0 52406 13519 64444 24816l47037-45926C249260 16482 211666 1 166667 1 101481 1 45185 37408 17777 91852l53889 41853c13520-40185 50927-69260 95001-69260m0 0z" fill="#ea4335" />
                                            </svg>
                                        </div>
                                        {loadinggoogle ? 'Signing in...' : 'Sign in with Google'}
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`w-full min-w-full cursor-pointer bg-white text-black hover:bg-white/90 transition-all font-semibold flex items-center relative justify-center p-2 rounded-md ${provider === "Microsoft" ? "shadow-md shadow-cyan-50" : "border-gray-600 hover:bg-gray-800 border"}`}
                            >
                                <div className="w-full flex gap-2 items-center justify-between inset-0 flex-col">
                                    {provider === "Microsoft" && (
                                        <div className="w-full absolute right-1">
                                            <PreviouslySignedInWith providercookie={provider} />
                                        </div>
                                    )}
                                    <div className="flex flex-row gap-2 items-center justify-between">
                                        <div className="h-5 w-5">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" className="shrink-0 size-[20px] mr-[12px]">
                                                <title>MS-SymbolLockup</title>
                                                <path fill="#f25022" d="M1 1h9v9H1z"></path>
                                                <path fill="#00a4ef" d="M1 11h9v9H1z"></path>
                                                <path fill="#7fba00" d="M11 1h9v9h-9z"></path>
                                                <path fill="#ffb900" d="M11 11h9v9h-9z"></path>
                                            </svg>
                                        </div>
                                        Sign in with Microsoft
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`w-full min-w-full cursor-pointer bg-white text-black hover:bg-white/90 transition-all font-semibold flex items-center relative justify-center p-2 rounded-md ${provider === "Microsoft" ? "shadow-md shadow-cyan-50" : "border-gray-600 hover:bg-gray-800 border"}`}
                                onClick={() => setOpenEmail(!openEmail)}
                            >
                                <div className="w-full flex gap-2 items-center justify-between inset-0 flex-col">
                                    {provider === "Email" && (
                                        <div className="w-full absolute right-1">
                                            <PreviouslySignedInWith providercookie={provider} />
                                        </div>
                                    )}
                                    <div className="flex flex-row gap-2 items-center justify-between">
                                        <Mail className="h-5 w-5" />
                                        Sign in with Email
                                    </div>
                                </div>
                            </div>
                            {
                                openEmail && (
                                    <div className="flex flex-col gap-2 mt-4 w-full">
                                        <Input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        />
                                        <Input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        />
                                        <Button
                                            variant="primary"
                                            className={`w-full ${loadingSignIn ? "bg-muted-foreground/40 text-white border-white" : ""}`}
                                            onClick={() => callEmailSignIn(email, password, setLoadingSignIn)}
                                        >
                                            Sign in
                                        </Button>
                                        {/* show if password / email is wrong */}
                                        {loadinggoogle && (
                                            <div className="text-red-500 text-sm mt-2">
                                                Invalid email or password
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

function PreviouslySignedInWith({providercookie}){
    if (!providercookie) return null;

    return(
        <div className="flex flex-col absolute rounded-md -top-2 right-0 bg-cyan-600 font-medium text-sm items-center mb-5 -mt-2 w-auto justify-start text-white px-2">
            Last signed in
        </div>
    )
}