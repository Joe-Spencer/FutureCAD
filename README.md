# FutureCAD

A modern web application that generates CAD models from text descriptions using AI. Built with React, Three.js, and Express.

## Features

- 🤖 Advanced AI-powered text-to-CAD conversion with high accuracy
- 📐 Precise parametric modeling with support for complex geometries
- 🔧 Support for common CAD operations (extrusion, revolution, boolean operations)
- 📏 Automatic dimensioning and constraint solving
- 🎯 Industry-standard STL output for seamless integration with CAD/CAM workflows
- 🔄 Real-time preview with accurate measurements and scale

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Three.js (via @react-three/fiber)
- Vite

### Backend
- Node.js
- Express
- TypeScript

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/FutureCAD.git
cd FutureCAD
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

3. Start the development servers:

In one terminal:
```bash
# Start the frontend development server
npm run dev
```

In another terminal:
```bash
# Start the backend server
cd server
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
FutureCAD/
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── services/         # API services
│   └── App.tsx           # Main application component
├── server/               # Backend source code
│   ├── src/             # Server source code
│   └── package.json     # Server dependencies
└── package.json         # Frontend dependencies
```

## Usage

1. Enter a description of the CAD model you want to generate in the text area
2. Click "Generate CAD Model" to create the model
3. Use the mouse to interact with the 3D preview:
   - Left click + drag to rotate
   - Right click + drag to pan
   - Scroll to zoom
4. Click "Download Model" to save the STL file

## Development

### Frontend Development

The frontend is built with React and uses Vite for fast development. Key features include:

- Hot Module Replacement (HMR)
- TypeScript support
- Tailwind CSS for styling
- Three.js for 3D rendering

### Backend Development

The backend is a simple Express server that handles:

- CAD model generation requests
- STL file downloads
- Error handling and validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) for the Three.js React bindings
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the build tool
