import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';

const ExampleBioComponent = () => {

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
    
    ## ✨ Let's Connect
    
    I would love to connect with fellow developers, entrepreneurs, and technology enthusiasts. Here are a few ways to get in touch with me:
    
    - Website: [yunwei123.tech](https://www.yunwei123.tech/)
    - Twitter: [@yunwei37](https://twitter.com/yunwei37)
    - GitHub: [yunwei37](https://github.com/yunwei37)
    
    Let's collaborate, share ideas, and make meaningful contributions to the world of technology!
    
    ---
    
    Thank you for taking the time to visit my GitHub profile and read this README. Feel free to explore my projects, and don't hesitate to reach out if you have any questions or opportunities for collaboration. Together, we can make a positive impact in the world of software development!
    `];


    const [exampleBio, setExampleBio] = useState("");

    return (
        <div className="space-y-8 flex flex-col items-center max-w-xl mx-auto">
            <div className="flex flex-row">
                <p
                    onClick={() => setExampleBio((prev) => prev ? "" : exampleBios[0])}
                >
                    Click to show generated example
                </p>
            </div>

            {exampleBio && <div className="bg-white rounded-xl shadow-mdhover:bg-gray-100 transition cursor-copy border">
                <div className="markdown-body p-4">
                    <ReactMarkdown children={exampleBio} />
                </div>
            </div>}
        </div>
    );
}

export default ExampleBioComponent;
