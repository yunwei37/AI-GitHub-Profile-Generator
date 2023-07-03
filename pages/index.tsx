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

const promptTemplateAnalyzeUser = `
Given the information about a GitHub user represented by the variables:

- User statistics: {{userStats}}
- User profile: {{userProfile}}

Your task is to provide a detailed analysis of the user's activity and performance on GitHub. Your evaluation should include, but not be limited to, the following:

1. Insight into the user's coding habits, including their most frequently used languages and the frequency of their commits.
2. An overview of their project contributions, both in terms of repositories they've created and those they've contributed to.
3. A snapshot of their overall GitHub presence, encapsulating factors like the number of followers they have and any other significant details available from their profile and stats.

For example, your analysis could highlight a user's strong focus on Python development, their consistent daily commits demonstrating high engagement, or their significant contributions to a high-profile open-source project.

Please structure your analysis in a clear, comprehensible manner, highlighting key insights and patterns in the user's GitHub behavior.
`;

const promptTemplateGenerate = `
Generate a beatuiful github profile README with GPT and AI, base on the input prompt. 
the user insights and analysis are:
"""
{{user insights}}
"""
Craft a captivating GitHub profile README that effectively showcases user skills, 
highlights user best projects, and provides clear contact information. 
Give more analysis and deep insight about the user, 
and generate more self-introduction base on the user's github profile.
Don't forget to incorporate visually appealing elements such as images, GIFs, badges, 
and a well-structured layout using Markdown.

Avoid use html tags, use markdown format.
Avoid to give any numbers directly or list the project details, give more analysis and summary.
Avoid generate more than 2000 words, and the generated README should be more than 500 words.
You can choose to use some of the the following stats, replace it with the real github username:
"""
![Github Stats](https://github-readme-stats.vercel.app/api?username=username
![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=username
[![trophy](https://github-profile-trophy.vercel.app/?username=username)](https://github.com/username)
"""
Here is some additional requirements:
"""
{{requirements}}
"""
Output the generated README in markdown format.
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
    e.preventDefault();
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
    console.log(promptUserAnalysis);
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
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
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
        </div>
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
      </div>

      <ExampleBioComponent />

      <Footer />
    </div>
  );
};

export default Home;
