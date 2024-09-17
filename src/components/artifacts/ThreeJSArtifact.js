import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ThreeJSArtifact = ({ content }) => {
  const mountRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let scene, camera, renderer, animationId;

    if (!mountRef.current) {
      setError("Mount point is not available.");
      return;
    }

    try {
      // Initialize Scene
      scene = new THREE.Scene();

      // Initialize Camera
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 5;

      // Initialize Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      mountRef.current.appendChild(renderer.domElement);

      // Add Ambient Light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      // Add Directional Light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(10, 10, 10);
      scene.add(directionalLight);

      // Parse content to add objects to the scene
      const parsedData = JSON.parse(content);

      if (parsedData.objects && Array.isArray(parsedData.objects)) {
        parsedData.objects.forEach(obj => {
          let geometry, material, mesh;

          switch (obj.type) {
            case 'box':
              geometry = new THREE.BoxGeometry(obj.width || 1, obj.height || 1, obj.depth || 1);
              break;
            case 'sphere':
              geometry = new THREE.SphereGeometry(obj.radius || 1, obj.widthSegments || 32, obj.heightSegments || 32);
              break;
            case 'cylinder':
              geometry = new THREE.CylinderGeometry(
                obj.radiusTop || 1,
                obj.radiusBottom || 1,
                obj.height || 1,
                obj.radialSegments || 32
              );
              break;
            // Add more geometry types as needed
            default:
              throw new Error(`Unknown object type: ${obj.type}`);
          }

          material = new THREE.MeshStandardMaterial({ color: obj.color || 0x00ff00 });
          mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(obj.position?.x || 0, obj.position?.y || 0, obj.position?.z || 0);
          scene.add(mesh);
        });
      }

      // Animation Loop
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        // Optional: Add rotation or other animations
        scene.rotation.x += 0.01;
        scene.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();
    } catch (err) {
      console.error("ThreeJSArtifact Error:", err);
      setError("Failed to render 3D visualization. Please check the artifact content.");
    }

    // Cleanup on unmount
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (renderer) {
        renderer.dispose();
        if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
    };
  }, [content]);

  return (
    <div className="threejs-artifact">
      {error ? (
        <div className="error-message bg-red-600 text-white p-2 rounded">
          {error}
        </div>
      ) : (
        <div ref={mountRef} style={{ width: '100%', height: '400px' }} />
      )}
    </div>
  );
};

export default ThreeJSArtifact;
