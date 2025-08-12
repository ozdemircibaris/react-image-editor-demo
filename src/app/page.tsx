"use client";

import { ImageEditor } from "@ozdemircibaris/react-image-editor";
import { useState, useRef, useEffect } from "react";
import { Upload, X, Download, Sparkles } from "lucide-react";
import Image from "next/image";

// Google Analytics types
declare global {
  interface Window {
    gtag: (
      command: "event",
      eventName: string,
      parameters: {
        event_category: string;
        event_label: string;
        value: number;
      },
    ) => void;
  }
}

export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [savedImageUrl, setSavedImageUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [packageVersion, setPackageVersion] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPackageVersion = async () => {
      try {
        const response = await fetch("https://registry.npmjs.org/@ozdemircibaris/react-image-editor/latest");
        if (response.ok) {
          const data = await response.json();
          setPackageVersion(data.version);
        }
      } catch (error) {
        console.error("Failed to fetch package version:", error);
      }
    };

    fetchPackageVersion();
  }, []);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setSavedImageUrl("");
      setShowPreview(false);

      // Smooth scroll to editor section after a short delay
      setTimeout(() => {
        editorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  const handleSave = (imageBlob: Blob) => {
    const url = URL.createObjectURL(imageBlob);
    setSavedImageUrl(url);
    setShowPreview(true);
    console.log("Saved image URL:", url);

    // Google Analytics event tracking
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "image_saved", {
        event_category: "image_editor",
        event_label: "save_button",
        value: 1,
      });
      console.log("Google Analytics event sent: image_saved");
    }
  };

  const handleCancel = () => {
    console.log("Editing cancelled");
  };

  const handleDownload = () => {
    if (savedImageUrl) {
      const link = document.createElement("a");
      link.href = savedImageUrl;
      link.download = "edited-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Google Analytics event tracking for download
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "image_downloaded", {
          event_category: "image_editor",
          event_label: "download_button",
          value: 1,
        });
        console.log("Google Analytics event sent: image_downloaded");
      }
    }
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  // Check if we're in development
  const isDevelopment = typeof window !== "undefined" && window.location.hostname === "localhost";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <Image src="/icon.png" alt="React Image Editor" width={24} height={24} />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  React Image Editor
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm">Professional image editing made simple</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-xs sm:text-sm text-gray-300">
                Demo v{packageVersion || "1.0.8"}
                {isDevelopment && packageVersion === "dev" && " (dev)"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12 flex-1">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
            Edit Images Like a Pro
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto px-2">
            Powerful, intuitive, and beautiful image editing component for React applications. Built with modern web
            technologies and designed for the best user experience.
          </p>
        </div>

        {/* Upload Section */}
        <div className="max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Choose Your Image</h3>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                Select an image from your device to start editing
              </p>
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Select Image
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Editor Section */}
        {imageUrl && (
          <div ref={editorRef} className="w-full mx-auto px-2 sm:px-4 lg:px-0">
            <div className="max-w-full overflow-hidden">
              <ImageEditor
                imageUrl={imageUrl}
                onSave={handleSave}
                onCancel={handleCancel}
                className="w-full max-w-full overflow-hidden"
                headerClassName="w-full max-w-full"
                toolbarClassName="w-full max-w-full flex-wrap justify-center"
                canvasClassName="w-full max-w-full"
                canvasWrapperClassName="w-full max-w-full overflow-hidden"
                buttonClassName="min-w-[2.5rem] min-h-[2.5rem]"
                saveButtonClassName="min-w-[2.5rem] min-h-[2.5rem]"
                cancelButtonClassName="min-w-[2.5rem] min-h-[2.5rem]"
                zoomButtonClassName="min-w-[2.5rem] min-h-[2.5rem]"
              />
            </div>
          </div>
        )}

        {/* Floating Preview Panel */}
        {showPreview && savedImageUrl && (
          <div className="fixed bottom-4 sm:bottom-6 left-2 sm:left-6 right-2 sm:right-auto z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-3 sm:p-4 max-w-sm mx-auto sm:mx-0">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-200 text-sm sm:text-base">Preview</h4>
                <button onClick={closePreview} className="p-1 hover:bg-gray-700 rounded-full transition-colors">
                  <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </button>
              </div>
              <div className="relative">
                <img src={savedImageUrl} alt="Edited preview" className="w-full h-24 sm:h-32 object-cover rounded-lg" />
                <button
                  onClick={handleDownload}
                  className="absolute bottom-2 right-2 p-1.5 sm:p-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              Built with ❤️ by{" "}
              <a
                href="https://github.com/ozdemircibaris"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                @ozdemircibaris
              </a>
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2">
              React Image Editor - Professional image editing component
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
