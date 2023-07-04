// MIT License Copyright (c) 2023 Hassan El Mghari
import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const stylePrompts = [
  `
  use a descriptive structure with all the sections (Overview, Demo, Getting Started, etc.)
  for example:
  ## Hi there 👋,

  ### I'm Saksham Taneja, I am a community guy who loves tech and see myself as product enthoziast.
  -------
    
  ## 🧐 About
  
  - 🏄‍ Community guy who loves being involved in communities and help students grow
  - 😄 I will usually be a part of hackathons as a #Mentor, #Participants and a #Organiser
  - 🔭 I am currently an MSFT Learn Ambassador, [Mozillian](https://mozillians.org/en-US/u/tanejasaksham/), IBM ZAmbassador, Ex-Google DSC Lead and been a part of many communities and programs by a big force
  - 🌱 I love to speak at public events and have been a speaker at many events. I organise Workshops, Webinars etc to help student Communitiess
  - 👯 And Many More...
  
  
  - 💬 Ask me about anything and everything!
  - 📫 How to reach me: message me at [Whatsapp](https://wa.me/919829599750)
  - ⚡ Fun fact: I love meeting new people and eating food!
  - 💬 Ping Me about #cloud, #RPA, #CommunityOps, #DevRel, #speaking opportunity, #Marketing #CampusOps and anything you like
  
  ...adding more visual elements like GIFs, Images, Badges, etc for better user engagement.
  Use a simple and clean structure, focus on the content and analysis.
  `,
  `
  Use a code like structure, creatively struct descriptions like a code
  for example:
  const anmol = {
    pronouns: "He" | "Him",
    code: ["Javascript", "Python", "Java", "PHP"],
    askMeAbout: ["web dev", "tech", "app dev", "photography"],
    technologies: {
        backEnd: {
            js: ["Node", "Fastify", "Express"],
        },
        mobileApp: {
            native: ["Android Development"]
        },
        devOps: ["AWS", "Docker🐳", "Route53", "Nginx"],
        databases: ["mongo", "MySql", "sqlite"],
        misc: ["Firebase", "Socket.IO", "selenium", "open-cv", "php", "SuiteApp"]
    },
    architecture: ["Serverless Architecture", "Progressive web applications", "Single page applications"],
    currentFocus: "No Focus point at this time",
    funFact: "There are two ways to write error-free programs; only the third one works"
  };
  ...adding more visual elements like GIFs, Images, Badges, etc for better user engagement, 
  and a few simple welcome messages.  
    `,
  `
    add more images, badges, etc. Use less text and more visual elements, structure the README in a more creative way
    Use a simple and clean structure, focus on the content and analysis
    `
];

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
You can use a style like:
"""
{{style}}
"""


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
- [![GitHub Streak](https://streak-stats.demolab.com/?user=DenverCoder1)](https://git.io/streak-stats)

And some of the badges from https://img.shields.io/badge 

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

  let prompt = promptTemplateGenerate.
    replace("{{user insights}}", insight).
    replace("{{requirements}}", requirements || "");
  // choose a random style prompt
  const stylePrompt = stylePrompts[Math.floor(Math.random() * stylePrompts.length)];
  // add style prompt to the main prompt
  prompt = prompt.replace("{{style}}", stylePrompt);
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
