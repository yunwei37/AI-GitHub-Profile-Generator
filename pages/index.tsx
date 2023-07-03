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
  ### Hi there <a href="https://www.gautamkrishnar.com/"><img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="5%"></a>

  This is the place where I opensource stuff and break things :rofl:

- 🔭 &nbsp;I’m currently working on something cool :wink:
- 🌱 &nbsp;I’m currently learning Flutter, Go
- 💬 &nbsp;Ask me about anything related to Javascript/Typescript/Python or Angular/React/Express/Flask
- 👨‍💻 &nbsp;Read more about my projects at [gautamkrishnar.com](https://www.gautamkrishnar.com/#portfolio)
- ⚡ &nbsp;Fun fact: I :heart: :dog:s and Xbox Gaming (GamerTag: [GKRXtreme](https://account.xbox.com/en-us/profile?gamertag=GKRXtreme))

🔗 &nbsp;**Connect with me**
<p align="left">
<a href="https://dev.to/gautamkrishnar" target="blank"><img align="center" src="https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/dev-dot-to.svg" alt="gautamkrishnar" height="30" width="40" /></a>
<a href="https://twitter.com/gautamkrishnar" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/twitter.svg" alt="gautamkrishnar" height="30" width="40" /></a>
<a href="https://linkedin.com/in/gautamkrishnar" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="gautamkrishnar" height="30" width="40" /></a>
<a href="https://stackoverflow.com/users/4214976" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/stack-overflow.svg" alt="4214976" height="30" width="40" /></a>
<a href="https://instagram.com/gautamkrishnar" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/instagram.svg" alt="gautamkrishnar" height="30" width="40" /></a>

📊 &nbsp;**This week I spent my time on**

![Wwakatime stats](https://github-readme-stats-taupe-two.vercel.app/api/wakatime?username=gautamkrishnar&hide_title=true&hide_border=true&langs_count=5&bg_color=00000000&text_color=777)
  
### ✨&nbsp; About Me

I am a Full Stack Developer with 9+ years of experience in developing enterprise applications and open-source software.

#### My Opensource Story

All of my projects are released as open-source on GitHub, this includes some of my GitHub trending projects:
- [Nothing Private](https://github.com/gautamkrishnar/nothing-private) - This proof of concept project showcases the ability of any website to track and identify individuals, even when using private browsing or incognito mode in their web browser. With over 5000K users and 1.8K stars, it has garnered attention and discussions in privacy forums and conferences globally. Its impact has led to improvements from privacy-focused browser vendors to counter fingerprinting, and has increased public awareness of the dangers of browser fingerprinting.
- [Blog Post Workflow](https://github.com/gautamkrishnar/blog-post-workflow) - A Github action to show your latest blog posts from any sources or StackOverflow activity or Youtube Videos on your GitHub profile/project readme automatically using the RSS feed. It is now used by over 5.6K+ users and running on thousands of GitHub actions runner every hour. It is also one of the top 20 [most used](https://github.com/marketplace?category=&query=sort%3Apopularity-desc&type=actions&verification=) GitHub actions internationally in GitHub Marketplace.
-  [SoCLI](https://github.com/gautamkrishnar/socli) Within 24 hours of its release, it garnered over 300 stars and now has nearly 2K users. This tool offers a convenient way of accessing StackOverflow directly from a terminal.
- [Motrix WebExtension](https://github.com/gautamkrishnar/motrix-webextension) - A browser extension for the Motrix Download Manager. It now has more than 20K+ users worldwide.
- [Refined GitHub Feeds](https://github.com/gautamkrishnar/refined-github-feeds) - A browser extension that adds filtering to the Github news feeds. 

[⏩ &nbsp; and many more](https://github.com/gautamkrishnar?tab=repositories&q=&type=source&language=&sort=stargazers) 

During my free time, I actively contribute to open-source projects on GitHub. Due to my significant contributions to DuckDuckGo, I was appointed as a maintainer and community leader with write access to all of DuckDuckGo's repositories. I have also made contributions to a variety of other open-source projects and organizations, including Mozilla, Angular, Svelte, Node.JS etc
  
I also maintain and contribute to a lot of community open-source projects and libraries. Some of the communities includes [Tinkerhub Foundation](https://tinkerhub.org/), [Kites Foundation](https://kitesfoundation.org/), [Mozilla Foundation](https://foundation.mozilla.org/en/), [Patternfly](https://www.patternfly.org/) etc. I strongly believe that the true value of open-source is not just the code, it's the community around it.

You can read more about me and my open source journey at my website: [https://www.gautamkrishnar.com/](https://www.gautamkrishnar.com/)

I create most of my open-source projects to solve the challenges I encounter in life, with many more still waiting to be addressed. I am embarking on a quest to find solutions for each one, one problem at a time.

<details>
  <summary><b>🛠️&nbsp;&nbsp;Languages&nbsp;and&nbsp;Tools</b></summary>
  <br/>
  <p align="left"> <a href="https://angular.io" target="_blank"> <img src="https://angular.io/assets/images/logos/angular/angular.svg" alt="angular" width="40" height="40"/> </a> <a href="https://cordova.apache.org/" target="_blank"> <img src="https://www.vectorlogo.zone/logos/apache_cordova/apache_cordova-icon.svg" alt="apachecordova" width="40" height="40"/> </a> <a href="https://aws.amazon.com" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="aws" width="40" height="40"/> </a> <a href="https://azure.microsoft.com/en-in/" target="_blank"> <img src="https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-icon.svg" alt="azure" width="40" height="40"/> </a> <a href="https://www.gnu.org/software/bash/" target="_blank"> <img src="https://www.vectorlogo.zone/logos/gnu_bash/gnu_bash-icon.svg" alt="bash" width="40" height="40"/> </a> <a href="https://getbootstrap.com" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/bootstrap/bootstrap-plain-wordmark.svg" alt="bootstrap" width="40" height="40"/> </a> <a href="https://www.cprogramming.com/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/c/c-original.svg" alt="c" width="40" height="40"/> </a> <a href="https://circleci.com" target="_blank"> <img src="https://www.vectorlogo.zone/logos/circleci/circleci-icon.svg" alt="circleci" width="40" height="40"/> </a> <a href="https://www.w3schools.com/cpp/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg" alt="cplusplus" width="40" height="40"/> </a> <a href="https://www.w3schools.com/css/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/> </a> <a href="https://www.cypress.io" target="_blank"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/6e46ec1fc23b60c8fd0d2f2ff46db82e16dbd75f/icons/cypress.svg" alt="cypress" width="40" height="40"/> </a> <a href="https://www.docker.com/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="40" height="40"/> </a> <a href="https://www.elastic.co" target="_blank"> <img src="https://www.vectorlogo.zone/logos/elastic/elastic-icon.svg" alt="elasticsearch" width="40" height="40"/> </a> <a href="https://expressjs.com" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> </a> <a href="https://flask.palletsprojects.com/" target="_blank"> <img src="https://www.vectorlogo.zone/logos/pocoo_flask/pocoo_flask-icon.svg" alt="flask" width="40" height="40"/> </a> <a href="https://cloud.google.com" target="_blank"> <img src="https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg" alt="gcp" width="40" height="40"/> </a> <a href="https://git-scm.com/" target="_blank"> <img src="https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg" alt="git" width="40" height="40"/> </a> <a href="https://grafana.com" target="_blank"> <img src="https://www.vectorlogo.zone/logos/grafana/grafana-icon.svg" alt="grafana" width="40" height="40"/> </a> <a href="https://graphql.org" target="_blank"> <img src="https://www.vectorlogo.zone/logos/graphql/graphql-icon.svg" alt="graphql" width="40" height="40"/> </a> <a href="https://heroku.com" target="_blank"> <img src="https://www.vectorlogo.zone/logos/heroku/heroku-icon.svg" alt="heroku" width="40" height="40"/> </a> <a href="https://www.w3.org/html/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/> </a> <a href="https://gohugo.io/" target="_blank"> <img src="https://api.iconify.design/logos-hugo.svg" alt="hugo" width="40" height="40"/> </a> <a href="https://jasmine.github.io/" target="_blank"> <img src="https://www.vectorlogo.zone/logos/jasmine/jasmine-icon.svg" alt="jasmine" width="40" height="40"/> </a> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a> <a href="https://jekyllrb.com/" target="_blank"> <img src="https://www.vectorlogo.zone/logos/jekyllrb/jekyllrb-icon.svg" alt="jekyll" width="40" height="40"/> </a> <a href="https://www.jenkins.io" target="_blank"> <img src="https://www.vectorlogo.zone/logos/jenkins/jenkins-icon.svg" alt="jenkins" width="40" height="40"/> </a> <a href="https://jestjs.io" target="_blank"> <img src="https://www.vectorlogo.zone/logos/jestjsio/jestjsio-icon.svg" alt="jest" width="40" height="40"/> </a> <a href="https://karma-runner.github.io/latest/index.html" target="_blank"> <img src="https://raw.githubusercontent.com/detain/svg-logos/780f25886640cef088af994181646db2f6b1a3f8/svg/karma.svg" alt="karma" width="40" height="40"/> </a> <a href="https://www.elastic.co/kibana" target="_blank"> <img src="https://www.vectorlogo.zone/logos/elasticco_kibana/elasticco_kibana-icon.svg" alt="kibana" width="40" height="40"/> </a> <a href="https://kubernetes.io" target="_blank"> <img src="https://www.vectorlogo.zone/logos/kubernetes/kubernetes-icon.svg" alt="kubernetes" width="40" height="40"/> </a> <a href="https://www.linux.org/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg" alt="linux" width="40" height="40"/> </a> <a href="https://mochajs.org" target="_blank"> <img src="https://www.vectorlogo.zone/logos/mochajs/mochajs-icon.svg" alt="mocha" width="40" height="40"/> </a> <a href="https://www.mongodb.com/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="mongodb" width="40" height="40"/> </a> <a href="https://www.microsoft.com/en-us/sql-server" target="_blank"> <img src="https://www.svgrepo.com/show/303229/microsoft-sql-server-logo.svg" alt="mssql" width="40" height="40"/> </a> <a href="https://www.mysql.com/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" alt="mysql" width="40" height="40"/> </a> <a href="https://www.nginx.com" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nginx/nginx-original.svg" alt="nginx" width="40" height="40"/> </a> <a href="https://nodejs.org" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a> <a href="https://www.php.net" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/php/php-original.svg" alt="php" width="40" height="40"/> </a> <a href="https://www.postgresql.org" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40"/> </a> <a href="https://postman.com" target="_blank"> <img src="https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" alt="postman" width="40" height="40"/> </a> <a href="https://github.com/puppeteer/puppeteer" target="_blank"> <img src="https://www.vectorlogo.zone/logos/pptrdev/pptrdev-official.svg" alt="puppeteer" width="40" height="40"/> </a> <a href="https://www.python.org" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" alt="python" width="40" height="40"/> </a> <a href="https://reactjs.org/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a> <a href="https://redis.io" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original-wordmark.svg" alt="redis" width="40" height="40"/> </a> <a href="https://sass-lang.com" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/sass/sass-original.svg" alt="sass" width="40" height="40"/> </a> <a href="https://www.selenium.dev" target="_blank"> <img src="https://raw.githubusercontent.com/detain/svg-logos/780f25886640cef088af994181646db2f6b1a3f8/svg/selenium-logo.svg" alt="selenium" width="40" height="40"/> </a> <a href="https://www.sqlite.org/" target="_blank"> <img src="https://www.vectorlogo.zone/logos/sqlite/sqlite-icon.svg" alt="sqlite" width="40" height="40"/> </a> <a href="https://travis-ci.org" target="_blank"> <img src="https://www.vectorlogo.zone/logos/travis-ci/travis-ci-icon.svg" alt="travisci" width="40" height="40"/> </a> <a href="https://www.typescriptlang.org/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/> </a> </p>
</details>

<details>
  <summary><b>📈&nbsp;&nbsp;Language&nbsp;/&nbsp;Framework stats</b></summary>
  <br/>
  <a href='https://profile.codersrank.io/user/gautamkrishnar/'>
  <img src='http://cr-skills-chart-widget.azurewebsites.net/api/api?username=gautamkrishnar&padding=30&skills=angular,batchfile,c,C%23,coffeescript,dart,go,html,json,java,javascript,less,mysql,php,pandas,perl,python,reactjs,scss,shell,svelte,swift,typescript,vue'>
  </a>
</details>

<details>
  <summary><b>🔒&nbsp;&nbsp;PGP&nbsp;Public&nbsp;Key</b></summary>
  <br/>

<img alt='analytics' src='https://profile-counter.glitch.me/gautamkrishnar/count.svg' width='0px'>
  `

  // get github user info from api/github/[username]
  async function getUserStats(username: string): Promise<string> {
      const response = await fetch(`/api/github/${username}`);
      const data = await response.json();
      return data;
  }

  const generateBio = async (e: any) => {
    const userStats = await getUserStats(userName);
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
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
