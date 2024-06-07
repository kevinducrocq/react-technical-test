import { PropsWithChildren, createContext, useContext, useState } from "react";

// Création d'un contexte pour l'ID de l'issue

const IssueContext = createContext({
  selectedIssue: "",
  setSelectedIssue: (issue: string) => {},
});

// Création d'un hook pour récupérer le contexte
export const useIssueContext = () => useContext(IssueContext);

// Création d'un provider pour le contexte
export const IssueProvider = ({ children }: PropsWithChildren<object>) => {
  const [selectedIssue, setSelectedIssue] = useState<string>("29671");

  return <IssueContext.Provider value={{ selectedIssue, setSelectedIssue }}>{children}</IssueContext.Provider>;
};
