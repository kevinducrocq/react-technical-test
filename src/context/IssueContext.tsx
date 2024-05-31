import React, { PropsWithChildren, createContext, useContext, useState } from "react";

// Création d'un contexte pour l'ID de l'issue

const IssueContext = createContext({
  issue: "",
  setIssue: (issue: string) => {},
});

// Création d'un hook pour récupérer le contexte
export const useIssueContext = () => useContext(IssueContext);

// Création d'un provider pour le contexte
export const IssueProvider = ({ children }: PropsWithChildren<object>) => {
  const [issue, setIssue] = useState<string>("29671");

  return <IssueContext.Provider value={{ issue, setIssue }}>{children}</IssueContext.Provider>;
};
