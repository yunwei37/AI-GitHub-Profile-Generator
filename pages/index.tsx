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
Craft a captivating GitHub profile README that effectively showcases your skills, 
highlights your best projects, and provides clear contact information. 
Don't forget to incorporate visually appealing elements such as images, GIFs, badges, 
and a well-structured layout using Markdown. Avoid using html tags.
You can use the following stats, replace xxxxx with github username:
"""
![Github Stats](https://github-readme-stats.vercel.app/api?username=xxxxx
![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=xxxxx
"""
Output the generated README in markdown format.
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
    // Post to https://plugin.wegpt.ai/scrape_url with url
    // {
    //   "url": "https://github.com/yunwei37"
    // }
    // return the html page
    const url = "https://plugin.wegpt.ai/scrape_url";
    const data = {
      url: `https://github.com/${username}`
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }).then((response) => response.json());
    const r = await response.json();
    return r;
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
        <title>Twitter Bio Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://github.com/Nutlope/twitterbio"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>Star on GitHub</p>
        </a>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Generate your beautiful GitHub Profile README with GPT
        </h1>
        <p className="text-slate-500 mt-5">47,118 Profile generated so far.</p>
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
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                <div
                  className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedBios);
                    toast("Bio copied to clipboard", {
                      icon: "✂️",
                    });
                  }}
                  key={generatedBios}
                >
                  <ReactMarkdown unwrapDisallowed={true}
                  >{generatedBios}</ReactMarkdown>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
