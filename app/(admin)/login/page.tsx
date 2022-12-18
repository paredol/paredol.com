"use client";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/config";
import { useState } from "react";
import { state } from "../../../common/state";
import { useRouter } from "next/navigation";

const login = (email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    return <p>ERROR</p>;
  });
};

const logout = () => {
  signOut(auth);
};

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (user) {
    return (
      <div>
        <p>Registered User: {user.user.email}</p>
      </div>
    );
  } else {
    return (
      <div className="App">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => createUserWithEmailAndPassword(email, password)}>
          Register
        </button>
      </div>
    );
  }
};
function CurrentUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    state.loading = true;
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  } else if (user) {
    state.loading = false;
    return (
      <div>
        <h1>Hi, {user.email}</h1>
        <button onClick={logout}>Log out</button>
      </div>
    );
  } else {
    return (
      <div className="App">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => login(email, password)}>Log In</button>
      </div>
    );
  }
}

export interface IInputWrapperProps {
  label?: string;
  required?: boolean;
  minimizedLabel?: boolean;
  description?: string;
  error?: string;
  wrapperStyle?: React.CSSProperties;
  children?: JSX.Element | JSX.Element[];
}

export default function LoginPage() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  if (user) {
    router.push("/editor");
  }
  return (
    <div className="container">
      <h1>Be excused</h1>
      {!user && <SignUp />}
    </div>
  );
}
