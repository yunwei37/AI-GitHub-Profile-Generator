import React from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';

const promptTemplate = `
Generate a beatuiful github profile README with GPT and AI, base on the input prompt. 
the user stats are: 
"""
{{userStats}}}
"""
The user's github profile is:
"""
{{userProfile}}
"""
Analyzing the user's github profile, and generating a beautiful README for the user.
Craft a captivating GitHub profile README that effectively showcases user skills, 
highlights user best projects, and provides clear contact information. 
Summary the projects and give user analysis of the projects and user.
Maybe you can use badges to showcase the skills or the languages user use, and any other information.
Don't forget to incorporate visually appealing elements such as images, GIFs, badges, 
and a well-structured layout using Markdown.

Avoid to give any numbers directly or list all the projects, give more analysis and summary.
Avoid generate more than 2000 words,
Avoid using html tags directly.
You can choose to use some of the the following stats, replace it with the real github username:
"""
![Github Stats](https://github-readme-stats.vercel.app/api?username=username
![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=username
[![trophy](https://github-profile-trophy.vercel.app/?username=username)](https://github.com/username)
"""
Output the generated README in markdown format.
`;

const instructions = `
# head

## subhead
Sure, here is a step-by-step guide on how to create a visually appealing and impressive GitHub profile README:

1. **Create a New Repository**: The first step is to create a new repository that is the same name as your GitHub username. For example, if your GitHub username is "johndoe", you should create a new repository named "johndoe". This repository will house the README file that will be displayed on your GitHub profile.
2. **Create a README file**: In your new repository, create a new file and name it "README.md". The ".md" extension stands for Markdown, which is the language you'll use to format your README file.
3. **Write Your README**: Now, you can start writing your README. Here are some elements you might want to include:
   - **Introduction**: Briefly introduce yourself and explain what you do.
   - **Skills**: List your skills and areas of expertise.
   - **Projects**: Highlight some of your best projects. You can include links to the project repositories and any live demos if available.
   - **Contact Information**: Provide ways for people to contact you. This could be your email, LinkedIn profile, or other social media links.
4. **Add Visuals**: To make your README more visually appealing, consider adding some visuals. This could be in the form of images, GIFs, or even emojis. You can also use badges to showcase your skills or the languages you use.
5. **Use Markdown**: Markdown is a lightweight markup language that you can use to format your README. You can use it to create headers, lists, links, and more. If you're not familiar with Markdown, there are many guides available online.
6. **Commit and Push**: Once you're happy with your README, commit and push it to your repository. Your new, beautiful GitHub profile README should now be visible on your GitHub profile.
As for an improved prompt to help you generate an outstanding GitHub profile README, consider this:

"Craft a captivating GitHub profile README that effectively showcases your skills, highlights your best projects, and provides clear contact information. Don't forget to incorporate visually appealing elements such as images, GIFs, badges, and a well-structured layout using Markdown."
`;

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
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
    return data;
  }

  async function getUserPage(username: string): Promise<string> {
    const url = `/api/scrape_url?username=${username}`;
    const response = await fetch(url);
    return await response.json();
  }

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("Getting user stats...");
    setLoading(true);
    const userStats = await getUserStats(userName);
    console.log(userStats);
    const userPage: string = await getUserPage(userName);
    setGeneratedBios("");

    const prompt = promptTemplate.replace("{{userStats}}", JSON.stringify(userStats)).replace("{{userProfile}}", userPage);
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
          setGeneratedBios((prev) => prev + text);
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
    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>GitHub Profile AI Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
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

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateBio(e)}
            >
              Generate your GitHub profile README
              &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {generatedBios && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={bioRef}
                >
                  Your generated Github Profile
                </h2>
              </div>

            </>
          )}
        </div>
      </main>
      <div className="space-y-8 flex flex-col items-center max-w-xl mx-auto">
        <div
          className="bg-white rounded-xl shadow-mdhover:bg-gray-100 transition cursor-copy border"
          onClick={() => {
            navigator.clipboard.writeText(generatedBios);
            toast("Bio copied to clipboard", {
              icon: "✂️",
            });
          }}
          key={generatedBios}
        >
          <div className="markdown-body p-4">
            <ReactMarkdown children={generatedBios} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
