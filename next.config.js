/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/yunwei37/AI-GitHub-Profile-Generator",
        permanent: false,
      },
      {
        source: "/deploy",
        destination: "https://github.com/yunwei37/AI-GitHub-Profile-Generator",
        permanent: false,
      },
    ];
  },
};
