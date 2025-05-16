import express, { Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Store generated models (in memory for now)
const models = new Map<string, any>();

// Generate a simple 1"x1"x1" box
function generateBox() {
  return {
    id: uuidv4(),
    type: 'box',
    dimensions: {
      width: 1,
      height: 1,
      depth: 1,
      unit: 'inch'
    },
    vertices: [
      // Front face
      [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5],
      // Back face
      [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, -0.5]
    ],
    faces: [
      // Front face
      [0, 1, 2, 3],
      // Back face
      [4, 5, 6, 7],
      // Top face
      [3, 2, 6, 7],
      // Bottom face
      [0, 1, 5, 4],
      // Right face
      [1, 2, 6, 5],
      // Left face
      [0, 3, 7, 4]
    ]
  };
}

// Generate STL content for the box
function generateSTL(model: any): string {
  const vertices = model.vertices;
  const faces = model.faces;
  let stl = 'solid box\n';

  faces.forEach((face: number[]) => {
    const v1 = vertices[face[0]];
    const v2 = vertices[face[1]];
    const v3 = vertices[face[2]];
    
    // Calculate normal (assuming counter-clockwise winding)
    const normal = calculateNormal(v1, v2, v3);
    
    stl += `  facet normal ${normal[0]} ${normal[1]} ${normal[2]}\n`;
    stl += '    outer loop\n';
    stl += `      vertex ${v1[0]} ${v1[1]} ${v1[2]}\n`;
    stl += `      vertex ${v2[0]} ${v2[1]} ${v2[2]}\n`;
    stl += `      vertex ${v3[0]} ${v3[1]} ${v3[2]}\n`;
    stl += '    endloop\n';
    stl += '  endfacet\n';
  });

  stl += 'endsolid box\n';
  return stl;
}

// Calculate normal vector for a triangle
function calculateNormal(v1: number[], v2: number[], v3: number[]): number[] {
  const u = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
  const v = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];
  
  return [
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0]
  ];
}

interface GenerateRequest {
  prompt: string;
}

interface DownloadParams {
  id: string;
}

// Route handlers
const generateHandler: RequestHandler = (req, res) => {
  const { prompt } = req.body as GenerateRequest;
  
  // For now, we ignore the prompt and always return a box
  const model = generateBox();
  models.set(model.id, model);
  
  res.json({
    model: {
      id: model.id,
      type: model.type,
      dimensions: model.dimensions
    },
    metadata: {
      format: 'STL',
      size: 0, // We'll calculate this when downloading
      createdAt: new Date().toISOString()
    }
  });
};

const downloadHandler: RequestHandler<DownloadParams> = (req, res) => {
  const model = models.get(req.params.id);
  
  if (!model) {
    res.status(404).json({ error: 'Model not found' });
    return;
  }
  
  const stl = generateSTL(model);
  const buffer = Buffer.from(stl);
  
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename=model-${model.id}.stl`);
  res.setHeader('Content-Length', buffer.length);
  
  res.send(buffer);
};

// Routes
app.post('/generate', generateHandler);
app.get('/download/:id', downloadHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 