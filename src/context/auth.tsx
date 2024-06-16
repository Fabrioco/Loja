import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { auth, db } from "../firebase/firebaseConnection";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserData } from "../pages/Register/Register";
import { useNavigate } from "react-router-dom";
import { DataStorageProps } from "../pages/Settings/Settings";

type ContainerProps = {
  children: ReactNode;
};

type ContextType = {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    gender: string,
    address: string,
    date: string
  ) => Promise<void>;
  errorHTML: string;
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  logout: () => Promise<void>;
  storageUser: (data: UserData | DataStorageProps) => void
};

export const TheContext = createContext({} as ContextType);

export function Context({ children }: ContainerProps) {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserData | null>(null);
  const [errorHTML, setErrorHTML] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("@User");
    if (storedUser) {
      const userData = JSON.parse(storedUser) as UserData;
      setUser(userData);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        const uid = value.user.uid;

        const docRef = doc(db, "Users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data: UserData = {
            uid: uid,
            name: docSnap.data()?.name,
            email: value.user.email!,
            gender: docSnap.data()?.gender,
            date: docSnap.data()?.date,
            address: docSnap.data()?.address,
            password: docSnap.data()?.password,
          };

          setUser(data);
          storageUser(data);
          navigate("/mail");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/invalid-credential") {
          setErrorHTML("Verifique sua credenciais");
        }
      });
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    date: string,
    gender: string,
    address: string
  ) => {
    try {
      const value = await createUserWithEmailAndPassword(auth, email, password);
      const uid = value.user.uid;

      await setDoc(doc(db, "Users", uid), {
        uid,
        name,
        date,
        gender,
        address,
        email,
        password,
      });

      const data: UserData = {
        uid,
        name,
        date,
        gender,
        address,
        email: value.user.email!,
        password,
      };

      setUser(data);
      storageUser(data);
      navigate("/mail");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setErrorHTML(
          "Esse email já está sendo usado, por favor use outro ou faça login!"
        );
      } else {
        console.error("Erro ao registrar:", error);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("@User");
      navigate("/");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const storageUser = (data: UserData | DataStorageProps) => {
    localStorage.setItem("@User", JSON.stringify(data));
  };

  return (
    <TheContext.Provider
      value={{ signIn, signUp, errorHTML, user, setUser, logout, storageUser }}
    >
      {children}
    </TheContext.Provider>
  );
}
