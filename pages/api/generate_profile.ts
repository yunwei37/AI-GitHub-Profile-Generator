// MIT License Copyright (c) 2023 Hassan El Mghari
import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const promptTemplateGenerate = `
Craft a dynamic and visually compelling GitHub profile README,
based on user-provided insights and additional requirements.

**User Insights:** You should take into account the following user insights:
- {{user insights}}

The README should:

- Showcase user skills effectively
- Highlight the user's best projects without giving detailed project descriptions
- Include user contact information
- Provide a deep analysis and comprehensive self-introduction based on the user's GitHub profile

**Style & Design:** The README should be visually appealing. 
You can choose one from the following styles to showcase the user's skills and conclusions:
a. Use a code like structure, creatively struct descriptions like a code
b. add more images, badges, etc. Use less text and more visual elements, structure the README in a more creative way
c. Use a simple and clean structure, focus on the content and analysis

**Format & Structure:** Use Markdown for the layout with visually appealing elements, such as:

- Images
- GIFs
- Badges

Please adhere to the following guidelines:

- Do not use HTML tags, only use Markdown format
- Do not list specific project details, focus on analysis and summarization
- Avoid generating more than 2000 words; however, the generated README should be at least 500 words long

**GitHub Stats:** Consider integrating some of the following GitHub stats. Please replace 'username' with the actual GitHub username:

- ![Github Stats](https://github-readme-stats.vercel.app/api?username=username)
- ![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=username)
- [![trophy](https://github-profile-trophy.vercel.app/?username=username)](https://github.com/username)

**Additional Requirements:** In case of extra needs or specifications, they will be provided in this format:
- {{requirements}}

**Output:** Please generate the final README in Markdown format.
`;

const handler = async (req: Request): Promise<Response> => {
  const { insight, requirements } = (await req.json()) as {
    insight?: string;
    requirements?: string;
  };

  if (!insight) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const prompt = promptTemplateGenerate.
  replace("{{user insights}}", insight).
  replace("{{requirements}}", requirements || "");
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
