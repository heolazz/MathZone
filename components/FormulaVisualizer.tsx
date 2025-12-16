import React, { useState } from 'react';
import { ShapeType } from '../types';

interface FormulaVisualizerProps {
  shape: ShapeType;
  concept: 'volume' | 'area' | 'properties';
}

const FormulaVisualizer: React.FC<FormulaVisualizerProps> = ({ shape, concept }) => {
  const strokeColor = "#a5b4fc"; // indigo-300
  const textColor = "#e2e8f0"; // slate-200
  const dimColor = "#64748b"; // slate-500
  const highlightColor = "#facc15"; // yellow-400 (for vertices/highlights)

  // State untuk variabel input (default values)
  const [values, setValues] = useState({
    s: 5, // sisi
    r: 5, // jari-jari
    t: 10, // tinggi
    R: 8, // jari-jari besar (torus)
    a: 6, // alas
  });

  // Calculate scaling for visual effect based on primary dimension
  const getScale = () => {
    const base = values.s || values.r || values.a || 5;
    return 0.8 + (base / 20) * 0.4;
  };

  const updateValue = (key: string, val: number) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  // Define properties data for 'properties' mode
  const getPropertiesData = () => {
      switch (shape) {
          case 'Cube': return { faces: 6, edges: 12, vertices: 8, base: 'Persegi' };
          case 'Sphere': return { faces: 1, edges: 0, vertices: 0, base: '-' };
          case 'Cone': return { faces: 2, edges: 1, vertices: 1, base: 'Lingkaran' };
          case 'Cylinder': return { faces: 3, edges: 2, vertices: 0, base: 'Lingkaran' };
          case 'Pyramid': return { faces: 5, edges: 8, vertices: 5, base: 'Persegi' };
          case 'Prism': return { faces: 5, edges: 9, vertices: 6, base: 'Segitiga' };
          case 'Torus': return { faces: 1, edges: 0, vertices: 0, base: '-' };
          case 'Icosahedron': return { faces: 20, edges: 30, vertices: 12, base: 'Segitiga' };
          case 'Square': return { faces: 1, edges: 4, vertices: 4, base: '-' };
          case 'Triangle': return { faces: 1, edges: 3, vertices: 3, base: '-' };
          case 'Circle': return { faces: 1, edges: 0, vertices: 0, base: '-' };
          default: return { faces: 0, edges: 0, vertices: 0, base: '-' };
      }
  };

  const getFormulaDetails = () => {
    const { s, r, t, R, a } = values;
    const PI = Math.PI;

    switch (shape) {
      case 'Cube':
        return {
          inputs: [{ label: 'Sisi (s)', key: 's', min: 1, max: 10 }],
          result: concept === 'volume' ? Math.pow(s, 3) : 6 * Math.pow(s, 2),
          formulaDisplay: concept === 'volume' ? `V = ${s}³` : `LP = 6 × ${s}²`
        };
      case 'Sphere':
        return {
          inputs: [{ label: 'Jari-jari (r)', key: 'r', min: 1, max: 10 }],
          result: concept === 'volume' ? (4/3) * PI * Math.pow(r, 3) : 4 * PI * Math.pow(r, 2),
          formulaDisplay: concept === 'volume' ? `V = 4/3 × π × ${r}³` : `LP = 4 × π × ${r}²`
        };
      case 'Cone':
        return {
          inputs: [
            { label: 'Jari-jari (r)', key: 'r', min: 1, max: 10 },
            { label: 'Tinggi (t)', key: 't', min: 1, max: 15 }
          ],
          result: concept === 'volume' 
            ? (1/3) * PI * r * r * t 
            : PI * r * (r + Math.sqrt(r*r + t*t)),
          formulaDisplay: concept === 'volume' 
            ? `V = 1/3 × π × ${r}² × ${t}` 
            : `LP ≈ π × ${r}(${r} + s)`
        };
      case 'Cylinder':
        return {
          inputs: [
            { label: 'Jari-jari (r)', key: 'r', min: 1, max: 10 },
            { label: 'Tinggi (t)', key: 't', min: 1, max: 15 }
          ],
          result: concept === 'volume' 
            ? PI * r * r * t 
            : 2 * PI * r * (r + t),
          formulaDisplay: concept === 'volume' 
            ? `V = π × ${r}² × ${t}` 
            : `LP = 2π × ${r}(${r} + ${t})`
        };
      case 'Pyramid':
         return {
          inputs: [
             { label: 'Sisi Alas (s)', key: 's', min: 1, max: 10 },
             { label: 'Tinggi (t)', key: 't', min: 1, max: 15 }
           ],
           result: concept === 'volume'
             ? (1/3) * s * s * t
             : (s * s) + (4 * (0.5 * s * Math.sqrt((s/2)*(s/2) + t*t))), 
           formulaDisplay: concept === 'volume'
             ? `V = 1/3 × ${s}² × ${t}`
             : `LP = Luas Alas + 4×Segitiga`
         };
       case 'Prism':
          return {
            inputs: [
              { label: 'Alas (a)', key: 'a', min: 1, max: 10 },
              { label: 'Tinggi (t)', key: 't', min: 1, max: 15 }
            ],
            result: concept === 'volume'
              ? ((0.25 * Math.sqrt(3) * a * a) * t)
              : (2 * (0.25 * Math.sqrt(3) * a * a)) + (3 * a * t),
            formulaDisplay: concept === 'volume'
              ? `V = L.Alas × ${t}`
              : `LP = 2×L.Alas + K.Alas×${t}`
          };
      case 'Torus':
         return {
           inputs: [
             { label: 'R Besar', key: 'R', min: 5, max: 12 },
             { label: 'r kecil', key: 'r', min: 1, max: 4 }
           ],
           result: concept === 'volume'
             ? 2 * PI * PI * R * r * r
             : 4 * PI * PI * R * r,
           formulaDisplay: concept === 'volume'
             ? `V = 2π² × ${R} × ${r}²`
             : `LP = 4π² × ${R} × ${r}`
         };
      case 'Icosahedron':
         return {
           inputs: [{ label: 'Sisi (s)', key: 's', min: 1, max: 10 }],
           result: concept === 'volume'
             ? 2.1817 * Math.pow(s, 3)
             : 5 * Math.sqrt(3) * Math.pow(s, 2),
           formulaDisplay: concept === 'volume'
             ? `V ≈ 2.18 × ${s}³`
             : `LP = 5√3 × ${s}²`
         };
      case 'Square':
         return {
           inputs: [{ label: 'Sisi (s)', key: 's', min: 1, max: 10 }],
           result: concept === 'area' ? s * s : 4 * s,
           formulaDisplay: concept === 'area' ? `L = ${s} × ${s}` : `K = 4 × ${s}`
         };
      case 'Circle':
         return {
           inputs: [{ label: 'Jari-jari (r)', key: 'r', min: 1, max: 10 }],
           result: concept === 'area' ? PI * r * r : 2 * PI * r,
           formulaDisplay: concept === 'area' ? `L = π × ${r}²` : `K = 2 × π × ${r}`
         };
      case 'Triangle':
         return {
           inputs: [
             { label: 'Alas (a)', key: 'a', min: 1, max: 10 },
             { label: 'Tinggi (t)', key: 't', min: 1, max: 10 }
           ],
           result: concept === 'area' ? 0.5 * a * t : 3 * a,
           formulaDisplay: concept === 'area' ? `L = 1/2 × ${a} × ${t}` : `K ≈ 3 × ${a}`
         };
      default:
        return { inputs: [], result: 0, formulaDisplay: '' };
    }
  };

  const details = getFormulaDetails();
  const properties = getPropertiesData();
  const isPropertiesMode = concept === 'properties';

  const renderSVG = () => {
    // If Properties mode, we add decorative dots to vertices
    const vertexRadius = isPropertiesMode ? 3 : 0;
    const vColor = highlightColor;

    switch (shape) {
      case 'Cube':
        return (
          <>
            <path d="M25,35 L65,35 L65,75 L25,75 Z" fill={isPropertiesMode ? "rgba(255,255,255,0.1)" : "none"} stroke={strokeColor} strokeWidth="1.5" />
            <path d="M25,35 L40,20 L80,20 L65,35" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <path d="M80,20 L80,60 L65,75" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <path d="M25,75 L25,35" stroke={strokeColor} strokeWidth="1.5" />
            {!isPropertiesMode && <text x="45" y="88" fill={textColor} fontSize="10" textAnchor="middle">s</text>}
            {isPropertiesMode && (
                <>
                    <circle cx="25" cy="35" r={vertexRadius} fill={vColor} />
                    <circle cx="65" cy="35" r={vertexRadius} fill={vColor} />
                    <circle cx="65" cy="75" r={vertexRadius} fill={vColor} />
                    <circle cx="25" cy="75" r={vertexRadius} fill={vColor} />
                    <circle cx="40" cy="20" r={vertexRadius} fill={vColor} />
                    <circle cx="80" cy="20" r={vertexRadius} fill={vColor} />
                    <circle cx="80" cy="60" r={vertexRadius} fill={vColor} />
                </>
            )}
          </>
        );
      case 'Sphere':
        return (
          <>
            <circle cx="50" cy="50" r="30" fill={isPropertiesMode ? "rgba(255,255,255,0.1)" : "none"} stroke={strokeColor} strokeWidth="1.5" />
            <ellipse cx="50" cy="50" rx="30" ry="10" fill="none" stroke={strokeColor} strokeWidth="1" strokeDasharray="3,2" />
            {!isPropertiesMode && (
                <>
                    <line x1="50" y1="50" x2="80" y2="50" stroke={textColor} strokeWidth="1" />
                    <text x="65" y="45" fill={textColor} fontSize="10" textAnchor="middle">r</text>
                </>
            )}
            {isPropertiesMode && <circle cx="50" cy="50" r={2} fill={vColor} />}
          </>
        );
      case 'Cone':
        return (
          <>
            <ellipse cx="50" cy="70" rx="25" ry="10" fill={isPropertiesMode ? "rgba(255,255,255,0.1)" : "none"} stroke={strokeColor} strokeWidth="1.5" />
            <line x1="25" y1="70" x2="50" y2="15" stroke={strokeColor} strokeWidth="1.5" />
            <line x1="75" y1="70" x2="50" y2="15" stroke={strokeColor} strokeWidth="1.5" />
            {!isPropertiesMode && (
                <>
                    <line x1="50" y1="15" x2="50" y2="70" stroke={dimColor} strokeWidth="1" strokeDasharray="2,2" />
                    <line x1="50" y1="70" x2="75" y2="70" stroke={textColor} strokeWidth="1" />
                    <text x="45" y="50" fill={textColor} fontSize="10" textAnchor="end">t</text>
                    <text x="62" y="78" fill={textColor} fontSize="10" textAnchor="middle">r</text>
                </>
            )}
            {isPropertiesMode && <circle cx="50" cy="15" r={vertexRadius} fill={vColor} />}
          </>
        );
      case 'Cylinder':
        return (
          <>
            <ellipse cx="50" cy="25" rx="25" ry="10" fill={isPropertiesMode ? "rgba(255,255,255,0.1)" : "none"} stroke={strokeColor} strokeWidth="1.5" />
            <ellipse cx="50" cy="75" rx="25" ry="10" fill={isPropertiesMode ? "rgba(255,255,255,0.1)" : "none"} stroke={strokeColor} strokeWidth="1.5" />
            <line x1="25" y1="25" x2="25" y2="75" stroke={strokeColor} strokeWidth="1.5" />
            <line x1="75" y1="25" x2="75" y2="75" stroke={strokeColor} strokeWidth="1.5" />
            {!isPropertiesMode && (
                <>
                    <line x1="50" y1="25" x2="50" y2="75" stroke={dimColor} strokeWidth="1" strokeDasharray="2,2" />
                    <text x="40" y="50" fill={textColor} fontSize="10" textAnchor="end">t</text>
                    <text x="63" y="85" fill={textColor} fontSize="10" textAnchor="middle">r</text>
                </>
            )}
          </>
        );
      case 'Pyramid':
        return (
            <>
               <path d="M20 70 L80 70 L65 55 L35 55 Z" fill={isPropertiesMode ? "rgba(255,255,255,0.1)" : "none"} stroke={strokeColor} strokeWidth="1.5" />
               <line x1="20" y1="70" x2="50" y2="20" stroke={strokeColor} strokeWidth="1.5" />
               <line x1="80" y1="70" x2="50" y2="20" stroke={strokeColor} strokeWidth="1.5" />
               <line x1="65" y1="55" x2="50" y2="20" stroke={dimColor} strokeWidth="1" />
               {!isPropertiesMode && (
                   <>
                        <line x1="50" y1="20" x2="50" y2="62" stroke={dimColor} strokeWidth="1" strokeDasharray="2,2" />
                        <text x="55" y="50" fill={textColor} fontSize="10">t</text>
                   </>
               )}
               {isPropertiesMode && (
                   <>
                       <circle cx="50" cy="20" r={vertexRadius} fill={vColor} />
                       <circle cx="20" cy="70" r={vertexRadius} fill={vColor} />
                       <circle cx="80" cy="70" r={vertexRadius} fill={vColor} />
                       <circle cx="65" cy="55" r={vertexRadius} fill={vColor} />
                       <circle cx="35" cy="55" r={vertexRadius} fill={vColor} />
                   </>
               )}
            </>
        );
      case 'Prism':
          return (
              <>
                 <path d="M25 75 L75 75 L50 60 Z" fill={isPropertiesMode ? "rgba(255,255,255,0.1)" : "none"} stroke={strokeColor} strokeWidth="1.5" />
                 <path d="M25 25 L75 25 L50 10 Z" fill={isPropertiesMode ? "rgba(255,255,255,0.1)" : "none"} stroke={strokeColor} strokeWidth="1.5" />
                 <line x1="25" y1="75" x2="25" y2="25" stroke={strokeColor} strokeWidth="1.5" />
                 <line x1="75" y1="75" x2="75" y2="25" stroke={strokeColor} strokeWidth="1.5" />
                 <line x1="50" y1="60" x2="50" y2="10" stroke={strokeColor} strokeWidth="1.5" />
                 {!isPropertiesMode && <text x="80" y="50" fill={textColor} fontSize="10">t</text>}
                 {isPropertiesMode && (
                     <>
                        <circle cx="25" cy="75" r={vertexRadius} fill={vColor} />
                        <circle cx="75" cy="75" r={vertexRadius} fill={vColor} />
                        <circle cx="50" cy="60" r={vertexRadius} fill={vColor} />
                        <circle cx="25" cy="25" r={vertexRadius} fill={vColor} />
                        <circle cx="75" cy="25" r={vertexRadius} fill={vColor} />
                        <circle cx="50" cy="10" r={vertexRadius} fill={vColor} />
                     </>
                 )}
              </>
          );
      case 'Torus':
          return (
             <>
                <ellipse cx="50" cy="50" rx="35" ry="15" fill={isPropertiesMode ? "rgba(255,255,255,0.1)" : "none"} stroke={strokeColor} strokeWidth="1.5" />
                <ellipse cx="50" cy="50" rx="15" ry="5" fill="none" stroke={strokeColor} strokeWidth="1.5" />
                {!isPropertiesMode && (
                    <>
                        <line x1="50" y1="50" x2="85" y2="50" stroke={dimColor} strokeWidth="1" strokeDasharray="2,2" />
                        <text x="70" y="45" fill={textColor} fontSize="9" textAnchor="middle">R</text>
                    </>
                )}
             </>
          );
      case 'Icosahedron':
          return (
              <>
                 <path d="M50 15 L80 35 L80 65 L50 85 L20 65 L20 35 Z" fill={isPropertiesMode ? "rgba(255,255,255,0.1)" : "none"} stroke={strokeColor} strokeWidth="1.5" />
                 <path d="M50 15 L50 50 L20 65 M50 50 L80 65 M50 50 L50 85" fill="none" stroke={strokeColor} strokeWidth="1" />
                 {isPropertiesMode && (
                     <>
                        <circle cx="50" cy="15" r={vertexRadius} fill={vColor} />
                        <circle cx="80" cy="35" r={vertexRadius} fill={vColor} />
                        <circle cx="80" cy="65" r={vertexRadius} fill={vColor} />
                        <circle cx="50" cy="85" r={vertexRadius} fill={vColor} />
                        <circle cx="20" cy="65" r={vertexRadius} fill={vColor} />
                        <circle cx="20" cy="35" r={vertexRadius} fill={vColor} />
                        <circle cx="50" cy="50" r={vertexRadius} fill={vColor} />
                     </>
                 )}
              </>
          );
      case 'Square':
          return (
              <>
                <rect x="25" y="25" width="50" height="50" fill={isPropertiesMode ? "rgba(255,255,255,0.1)" : "none"} stroke={strokeColor} strokeWidth="1.5" />
                {!isPropertiesMode && (
                    <>
                        <text x="50" y="85" fill={textColor} fontSize="10" textAnchor="middle">s</text>
                        <text x="80" y="50" fill={textColor} fontSize="10" textAnchor="middle">s</text>
                    </>
                )}
                {isPropertiesMode && (
                    <>
                        <circle cx="25" cy="25" r={vertexRadius} fill={vColor} />
                        <circle cx="75" cy="25" r={vertexRadius} fill={vColor} />
                        <circle cx="75" cy="75" r={vertexRadius} fill={vColor} />
                        <circle cx="25" cy="75" r={vertexRadius} fill={vColor} />
                    </>
                )}
              </>
          );
      case 'Circle':
          return (
              <>
                <circle cx="50" cy="50" r="30" fill={isPropertiesMode ? "rgba(255,255,255,0.1)" : "none"} stroke={strokeColor} strokeWidth="1.5" />
                {!isPropertiesMode && (
                    <>
                        <line x1="50" y1="50" x2="80" y2="50" stroke={textColor} strokeWidth="1" />
                        <text x="65" y="45" fill={textColor} fontSize="10" textAnchor="middle">r</text>
                    </>
                )}
                {isPropertiesMode && <circle cx="50" cy="50" r={2} fill={vColor} />}
              </>
          );
      case 'Triangle':
          return (
              <>
                <path d="M20 70 L80 70 L50 20 Z" fill={isPropertiesMode ? "rgba(255,255,255,0.1)" : "none"} stroke={strokeColor} strokeWidth="1.5" />
                {!isPropertiesMode && (
                    <>
                        <line x1="50" y1="20" x2="50" y2="70" stroke={dimColor} strokeWidth="1" strokeDasharray="2,2" />
                        <text x="55" y="60" fill={textColor} fontSize="10">t</text>
                        <text x="50" y="82" fill={textColor} fontSize="10" textAnchor="middle">a</text>
                    </>
                )}
                {isPropertiesMode && (
                    <>
                        <circle cx="50" cy="20" r={vertexRadius} fill={vColor} />
                        <circle cx="80" cy="70" r={vertexRadius} fill={vColor} />
                        <circle cx="20" cy="70" r={vertexRadius} fill={vColor} />
                    </>
                )}
              </>
          );
      default:
        return null;
    }
  };

  if (!details.inputs.length && !isPropertiesMode) return null;

  return (
    <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-600 flex flex-col items-center shadow-lg backdrop-blur-sm mt-2 max-w-[220px]">
      
      {/* SVG Container */}
      <div className="w-24 h-24 mb-2 flex items-center justify-center overflow-hidden">
        <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full overflow-visible transition-transform duration-300 ease-out"
            style={{ transform: `scale(${getScale()})` }}
        >
          {renderSVG()}
        </svg>
      </div>

      {isPropertiesMode ? (
          // PROPERTIES VIEW
          <div className="w-full bg-slate-900/50 p-3 rounded-lg border border-slate-700">
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                  <div className="text-slate-400">Sisi:</div>
                  <div className="text-right text-indigo-300 font-bold">{properties.faces}</div>
                  
                  <div className="text-slate-400">Rusuk:</div>
                  <div className="text-right text-indigo-300 font-bold">{properties.edges}</div>
                  
                  <div className="text-slate-400">Titik Sudut:</div>
                  <div className="text-right text-yellow-300 font-bold">{properties.vertices}</div>
              </div>
          </div>
      ) : (
          // FORMULA CALCULATOR VIEW
          <>
            {/* Controls */}
            <div className="w-full space-y-2 mb-3 bg-slate-900/50 p-2 rounded-lg">
                {details.inputs.map((input) => (
                <div key={input.key} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-slate-300">
                        <span>{input.label}</span>
                        <span className="font-mono text-indigo-300">{(values as any)[input.key]}</span>
                    </div>
                    <input
                    type="range"
                    min={input.min}
                    max={input.max}
                    value={(values as any)[input.key]}
                    onChange={(e) => updateValue(input.key, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>
                ))}
            </div>

            {/* Result Display */}
            <div className="w-full text-center border-t border-slate-600 pt-2">
                <div className="text-[10px] text-slate-400 font-mono mb-1">{details.formulaDisplay}</div>
                <div className="text-lg font-bold text-white">
                    <span className="text-xs text-slate-400 font-normal mr-2">Hasil:</span>
                    {details.result.toLocaleString('id-ID', { maximumFractionDigits: 2 })}
                </div>
            </div>
          </>
      )}
    </div>
  );
};

export default FormulaVisualizer;