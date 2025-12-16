export type ShapeType = 
  | 'Cube' | 'Sphere' | 'Cone' | 'Torus' | 'Icosahedron' 
  | 'Cylinder' | 'Pyramid' | 'Prism' 
  | 'Square' | 'Circle' | 'Triangle';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface MathConcept {
  name: ShapeType;
  color: string;
  description: string;
  position: [number, number, number];
}

export const SHAPES: MathConcept[] = [
  // Baris Belakang (Atas) - 3D Lengkung & Lancip
  { name: 'Cylinder', color: '#8b5cf6', description: 'Tabung (Silinder)', position: [-5, 2.5, -2] },
  { name: 'Sphere', color: '#3b82f6', description: 'Bola', position: [-1.7, 2.5, -2] },
  { name: 'Cone', color: '#eab308', description: 'Kerucut', position: [1.7, 2.5, -2] },
  { name: 'Pyramid', color: '#f97316', description: 'Limas Segiempat', position: [5, 2.5, -2] },

  // Baris Tengah - 3D Sisi Datar & Kompleks
  { name: 'Cube', color: '#ef4444', description: 'Kubus', position: [-5, 0, 0] },
  { name: 'Prism', color: '#06b6d4', description: 'Prisma Segitiga', position: [-1.7, 0, 0] },
  { name: 'Torus', color: '#10b981', description: 'Donat (Torus)', position: [1.7, 0, 0] },
  { name: 'Icosahedron', color: '#a855f7', description: 'Ikosahedron', position: [5, 0, 0] },

  // Baris Depan (Bawah) - 2D (Bangun Datar)
  { name: 'Square', color: '#ec4899', description: 'Persegi (2D)', position: [-3.5, -2.5, 2] },
  { name: 'Circle', color: '#14b8a6', description: 'Lingkaran (2D)', position: [0, -2.5, 2] },
  { name: 'Triangle', color: '#f43f5e', description: 'Segitiga (2D)', position: [3.5, -2.5, 2] },
];