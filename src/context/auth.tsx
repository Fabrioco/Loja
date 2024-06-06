import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React, { createContext, useContext, ReactNode, useState } from "react";
import { auth, db } from "../firebase/firebaseConnection";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserData } from "../pages/Register/Register";
import { useNavigate } from "react-router-dom";

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
};

const TheContext = createContext<ContextType | undefined>(undefined);

export function Context({ children }: ContainerProps) {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserData | null>(null);
  const [errorHTML, setErrorHTML] = useState("");

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password).then(
        async (value) => {
          let uid = value.user.uid;

          const docRef = doc(db, "Users", uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            let data: UserData = {
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
        }
      );
    } catch (error) {
      throw new Error("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    date: string,
    gender: string,
    address: string
  ) => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        await setDoc(doc(db, "Users", uid), {
          name,
          date,
          gender,
          address,
          email,
          password,
        })
          .then(() => {
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
          })
          .catch((error) => console.log(error));
      })
      .catch((error: any) => {
        if (error.code === "auth/email-already-in-use") {
          setErrorHTML(
            "Esse email já está sendo usado, por favor use outro ou faça login!"
          );
        }
      });
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("@User");
    navigate("/");
  };

  const storageUser = (data: UserData) => {
    localStorage.setItem("@User", JSON.stringify(data));
  };

  return (
    <TheContext.Provider
      value={{ signIn, signUp, errorHTML, user, setUser, logout }}
    >
      {children}
    </TheContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(TheContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um ContextProvider");
  }
  return context;
};
