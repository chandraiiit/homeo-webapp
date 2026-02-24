"use client";

import { useEffect, useState } from "react";
import keycloak from "../lib/keycloak";

export default function AuthProvider({ children }: any) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    keycloak
      .init({
        onLoad: "login-required",
        pkceMethod: "S256",
      })
      .then((auth) => {
        setAuthenticated(auth);
      });
  }, []);

  if (!authenticated) return <div>Loading...</div>;

  return children;
}