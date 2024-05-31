import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import ChatBubble from "./ChatBubble";
import useFetch from "./useFetch";
import { Issue } from "./types/issue";
import { Comment } from "./types/comment";
import { useIssueContext } from "./context/IssueContext";
import { useEffect, useState } from "react";
import { Checkbox, Chip, Sheet } from "@mui/joy";

export default function MessagesPane() {
  const { selectedIssue: issueId } = useIssueContext();
  const issue = useFetch<Issue>({ url: `https://api.github.com/repos/facebook/react/issues/${issueId}` });
  const comments = useFetch<Comment[]>({ url: issue.data?.comments_url }, { enabled: issue.isFetched });

  const [filterUserComments, setFilterUserComments] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (comments.data) {
      const uniqueUsers = Array.from(new Set(comments.data.map((comment) => comment.user.login)));
      setFilterUserComments(
        uniqueUsers.reduce((acc, user) => {
          return { ...acc, [user]: true };
        }, {}),
      );
    }
  }, [comments.data]);

  const filteredComments = comments.data?.filter((comment) => filterUserComments[comment.user.login]);

  return (
    <Sheet
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.level1",
      }}
    >
      {Object.keys(filterUserComments).map((user) => (
        <Stack direction="row" alignItems="center" spacing={1} key={user}>
          <Checkbox
            checked={filterUserComments[user]}
            onChange={(event) => {
              const isChecked = event.target.checked;
              setFilterUserComments((prev) => ({ ...prev, [user]: isChecked }));
            }}
          />
          <Typography>Filter comments from {user}</Typography>
        </Stack>
      ))}
      {issue.data && (
        <Stack
          direction="column"
          justifyContent="space-between"
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.body",
          }}
          py={{ xs: 2, md: 2 }}
          px={{ xs: 1, md: 2 }}
        >
          <Typography
            fontWeight="lg"
            fontSize="lg"
            component="h2"
            noWrap
            endDecorator={
              <Chip
                variant="outlined"
                size="sm"
                color="neutral"
                sx={{
                  borderRadius: "sm",
                }}
              >
                #{issue.data?.number}
              </Chip>
            }
          >
            {issue.data.title}
          </Typography>
          <Typography level="body-sm">{issue.data.user.login}</Typography>
        </Stack>
      )}
      {filteredComments && (
        <Stack spacing={2} justifyContent="flex-end" px={2} py={3}>
          <ChatBubble variant="solid" {...issue.data!} />
          {filteredComments.map((comment) => (
            <ChatBubble
              key={comment.id}
              variant={comment.user.login === issue.data!.user.login ? "solid" : "outlined"}
              {...comment}
            />
          ))}
        </Stack>
      )}
    </Sheet>
  );
}
