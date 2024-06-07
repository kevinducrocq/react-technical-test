import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import ChatBubble from "./ChatBubble";
import useFetch from "./useFetch";
import { Issue } from "./types/issue";
import { Comment } from "./types/comment";
import { useIssueContext } from "./context/IssueContext";
import { useEffect, useState } from "react";
import { Box, Button, Checkbox, Chip, Sheet } from "@mui/joy";
import { Event } from "./types/event";

export default function MessagesPane() {
  const { selectedIssue: issueId } = useIssueContext();
  const issue = useFetch<Issue>({ url: `https://api.github.com/repos/facebook/react/issues/${issueId}` });
  const comments = useFetch<Comment[]>({ url: issue.data?.comments_url }, { enabled: issue.isFetched });
  const events = useFetch<Event[]>(
    { url: `https://api.github.com/repos/facebook/react/issues/${issueId}/events` },
    { enabled: issue.isFetched },
  );

  const [filterUserComments, setFilterUserComments] = useState<{ [key: string]: boolean }>({});
  const [showEvents, setShowEvents] = useState(true);

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
  const filteredEvents = showEvents ? events.data : [];

  const timeline = [...(filteredComments || []), ...(filteredEvents || [])].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  const renderTimelineItem = (item: Comment | Event) => {
    if ("body" in item) {
      // It's a comment
      return (
        <ChatBubble
          key={item.id}
          variant={item.user.login === issue.data!.user.login ? "solid" : "outlined"}
          body={item.body as string}
          user={item.user}
          created_at={new Date(item.created_at).toLocaleString()}
        />
      );
    } else {
      // It's an event
      return (
        <Box key={item.id} sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography level="body-sm">
            {item.actor.login} {item.event} at {new Date(item.created_at).toLocaleString()}
          </Typography>
        </Box>
      );
    }
  };

  return (
    <Sheet
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.level1",
      }}
    >
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
      <Box m={5}>
        {Object.keys(filterUserComments).map((user) => (
          <Stack direction="row" alignItems="center" spacing={1} key={user}>
            <Checkbox
              checked={filterUserComments[user]}
              onChange={(event) => {
                const isChecked = event.target.checked;
                setFilterUserComments((prev) => ({ ...prev, [user]: isChecked }));
              }}
            />
            <Typography>Show comments from {user}</Typography>
          </Stack>
        ))}
      </Box>

      <Box m={5}>
        <Button onClick={() => setShowEvents(!showEvents)}>{showEvents ? "HIDE EVENTS" : "SHOW EVENTS"}</Button>
      </Box>

      {timeline && (
        <Stack spacing={2} justifyContent="flex-end" px={2} py={3}>
          {timeline.map(renderTimelineItem)}
        </Stack>
      )}
    </Sheet>
  );
}
