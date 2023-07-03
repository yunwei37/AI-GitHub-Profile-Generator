import React from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import MDview from '@/components/mdView';
import ExampleBioComponent from '@/components/example';

const exampleBios = [`
# About Me

Hi, I'm Yunwei, a passionate learner and software developer from Hangzhou, China. Welcome to my GitHub profile!

- 🏢 I currently work at eunomia-bpf to create eBPF-based solutions for the cloud
- 🌍 Find me on the web: [www.yunwei123.tech](https://www.yunwei123.tech/)
- ✉️ Contact me: To be announced
- 📖 I love exploring new technologies and applying them to solve real-world problems

## 🙋‍♂️ A bit more about me

I started my coding journey in 2017, and since then, I have been dedicated to expanding my knowledge and skills. I believe that having a curious and open mind allows me to continue learning and improving.

## 👨‍💻 Stats

![Github Stats](https://github-readme-stats.vercel.app/api?username=yunwei37)
![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=yunwei37)

Feel free to explore my repositories to get a better sense of my work and interests.

## 🏆 Achievements

Here are some notable achievements and contributions:

[![trophy](https://github-profile-trophy.vercel.app/?username=yunwei37)](https://github.com/yunwei37)

These achievements are a testament to my dedication and passion for coding.

## ✨ Let's Connect

I would love to connect with fellow developers, entrepreneurs, and technology enthusiasts. Here are a few ways to get in touch with me:

- Website: [yunwei123.tech](https://www.yunwei123.tech/)
- Twitter: [@yunwei37](https://twitter.com/yunwei37)
- GitHub: [yunwei37](https://github.com/yunwei37)

Let's collaborate, share ideas, and make meaningful contributions to the world of technology!

---

Thank you for taking the time to visit my GitHub profile and read this README. Feel free to explore my projects, and don't hesitate to reach out if you have any questions or opportunities for collaboration. Together, we can make a positive impact in the world of software development!
`];


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

Please structure your analysis in a clear, comprehensible manner with sections,
highlighting key insights and patterns in the user's GitHub behavior.
The generated Analysis should be about 300 words long, 
contains some links to the user's GitHub profile and repositories,
and provides a well-rounded understanding of the user's activity on GitHub.
`;

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

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [generatedUserAnalysis, setGeneratedUserAnalysis] = useState<string>("");
  const [generatedBios, setGeneratedBios] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // get github user info from api/github/[username]
  async function getUserStats(username: string): Promise<string> {
    const response = await fetch(`/api/github/${username}`);
    const data = await response.json();
    return JSON.stringify(data);
  }

  async function getUserPage(username: string): Promise<string> {
    const url = `/api/scrape_url?username=${username}`;
    const response = await fetch(url);
    const data = await response.json();
    return JSON.stringify(data);
  }

  const generateAIresponse = async (e: any, prompt: string, setGenerated: (value: React.SetStateAction<string>) => void) => {
    setGenerated((prev) => "");
    e.preventDefault();
    console.log(prompt);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const onParse = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === "event") {
        const data = event.data;
        try {
          const text = JSON.parse(data).text ?? ""
          setGenerated((prev) => prev + text);
        } catch (e) {
          console.error(e);
        }
      }
    }

    // https://web.dev/streams/#the-getreader-and-read-methods
    const reader = data.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(onParse);
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }
    scrollToBios();
  }
  const handleGenerateUserAnalysis = async (e: any) => {
    if (!userName) {
      window.alert("Please enter a valid GitHub username");
      return;
    }
    setLoading(true);
    e.preventDefault();
    // get user state and analysis user first
    setGeneratedBios(`Getting user stats for ${userName}...`);
    const userStats: string = await getUserStats(userName);
    console.log(userStats);

    setGeneratedBios(`Getting user profile for ${userName}...`);
    const userPage: string = await getUserPage(userName);
    console.log(userPage);
    setGeneratedBios("");

    const promptUserAnalysis = promptTemplateAnalyzeUser.
      replace("{{userStats}}", userStats).
      replace("{{userProfile}}", userPage);
    generateAIresponse(e, promptUserAnalysis, setGeneratedUserAnalysis);

    setLoading(false);
  };

  const handleGenerateBio = async (e: any) => {
    if (!generatedUserAnalysis) {
      window.alert("Please do step 1 first");
      return;
    }
    setLoading(true);
    e.preventDefault();

    const promptProfile = promptTemplateGenerate.
      replace("{{user insights}}", generatedUserAnalysis).
      replace("{{requirements}}", bio);
    generateAIresponse(e, promptProfile, setGeneratedBios);
    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>GitHub Profile AI Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className="flex flex-1 w-full flex-col items-center justify-center px-4 mt-12 sm:mt-20">
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://github.com/yunwei37/AI-GitHub-Profile-Generator"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>Star on GitHub</p>
        </a>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900 text-center">
          Generate GitHub Profile README with GPT
        </h1>
        <p className="text-slate-500 mt-5">14,456 Profile generated so far.</p>
        <div className="max-w-xl w-full">
          <div className="flex mb-5 items-center space-x-3">
            <Image src="/1-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">Let AI Summary your Github Activity and repo with One click.</p>
          </div>
          <div className="block">
            {/* Let user input their github user name here */}
            <input
              type="text"
              onChange={(e) => setUserName(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
              placeholder="Enter your github username"
            />
          </div>
          <MDview
            loading={loading}
            handleGenerateBio={handleGenerateUserAnalysis}
            generatedBios={generatedUserAnalysis}
            buttonText='Let AI analysis Your Github Profile'
            title='Analyze User Profile'
          />

          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/2-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Write a few sentences about yourself{" "}
              <span className="text-slate-500">
                (or leave it blank and we'll generate something for you!)
              </span>
              .
            </p>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "e.g. I am a Full Stack Developer with 9+ years of experience in developing enterprise applications and open-source software."
            }
          />
          <MDview loading={loading} handleGenerateBio={handleGenerateBio} generatedBios={generatedBios}
            buttonText='Generate GitHub Profile README'
            title='Your GitHub Profile README'
          />
          <div className="flex flex-row">
                <p
                    onClick={() => setGeneratedBios((prev) => prev ? "" : exampleBios[0])}
                >
                    Click to show generated example
                </p>
          </div>

          <Footer />
        </div>
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
      </div>

    </div>
  );
};

export default Home;
