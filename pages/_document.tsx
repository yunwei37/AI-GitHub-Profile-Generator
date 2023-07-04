import React from 'react';
import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Generate your beautiful GitHub Profile README in seconds with GPT and AI."
          />
          <meta property="og:site_name" content="github-profile-gpt.vercel.app" />
          <meta
            property="og:description"
            content="Generate your beautiful GitHub Profile README in seconds with GPT and AI."
          />
          <meta property="og:title" content="Github Profile AI Generator" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="GPT and AI Github Profile README Generator" />
          <meta
            name="twitter:description"
            content="Generate your beautiful GitHub Profile README in seconds."
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
