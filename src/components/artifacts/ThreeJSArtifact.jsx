import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ThreeJSArtifact = ({ content }) => {
  const mountRef = useRef(null);
  const [error, setError] = useState(null);
  const animationRef = useRef(null);
  const controlsRef = useRef({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    rotateLeft: false,
    rotateRight: false,
    jump: false,
  });
  const jumpVelocityRef = useRef(0);
  const isJumpingRef = useRef(false);

  useEffect(() => {
    let scene, camera, renderer;
    const objects = [];
    const objectDataMap = new Map();
    let sceneGravity = { x: 0, y: -9.8, z: 0 };
    let bounceFactor = 0.5;
    let lastTime = 0;

    if (!mountRef.current) {
      setError("Mount point is not available.");
      return;
    }

    try {
      const parsedData = JSON.parse(content);

      const requiredFields = ['scene', 'camera', 'renderer', 'objects', 'lights', 'settings', 'animation'];
      for (const field of requiredFields) {
        if (!parsedData[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      scene = new THREE.Scene();
      scene.background = new THREE.Color(parsedData.scene.background);

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera = new THREE.PerspectiveCamera(
        parsedData.camera.fov,
        width / height,
        parsedData.camera.near,
        parsedData.camera.far
      );
      const { x: camX, y: camY, z: camZ } = parsedData.camera.position;
      camera.position.set(camX, camY, camZ);

      renderer = new THREE.WebGLRenderer({ antialias: parsedData.renderer.antialias });
      renderer.setSize(width, height);
      mountRef.current.appendChild(renderer.domElement);

      const lightTypes = {
        AmbientLight: THREE.AmbientLight,
        PointLight: THREE.PointLight,
        DirectionalLight: THREE.DirectionalLight,
        SpotLight: THREE.SpotLight,
      };

      parsedData.lights.forEach((light) => {
        const LightClass = lightTypes[light.type];
        if (!LightClass) {
          throw new Error(`Unknown light type: ${light.type}`);
        }
        const lightObject = new LightClass(light.color, light.intensity);
        if (light.position) {
          lightObject.position.set(light.position.x, light.position.y, light.position.z);
        }
        scene.add(lightObject);
      });

      const geometryMapping = {
        sphere: THREE.SphereGeometry,
        plane: THREE.PlaneGeometry,
        box: THREE.BoxGeometry,
        boxgeometry: THREE.BoxGeometry,
      };

      const materialMapping = {
        meshbasicmaterial: THREE.MeshBasicMaterial,
        meshphongmaterial: THREE.MeshPhongMaterial,
        meshstandardmaterial: THREE.MeshStandardMaterial,
        meshlambertmaterial: THREE.MeshLambertMaterial,
      };

      parsedData.objects.forEach((obj) => {
        let GeometryClass = geometryMapping[obj.type.toLowerCase()] || geometryMapping[obj.type];
        if (!GeometryClass) {
          throw new Error(`Unknown object type: ${obj.type}`);
        }

        let geometry;
        switch (GeometryClass) {
          case THREE.SphereGeometry:
            geometry = new GeometryClass(obj.radius || 1, obj.widthSegments || 32, obj.heightSegments || 32);
            break;
          case THREE.PlaneGeometry:
            geometry = new GeometryClass(obj.width || 10, obj.height || 10);
            break;
          case THREE.BoxGeometry:
            geometry = new GeometryClass(obj.width || 1, obj.height || 1, obj.depth || 1);
            break;
          default:
            geometry = new GeometryClass();
        }

        const MaterialClass = materialMapping[obj.material.type.toLowerCase()];
        if (!MaterialClass) {
          throw new Error(`Unknown material type: ${obj.material.type}`);
        }

        const material = new MaterialClass({
          color: obj.material.color,
          ...obj.material.additionalProps
        });

        const mesh = new THREE.Mesh(geometry, material);

        if (obj.position) {
          mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
        }

        if (obj.rotation) {
          mesh.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
        }

        scene.add(mesh);
        objects.push(mesh);

        if (obj.velocity) {
          objectDataMap.set(mesh.uuid, { velocity: obj.velocity });
        }
      });

      const { gravity, bounceFactor: bf } = parsedData.settings;
      sceneGravity = gravity || sceneGravity;
      bounceFactor = bf !== undefined ? bf : bounceFactor;

      const rotateSettings = parsedData.animation.rotate || { x: 0, y: 0, z: 0 };
      const scaleSettings = parsedData.animation.scale || { x: 0, y: 0, z: 0 };
      const translateSettings = parsedData.animation.translate || { x: 0, y: 0, z: 0 };

      const handleKeyDown = (event) => {
        switch (event.code) {
          case 'KeyW': controlsRef.current.moveForward = true; break;
          case 'KeyS': controlsRef.current.moveBackward = true; break;
          case 'KeyA': controlsRef.current.moveLeft = true; break;
          case 'KeyD': controlsRef.current.moveRight = true; break;
          case 'KeyQ': controlsRef.current.rotateLeft = true; break;
          case 'KeyE': controlsRef.current.rotateRight = true; break;
          case 'Space': 
            if (!isJumpingRef.current) {
              controlsRef.current.jump = true;
              isJumpingRef.current = true;
              jumpVelocityRef.current = 5; // Initial jump velocity
            }
            break;
        }
      };

      const handleKeyUp = (event) => {
        switch (event.code) {
          case 'KeyW': controlsRef.current.moveForward = false; break;
          case 'KeyS': controlsRef.current.moveBackward = false; break;
          case 'KeyA': controlsRef.current.moveLeft = false; break;
          case 'KeyD': controlsRef.current.moveRight = false; break;
          case 'KeyQ': controlsRef.current.rotateLeft = false; break;
          case 'KeyE': controlsRef.current.rotateRight = false; break;
          case 'Space': controlsRef.current.jump = false; break;
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      const animate = (time) => {
        animationRef.current = requestAnimationFrame(animate);

        const deltaTime = (time - lastTime) / 1000;
        lastTime = time;

        const speed = 5;
        const rotationSpeed = 2;

        if (controlsRef.current.moveForward) camera.translateZ(-speed * deltaTime);
        if (controlsRef.current.moveBackward) camera.translateZ(speed * deltaTime);
        if (controlsRef.current.moveLeft) camera.translateX(-speed * deltaTime);
        if (controlsRef.current.moveRight) camera.translateX(speed * deltaTime);
        if (controlsRef.current.rotateLeft) camera.rotateY(rotationSpeed * deltaTime);
        if (controlsRef.current.rotateRight) camera.rotateY(-rotationSpeed * deltaTime);

        // Handle jumping
        if (isJumpingRef.current) {
          camera.position.y += jumpVelocityRef.current * deltaTime;
          jumpVelocityRef.current += sceneGravity.y * deltaTime;

          if (camera.position.y <= camY) {
            camera.position.y = camY;
            isJumpingRef.current = false;
            jumpVelocityRef.current = 0;
          }
        }

        objects.forEach((obj) => {
          obj.rotation.x += rotateSettings.x * deltaTime;
          obj.rotation.y += rotateSettings.y * deltaTime;
          obj.rotation.z += rotateSettings.z * deltaTime;

          obj.scale.x += scaleSettings.x * deltaTime;
          obj.scale.y += scaleSettings.y * deltaTime;
          obj.scale.z += scaleSettings.z * deltaTime;

          obj.position.x += translateSettings.x * deltaTime;
          obj.position.y += translateSettings.y * deltaTime;
          obj.position.z += translateSettings.z * deltaTime;

          const objData = objectDataMap.get(obj.uuid);
          if (objData && objData.velocity) {
            objData.velocity.x += sceneGravity.x * deltaTime;
            objData.velocity.y += sceneGravity.y * deltaTime;
            objData.velocity.z += sceneGravity.z * deltaTime;

            obj.position.x += objData.velocity.x * deltaTime;
            obj.position.y += objData.velocity.y * deltaTime;
            obj.position.z += objData.velocity.z * deltaTime;

            const boundingBox = new THREE.Box3().setFromObject(obj);
            const groundY = -2 + (boundingBox.max.y - boundingBox.min.y) / 2;
            
            if (obj.position.y <= groundY) {
              obj.position.y = groundY;
              objData.velocity.y = -objData.velocity.y * bounceFactor;
              objData.velocity.x *= 0.99;
              objData.velocity.z *= 0.99;
            }
          }
        });

        renderer.render(scene, camera);
      };

      animate(0);

      const handleResize = () => {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animationRef.current);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        renderer.dispose();
        if (renderer.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    } catch (err) {
      console.error("ThreeJSArtifact Error:", err);
      setError(`Failed to render 3D visualization: ${err.message}`);
    }
  }, [content]);

  return (
    <div className="threejs-artifact">
      {error ? (
        <div className="error-message bg-red-600 text-white p-2 rounded">
          {error}
        </div>
      ) : (
        <div ref={mountRef} style={{ width: '100%', height: '600px' }} />
      )}
    </div>
  );
};

export default ThreeJSArtifact;
