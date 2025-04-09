'use client'

import { useState, useEffect } from "react"
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore"
import Button from "@/components/button/button"
import { Input } from "../ui/input"
import { auth, db } from "@/app/firebase/firebase"
import { createHmac } from "crypto"
import { Mail } from "lucide-react"

async function callGoogleSignIn() {
  try {
    console.log("Signing in with Google...")
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    const userDoc = await getDoc(doc(db, "users", user.uid))
    if (userDoc.exists() && userDoc.data().isVerified) {
      window.location.href = '/1/dashboard'
      return
    }

    // Store user data in Firestore with isVerified flag
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      provider: "google",
      createdAt: new Date(),
      isVerified: true // Google users are automatically verified
    }, { merge: true })

    window.location.href = '/1/dashboard'
  } catch (error) {
    console.error("Google sign-in error:", error)
    alert("Google sign-in failed. Please try again.")
  }
}

async function callMicrosoftSignIn() {
  // Microsoft sign-in implementation
}

export default function SignUp() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [hashedCode, setHashedCode] = useState("")
  const [userId, setUserId] = useState(null)
  const [timer, setTimer] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [emailOpen, setEmailOpen] = useState(false)

  const authInstance = getAuth()

  useEffect(() => {
    const unsubscribe = authInstance.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists() && userDoc.data().isVerified) {
          window.location.href = '/1/dashboard'
        }
      }
    })
    return () => unsubscribe()
  }, [authInstance])

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [timer])

  const sendVerificationEmail = async (email) => {
    try {
      const response = await fetch('/api/verification/signin/sendemail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to send email')
      return data.hashedCode
    } catch (error) {
      console.error('Email sending error:', error)
      throw error
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password)
      const user = userCredential.user
      setUserId(user.uid)
  
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      })
  
      const hashedCodeFromApi = await sendVerificationEmail(email)
      setHashedCode(hashedCodeFromApi)
  
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: `${firstName} ${lastName}`,
        provider: "email",
        createdAt: new Date(),
        isVerified: false,
        hashedCode: hashedCodeFromApi
      })
  
      await signOut(authInstance)
  
      const timeout = setTimeout(async () => {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists() && !userDoc.data().isVerified) {
          await deleteDoc(doc(db, "users", user.uid))
          await authInstance.currentUser?.delete().catch(() => {})
          alert("Verification expired. Account deleted.")
          setUserId(null)
          setHashedCode("")
        }
      }, 2 * 60 * 60 * 1000) // 2 hour timeout
      setTimer(timeout)
    } catch (error) {
      console.error("Sign up error:", error)
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage("This email is already registered. Please use a different email or sign in.")
      } else {
        setErrorMessage(error.message)
      }
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setErrorMessage("")

    try {
      // Sign in to verify the user
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password)
      const user = userCredential.user
      const currentUserId = user.uid

      if (currentUserId !== userId) {
        throw new Error("User ID mismatch. Unauthorized operation.")
      }

      const response = await fetch('/api/verification/signin/verifycode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode, hashedCode }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const { isValid } = await response.json()

      if (isValid === true) {
        const userDocRef = doc(db, "users", currentUserId)
        await setDoc(
          userDocRef,
          {
            isVerified: true,
            hashedCode: null,
          },
          { merge: true }
        )

        clearTimeout(timer)
        window.location.href = '/1/dashboard'
      } else {
        await authInstance.signOut()
        setErrorMessage("Invalid verification code")
      }
    } catch (error) {
      console.error("Verification error:", error)
      setErrorMessage(error.message || "Verification failed. Please try again.")
      if (authInstance.currentUser) {
        await authInstance.signOut()
      }
    }
  }

  return (
    <div className="flex flex-col items-center w-full justify-start text-white">
      <div className="px-8 rounded-lg w-full text-center space-y-6">
        <div className="space-y-4">
          <Button
            variant="primary"
            className="w-full flex items-center justify-center border border-gray-600 p-2 rounded-md hover:bg-gray-800"
            onClick={() => callGoogleSignIn()}
          >
            <div className="flex flex-row gap-2 items-center justify-between">
              <div className="h-5 w-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 326667 333333">
                  <path d="M326667 170370c0-13704-1112-23704-3518-34074H166667v61851h91851c-1851 15371-11851 38519-34074 54074l-311 2071 49476 38329 3428 342c31481-29074 49630-71852 49630-122593m0 0z" fill="#4285f4"/>
                  <path d="M166667 333333c44999 0 82776-14815 110370-40370l-52593-40742c-14074 9815-32963 16667-57777 16667-44074 0-81481-29073-94816-69258l-1954 166-51447 39815-673 1870c27407 54444 83704 91852 148890 91852z" fill="#34a853"/>
                  <path d="M71851 199630c-3518-10370-5555-21482-5555-32963 0-11482 2036-22593 5370-32963l-93-2209-52091-40455-1704 811C6482 114444 1 139814 1 166666s6482 52221 17777 74814l54074-41851m0 0z" fill="#fbbc04"/>
                  <path d="M166667 64444c31296 0 52406 13519 64444 24816l47037-45926C249260 16482 211666 1 166667 1 101481 1 45185 37408 17777 91852l53889 41853c13520-40185 50927-69260 95001-69260m0 0z" fill="#ea4335"/>
                </svg>
              </div>
              Sign up with Google
            </div>
          </Button>
          <Button
            variant="primary"
            className="w-full flex items-center justify-center border border-gray-600 p-2 rounded-md hover:bg-gray-800"
            onClick={() => callMicrosoftSignIn()}
          >
            <div className="flex flex-row gap-2 items-center justify-between">
              <div className="h-5 w-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21">
                  <path fill="#f25022" d="M1 1h9v9H1z"/>
                  <path fill="#00a4ef" d="M1 11h9v9H1z"/>
                  <path fill="#7fba00" d="M11 1h9v9h-9z"/>
                  <path fill="#ffb900" d="M11 11h9v9h-9z"/>
                </svg>
              </div>
              Sign up with Microsoft
            </div>
          </Button>
          <Button
            variant={`${emailOpen ? "secondary" : "primary"}`}
            className="w-full flex items-center justify-center border border-gray-600 p-2 rounded-md hover:bg-gray-800"
            onClick={() => setEmailOpen(!emailOpen)}
          >
            <div className="flex flex-row gap-2 items-center justify-between">
              <div className="h-5 w-5">
                <Mail className="h-5 w-5" />
              </div>
              Sign up with Email
            </div>
          </Button>
        </div>

        {
          emailOpen && (
            !userId ? (
              <form onSubmit={handleSignUp} className="space-y-4">
                {errorMessage && (
                  <div className="text-red-500 text-sm">{errorMessage}</div>
                )}
                <div className="flex flex-row gap-4 items-center justify-between">
                  <Input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
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
                <Button type="submit" variant="primary" className="w-full">
                  Sign Up
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                {errorMessage && (
                  <div className="text-red-500 text-sm">{errorMessage}</div>
                )}
                <p className="text-sm">A verification code has been sent to {email}</p>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  required
                />
                <Button type="submit" variant="primary" className="w-full">
                  Verify Code
                </Button>
              </form>
            )
          )
        }
      </div>
    </div>
  )
}