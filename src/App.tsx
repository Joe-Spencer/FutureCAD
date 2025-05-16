import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ModelViewer } from './components/ModelViewer'
import { cadService } from './services/cadService'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [model, setModel] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await cadService.generateModel(prompt)
      setModel(response.model)
    } catch (err) {
      setError('Failed to generate CAD model. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!model?.id) return
    
    try {
      const blob = await cadService.downloadModel(model.id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cad-model-${model.id}.stl`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError('Failed to download model. Please try again.')
      console.error(err)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <nav className="flex-none bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                FutureCAD
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col lg:flex-row">
          {/* Input Section */}
          <div className="flex-none w-full lg:w-1/3 p-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">
                    Describe your CAD model
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="prompt"
                      name="prompt"
                      rows={4}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700/50 text-white placeholder-gray-400"
                      placeholder="Example: Create a spur gear with 13 teeth and 2mm module"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? 'Generating...' : 'Generate CAD Model'}
                </button>
              </form>
              {error && (
                <div className="mt-4 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-md p-3">
                  {error}
                </div>
              )}
              {model && (
                <button
                  onClick={handleDownload}
                  className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                >
                  Download Model
                </button>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="flex-1 w-full lg:w-2/3 p-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 shadow-xl h-full">
              <Canvas className="w-full h-full">
                <color attach="background" args={['#1a1a1a']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <spotLight
                  position={[-10, -10, -10]}
                  angle={0.3}
                  penumbra={1}
                  intensity={0.5}
                  castShadow
                />
                <OrbitControls
                  enableDamping
                  dampingFactor={0.05}
                  minDistance={3}
                  maxDistance={20}
                />
                <ModelViewer model={model} />
              </Canvas>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
