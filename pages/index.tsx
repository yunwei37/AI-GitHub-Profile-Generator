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
Output the generated README in markdown format.
`;

const exampleBios = [`
# About Me

Hi, I'm Yunwei, a passionate learner and software developer from Hangzhou, China. Welcome to my GitHub profile!

- 🏢 I currently work at eunomia-bpf
- 🌍 Find me on the web: [yunwei123.tech](https://www.yunwei123.tech/)
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

## 🚀 My Skills:

| Category        | Technology                 | 
|-----------------|----------------------------| 
| Programming     | Python                     | 
| Programming     | JavaScript                 | 
| Markup Language | HTML                       | 
| Stylesheet      | CSS                        | 
| Web Framework   | Django                     | 
| Web Framework   | Flask                      | 
| Backend         | Node.js                    | 
| Frontend        | React                      | 
| Data Science    | Data Analysis              | 
| Data Science    | Machine Learning           | 
| Database        | SQL                        | 
| Version Control | Git                        | 
| Containerization| Docker                     | 
| Cloud Computing | AWS                        |

## ✨ Let's Connect

I would love to connect with fellow developers, entrepreneurs, and technology enthusiasts. Here are a few ways to get in touch with me:

- Website: [yunwei123.tech](https://www.yunwei123.tech/)
- Twitter: [@yunwei37](https://twitter.com/yunwei37)
- GitHub: [yunwei37](https://github.com/yunwei37)

Let's collaborate, share ideas, and make meaningful contributions to the world of technology!

---

Thank you for taking the time to visit my GitHub profile and read this README. Feel free to explore my projects, and don't hesitate to reach out if you have any questions or opportunities for collaboration. Together, we can make a positive impact in the world of software development!
`];

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [generatedBios, setGeneratedBios] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const [exampleBio, setExampleBio] = useState<string>("");

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
    setGeneratedBios(`Getting user stats for ${userName}...`);
    setLoading(true);
    const userStats = await getUserStats(userName);
    console.log(userStats);
    setGeneratedBios(`Getting user profile for ${userName}...`);
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
        {generatedBios && <div
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
        </div>}
        <div className="flex flex-row">
          <p
            onClick={() => setExampleBio(exampleBios[0])}
          >Click to show generated example</p>
        </div>
        {exampleBio && <div className="bg-white rounded-xl shadow-mdhover:bg-gray-100 transition cursor-copy border">
          {/* use a list of buttons to show the examples */}
          <div className="markdown-body p-4">
            <ReactMarkdown children={exampleBio} />
          </div>
        </div>}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
