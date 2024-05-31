import Sheet from "@mui/joy/Sheet";
import useFetch from "./useFetch";
import { Issue } from "./types/issue";
import { useIssueContext } from "./context/IssueContext";
import { Autocomplete } from "@mui/joy";

export default function Sidebar() {
  // On fetch les issues de facebook/react
  const issues = useFetch<Issue[]>({
    url: "https://api.github.com/repos/facebook/react/issues",
    // headers: {
    //   // On a besoin d'un token pour accéder à l'API de GitHub, pour éviter d'être limité dans le nombre de requêtes
    //   Authorization: `token ${import.meta.env.REACT_APP_GITHUB_TOKEN}`,
    // },
  });

  // On récupère le contexte de l'issue
  const { issue, setIssue } = useIssueContext();

  // On transforme les issues en options pour l'autocomplete
  const issuesOptions =
    issues.data?.map((issue) => ({
      label: issue.number.toString() + " - " + issue.title.substring(0, 25) + "...",
      value: issue.number.toString(),
    })) || [];

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: "sticky",
        transition: "transform 0.4s, width 0.4s",
        height: "100dvh",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <Autocomplete
        id="combo-box-demo"
        options={issuesOptions.map((option) => option.label)}
        value={issue}
        sx={{ width: 265 }}
        onChange={(_, value) => {
          value && setIssue(value);
        }}
      />
    </Sheet>
  );
}
