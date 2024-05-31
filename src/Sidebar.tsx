import Sheet from "@mui/joy/Sheet";
import useFetch from "./useFetch";
import { Issue } from "./types/issue";
import { useIssueContext } from "./context/IssueContext";
import { Autocomplete, Avatar, Badge, Box, List, ListItem, Typography } from "@mui/joy";
import { User } from "./types/user";

export default function Sidebar() {
  // On fetch les issues de facebook/react
  const issues = useFetch<Issue[]>({
    url: "https://api.github.com/repos/facebook/react/issues",
  });

  // On récupère le contexte de l'issue
  const { issue, setIssue } = useIssueContext();

  // On transforme les issues en options pour l'autocomplete
  const issuesOptions =
    issues.data?.map((issue) => ({
      label: issue.number.toString() + " - " + issue.title.substring(0, 25) + "...",
      value: issue.number.toString(),
    })) || [];

  const usersFromIssues: User[] = issues.data?.map((issue) => issue.user) || [];

  // On récupère les utilisateurs, certains sont en double; on les filtre
  const users: User[] = usersFromIssues.filter(
    (user, index, self) => index === self.findIndex((t) => t.login === user.login),
  );

  console.log("usersFromIssues", usersFromIssues);
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
        options={issuesOptions.map((option) => option.label)}
        value={issue}
        sx={{ width: 265 }}
        onChange={(_, value) => {
          value && setIssue(value);
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
