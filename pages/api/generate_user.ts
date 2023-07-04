// MIT License Copyright (c) 2023 Hassan El Mghari
import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};


const promptTemplateAnalyzeUser = `
Given the information about a GitHub user represented by the variables:

- User statistics: {{userStats}}
- User profile: {{userProfile}}

Your task is to provide a detailed analysis of the user's activity and performance on GitHub. Your evaluation should include, but not be limited to, the following:

1. Make a conclusion about the user's overall activity, skill set and interests. Try to infer as much as possible from the data available.
2. Insight into the user's coding habits, including their most frequently used languages and the frequency of their commits.
3. An overview of their project contributions, both in terms of repositories they've created and those they've contributed to.
4. A snapshot of their overall GitHub presence, encapsulating factors like the number of followers they have and any other significant details available from their profile and stats.

For example, your analysis could highlight a user's strong focus on Python development, 
their consistent daily commits demonstrating high engagement, 
or their significant contributions to a high-profile open-source project.

Please structure your analysis in a clear, comprehensible manner with titles and lists,
highlighting key insights and patterns in the user's GitHub behavior.
The generated Analysis should be about 300 words long, 
contains some links to the user's GitHub profile and repositories,
and provides a well-rounded understanding of the user's activity on GitHub.
`;

const handler = async (req: Request): Promise<Response> => {
  const { userStats, userProfile } = (await req.json()) as {
    userStats?: string;
    userProfile?: string;
  };

  if (!userStats || !userProfile) {
    return new Response("No prompt in the request", { status: 400 });
  }
  const prompt = promptTemplateAnalyzeUser.replace
    ("{{userStats}}", userStats)
    .replace("{{userProfile}}", userProfile);
  console.log(prompt);
  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo-16k",
    messages: [{ role: "user", content: prompt }],
    temperature: 1.2,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  // return stream response (SSE)
  return new Response(
    stream, {
      headers: new Headers({
        // since we don't use browser's EventSource interface, specifying content-type is optional.
        // the eventsource-parser library can handle the stream response as SSE, as long as the data format complies with SSE:
        // https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#sending_events_from_the_server
        
        // 'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      })
    }
  );
};

export default handler;
