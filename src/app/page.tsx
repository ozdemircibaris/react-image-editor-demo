"use client";

import { ImageEditor } from "@ozdemircibaris/react-image-editor";
import { useState, useRef, useEffect } from "react";
import { Upload, X, Download, Sparkles } from "lucide-react";
import Image from "next/image";

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src="/icon.png" alt="React Image Editor" width={24} height={24} />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  React Image Editor
                </h1>
                <p className="text-gray-400 text-sm">Professional image editing made simple</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-300">
                Demo v{packageVersion || "1.0.8"}
                {isDevelopment && packageVersion === "dev" && " (dev)"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
            Edit Images Like a Pro
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Powerful, intuitive, and beautiful image editing component for React applications. Built with modern web
            technologies and designed for the best user experience.
          </p>
        </div>

        {/* Upload Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Image</h3>
              <p className="text-gray-400 mb-6">Select an image from your device to start editing</p>
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105">
                  <Upload className="w-5 h-5 mr-2" />
                  Select Image
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Editor Section */}
        {imageUrl && (
          <div ref={editorRef} className="w-full mx-auto">
            <ImageEditor imageUrl={imageUrl} onSave={handleSave} onCancel={handleCancel} />
          </div>
        )}

        {/* Floating Preview Panel */}
        {showPreview && savedImageUrl && (
          <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-4 max-w-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-200">Preview</h4>
                <button onClick={closePreview} className="p-1 hover:bg-gray-700 rounded-full transition-colors">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="relative">
                <img src={savedImageUrl} alt="Edited preview" className="w-full h-32 object-cover rounded-lg" />
                <button
                  onClick={handleDownload}
                  className="absolute bottom-2 right-2 p-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">
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
            <p className="text-gray-500 text-sm mt-2">React Image Editor - Professional image editing component</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
