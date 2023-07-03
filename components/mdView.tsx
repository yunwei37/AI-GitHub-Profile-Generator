import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Toaster, toast } from "react-hot-toast";
import LoadingDots from './LoadingDots';  // assuming you have a component named LoadingDots
import 'github-markdown-css';

interface MyComponentProps {
    loading: boolean;
    handleGenerateBio: any;
    generatedBios: any;
    buttonText: string;
    title: string;
}

const MDview = ({ loading, handleGenerateBio, generatedBios, buttonText: text, title }: MyComponentProps) => {
  const bioRef = useRef(null);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedBios);
    toast("Bio copied to clipboard", {
      icon: "✂️",
    });
  };

  return (
    <div className="space-y-2 flex flex-col items-center max-w-xl mx-auto">
      {!loading && (
        <button
          className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-3 mt-2 hover:bg-black/80 w-full"
          onClick={handleGenerateBio}
        >
          {text}
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
      {generatedBios && (
        <>
          <div>
            <h2
              className="sm:text-3xl text-2xl font-bold text-slate-900 mx-auto"
              ref={bioRef}
            >
                {title}
            </h2>
          </div>
        </>
      )}
      {generatedBios && (
        <div
          className="bg-white rounded-xl shadow-mdhover:bg-gray-100 transition cursor-copy border"
          onClick={handleCopyToClipboard}
          key={generatedBios}
        >
          <div className="markdown-body p-4">
            <ReactMarkdown children={generatedBios} />
          </div>
        </div>
      )}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
    </div>
  );
};

export default MDview;
