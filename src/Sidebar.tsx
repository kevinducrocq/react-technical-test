import Sheet from "@mui/joy/Sheet";

import { useIssueContext } from "./context/IssueContext";
import { Autocomplete, Avatar, Badge, Box, List, ListItem, Typography } from "@mui/joy";
import { User } from "./types/user";
import useFetch from "./useFetch";
import { Issue } from "./types/issue";

type Option = {
  value: number;
  label: string;
};

export default function Sidebar() {
  // On fetch les issues de facebook/react
  const issues = useFetch<Issue[]>({
    url: "https://api.github.com/repos/facebook/react/issues",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_REACT_APP_GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  // On crée une liste d'options pour l'autocomplete
  const issuesOptions: Option[] =
    issues.data?.map((issue) => ({
      value: issue.number,
      label: issue.title,
    })) || [];

  // On récupère le contexte de l'issue
  const { selectedIssue, setSelectedIssue } = useIssueContext();

  // On fetch les utilisateurs des issues
  const usersFromIssues = issues.data?.map((issue) => issue.user) || [];

  // On récupère les utilisateurs, certains sont en double; on les filtre
  const users: User[] = usersFromIssues.filter(
    (user, index, self) => index === self.findIndex((t) => t.login === user.login),
  );

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
        maxHeight: "100vdh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <Autocomplete
        id="combo-box-demo"
        options={issuesOptions.map((option: Option) => option.label)}
        value={selectedIssue}
        onChange={(_, value) => {
          const selectedIssue = issuesOptions.find((option: Option) => option.label === value);
          if (selectedIssue) {
            setSelectedIssue(selectedIssue.value.toString());
          }
        }}
      />

      <Box>
        <Typography component="h3">Users</Typography>
        <List>
          {users.map((user) => (
            <ListItem key={user.login} sx={{ display: "flex", gap: 1 }}>
              <Avatar src={user.avatar_url} />
              <Badge badgeContent={usersFromIssues.filter((u) => u.login === user.login).length} color="primary">
                <Typography>{user.login}</Typography>
              </Badge>
            </ListItem>
          ))}
        </List>
      </Box>
    </Sheet>
  );
}
