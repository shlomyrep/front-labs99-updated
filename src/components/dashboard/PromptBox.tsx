import { useState } from 'react';

const tags = [
    "CRM", "Dev productivity", "Educational", "Content Generation and Editing",
    "Personal Finance", "Health and Wellness", "Productivity", "Travel Planning",
    "Entertainment", "Environmental", "Home Management", "Creative Tools"
];

export default function PromptBox() {
    const [prompt, setPrompt] = useState('');

    return (
        <div className="bg-white p-6 rounded-md shadow-md max-w-3xl mx-auto mb-10">
            <h2 className="text-xl font-semibold mb-4">What would you build today?</h2>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the app you want to create..."
                className="w-full border border-gray-300 rounded-md p-3 mb-4 resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-4 mb-4">
                <button className="border rounded px-4 py-1 text-sm text-gray-600 hover:bg-gray-100">
                    📁 Upload
                </button>
                <button className="border rounded px-4 py-1 text-sm text-gray-600 hover:bg-gray-100">
                    🎨 Styling Instructions
                </button>
            </div>
            <p className="text-sm text-gray-500 mb-2">Some ideas to get started:</p>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1 rounded-full cursor-pointer"
                    >
            {tag}
          </span>
                ))}
            </div>
        </div>
    );
}
