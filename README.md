# Gif Wrap

A premium, client-side Animated GIF Builder tool. Built with an ultra-minimalist dark theme to provide a clean and focused workspace for producing highly customizable GIFs entirely in your browser.

## Features ✨

- **Pure Client-Side Operation**: All rendering and processing occur seamlessly in the browser using the gifshot library and HTML5 Canvas. Your files are never uploaded to a server, ensuring absolute privacy.
- **Dynamic Image Sizing**: No default, fixed resolutions! Gif Wrap intelligently sets the final canvas based on the exact width and height of the first uploaded frame in your sequence.
- **Batch Uploading & Drag-and-Drop**: Easily drop multiple frames (PNG, JPEG, SVG) onto the timeline to quickly populate the queue.
- **Draggable Frame Ordering**: Utilize the drag-and-drop timeline to visually reorder frames precisely where you want them in the loop.
- **Granular Control over Frame Delays**: Provide unique timing for every single frame within the timeline setting delay times down to milliseconds.
- **Real-time Live Canvas Matrix**: Inspect your progress before compiling! The included workspace player loops exactly based on your custom delay parameters for an authentic preview.
- **High-Quality Export**: Process frame variables instantly with loading progress trackers, outputting your work immediately as a direct raw downloadable file.

## Technologies Used 🛠️

- **React 19 & TypeScript**: Solid, scalable frontend architecture.
- **Vite**: Rapid development environment and builder.
- **Tailwind CSS v4**: Ultra-minimalist dark mode aesthetics featuring slate and charcoal gradients.
- **Lucide React**: Crisp iconography aligning meticulously with the interface.
- **gifshot**: The engine creating smooth animated compilation.

## Getting Started 🚀

### Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser
