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

  const promptTemplate = `Generate a beatuiful github profile README with GPT and AI, base on the input prompt. 
  the user stats are: 
  """
  {{userStats}}}
  """
  A beatuiful github profile README  example is:
  """
  {{example}}}
  """
  Output the generated README in markdown format.
  `;

  const example = `
  <h1 align="center">
    <a href="https://git.io/typing-svg">
      <img src="https://readme-typing-svg.herokuapp.com/?lines=Hello,+There!+👋;This+is+Osman+DURDAĞ....;Nice+to+meet+you!&center=true&size=30">
    </a>
  </h1>
  
  <h5 align="center">
    <code><a href="https://www.linkedin.com/in/osmandurdag/" title="LinkedIn Profile"><img width="22" src="images/linkedin.svg"> LinkedIn</a></code>
    <code><a href="https://www.hackerrank.com/zumrudu_anka" title="HackerRank Profile"><img width="22" src="images/hackerrank.png"> HackerRank</a></code>
    <code><a href="https://stackoverflow.com/users/12578260/osman-durdag" title="Stack Overflow Profile"><img width="22" src="images/stackoverflow.svg"> Stack Overflow</a></code>
    <code><a href="https://www.instagram.com/osman__durdag/" title="Instagram Profile"><img width="22" src="images/instagram.svg"> Instagram</a></code>
  </h5>
  <br>
  <p align="center">
    Hi, I'm Osman DURDAĞ, Research Assistant & Computer Engineer & Software Developer from Turkey
    <br>
    <br>
    🔬 I'm currently studying for a master's degree in Atatürk University Computer Engineering Department
    <br>
    🎓 I graduated from Black Sea Technical University Computer Engineering Department
    <br>
    🎓 I graduated from Erzurum İbrahim Hakkı Science High School
    <br>
    💻 I love writing code and learn anythings about it
    <br>
    📚 I’m currently learning how to build E-Commerce Website with Django
    <br>
    💬 Ask me anything about from <a href="https://github.com/zumrudu-anka/zumrudu-anka/issues" title="Issues">Here</a>
    <br>
    📫 How to reach me: <a href="mailto: osmandurdag@hotmail.com">osmandurdag@hotmail.com</a>
  </p>
  
  <hr>
  <h2 align="center">🔥 Languages & Frameworks & Tools & Abilities 🔥</h2>
  <br>
  <p align="center">
    <code><img title="C" height="25" src="images/c.svg"></code>
    <code><img title="C++" height="25" src="images/cpp.svg"></code>
    <code><img title="C#" height="25" src="images/cSharp.svg"></code>
    <code><img title="Python" height="25" src="images/python-original.svg"></code>
    <code><img title="Django" height="25" src="images/django.png"></code>
    <code><img title="Javascript" height="25" src="images/javascript.svg"></code>
    <code><img title="Problem Solving" height="25" src="images/problemSolving.png"></code>
    <code><img title="HTML5" height="25" src="images/html5.svg"></code>
    <code><img title="CSS" height="25" src="images/css.svg"></code>
    <code><img title="SASS" height="25" src="images/sass.svg"></code>
    <code><img title="Gulp" height="25" src="images/gulp.svg"></code>
    <code><img title="React" height="25" src="images/react-original.svg"></code>
    <code><img title="Redux" height="25" src="images/redux.svg"></code>
    <code><img title="AngularJS" height="25" src="images/angularjs.png"></code>
    <code><img title="Git" height="25" src="images/git-original.svg"></code>
    <code><img title=".NetCore" height="25" src="images/dotnetcore.svg"></code>
    <code><img title="PostgreSQL" height="25" src="images/postgresql.svg"></code>
    <code><img title="Visual Studio Code" height="25" src="images/vscode.png"></code>
    <code><img title="Microsoft Visual Studio" height="25" src="images/visualstudio.png"></code>
    <code><img title="JQuery" height="25" src="images/jquery-original.svg"></code>
    <code><img title="Java" height="25" src="images/java-original.svg"></code>
    <code><img title="JSON" height="25" src="images/json.svg"></code>
    <code><img title="Unity" height="25" src="images/unity3d.svg"></code>
    <code><img title="Android" height="25" src="images/android.svg"></code>
    <code><img title="GitHub" height="25" src="images/github.svg"></code>
    <code><img title="MySQL" height="25" src="images/mysql.svg"></code>
    <code><img title="npm" height="25" src="images/npm.svg"></code>
    <code><img title="PHP" height="25" src="images/php.svg"></code>
    <code><img title="Flask" height="25" src="images/flask.png"></code>
  </p>
  <hr>
  
  <h2 align="center">⚡ Stats ⚡</h2>
  <br>
  <p align=center>
    <div align=center>
      <a href="https://github.com/denvercoder1/github-readme-streak-stats" title="Go to Source">
        <img align="left" width=390 src="https://github-readme-streak-stats.herokuapp.com/?user=zumrudu-anka&theme=react&border=61dafb&hide_border=true" alt="zumrudu-anka" />
      </a>
      <a href="https://github.com/anuraghazra/github-readme-stats" title="Go to Source">
        <img align="right" width=390 src="https://github-readme-stats.vercel.app/api?username=zumrudu-anka&show_icons=true&theme=react&border_color=61dafb&hide_border=true" />
      </a>
    </div>
    <br><br><br><br><br><br><br><br><br>
    <div align=center>
      <a href="https://github.com/anuraghazra/github-readme-stats">
        <img width=325 align="center" src="https://github-readme-stats.vercel.app/api/top-langs/?username=zumrudu-anka&hide=c%23,powershell,Mathematica,Ruby,Objective-C,Objective-C%2b%2b,Cuda&title_color=61dafb&text_color=ffffff&icon_color=61dafb&bg_color=20232a&langs_count=8&layout=compact&border_color=61dafb&hide_border=true" />
      </a>
    </div>
    <br>
  
    <img src="https://github-readme-activity-graph.vercel.app/graph?username=zumrudu-anka&theme=react-dark&bg_color=20232a&hide_border=true" width="100%"/>
  </p>
  
  <hr>
  
  <h2 align="center">👨‍💻 Repositories 👨‍💻</h2>
  <br>
  <div width="100%" align="center">
    <a align="left" href="https://github.com/zumrudu-anka/Algorithms" title="Algorithms"><img align="left" height="115" src="https://github-readme-stats.vercel.app/api/pin/?username=zumrudu-anka&repo=Algorithms&theme=react&border_color=61dafb&border_radius=10"></a><a align="right" href="https://github.com/zumrudu-anka/DataStructures" title="Data Structures"><img align="right" height="115" src="https://github-readme-stats.vercel.app/api/pin/?username=zumrudu-anka&repo=DataStructures&theme=react&border_color=61dafb&border_radius=10"></a>
  </div>
  <br/><br/><br/><br/><br/><br/>
  <div width="100%" align="center">
    <a align="left" href="https://github.com/zumrudu-anka/Turkce-Heceleme-CPP" title="Turkce-Heceleme-CPP"><img align="left" height="115" src="https://github-readme-stats.vercel.app/api/pin/?username=zumrudu-anka&repo=Turkce-Heceleme-CPP&theme=react&border_color=61dafb&border_radius=10"></a>
    <a align="right" href="https://github.com/zumrudu-anka/CopyMoveForgeryDetectionWithDCT" title="Copy&Move Forgery Detection With DCT"><img align="right" height="115" src="https://github-readme-stats.vercel.app/api/pin/?username=zumrudu-anka&repo=CopyMoveForgeryDetectionWithDCT&theme=react&border_color=61dafb&border_radius=10"></a>
  </div>
  <br/><br/><br/><br/><br/><br/>
  <div width="100%" align="center">
    <a align="left" href="https://github.com/zumrudu-anka/cpp-openmp-needleman-wunsch" title="Needleman Wunsch Algorithm With OpenMP"><img align="left" height="115" src="https://github-readme-stats.vercel.app/api/pin/?username=zumrudu-anka&repo=cpp-openmp-needleman-wunsch&theme=react&border_color=61dafb&border_radius=10"></a>
    <a align="right" href="https://github.com/zumrudu-anka/javascript-minesweeper" title="Minesweeper"><img align="right" height="115" src="https://github-readme-stats.vercel.app/api/pin/?username=zumrudu-anka&repo=javascript-minesweeper&theme=react&border_color=61dafb&border_radius=10"></a>
  </div>
  <br/><br/><br/><br/><br/><br/>
  
  <h4 align="center">
    <a href="https://github.com/zumrudu-anka?tab=repositories" title="Show Repositories">🔎 Show More 🔍</a>
  </h4>
  `

  // get github user info from api/github/[username]
  async function getUserStats(username: string): Promise<string> {
      const response = await fetch(`/api/github/${username}`);
      const data = await response.json();
      return data;
  }

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("Getting user stats...");
    setLoading(true);
    const userStats = await getUserStats(userName);
    const prompt = promptTemplate.replace("{{userStats}}", JSON.stringify(userStats)).replace("{{example}}", example);
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
                  <ReactMarkdown>{generatedBios}</ReactMarkdown>
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
