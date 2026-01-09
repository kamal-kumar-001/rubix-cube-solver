'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const COLOR_MAP = {
  W: 0xffffff,
  Y: 0xffff00,
  G: 0x00ff00,
  B: 0x0000ff,
  O: 0xff8800,
  R: 0xff0000,
};

export default function Cube3D({ cube }) {
  const mountRef = useRef(null);
  const cubeGroupRef = useRef(null);

  useEffect(() => {
    const width = 320;
    const height = 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(4, 4, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xfafafa);

    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const cubeGroup = new THREE.Group();
    cubeGroupRef.current = cubeGroup;
    scene.add(cubeGroup);

    createCubies(cubeGroup, cube);

    function animate() {
      requestAnimationFrame(animate);
      cubeGroup.rotation.y += 0.005;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
  if (mountRef.current && renderer.domElement) {
    mountRef.current.removeChild(renderer.domElement);
  }
  renderer.dispose();
};

  }, []);

  useEffect(() => {
    if (!cubeGroupRef.current) return;
    updateCubies(cubeGroupRef.current, cube);
  }, [cube]);

  return <div ref={mountRef} />;
}

/* ---------------- helpers ---------------- */

function createCubies(group, cube) {
  group.clear();

  const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const materials = createMaterials(x, y, z, cube);
        const mesh = new THREE.Mesh(geometry, materials);
        mesh.position.set(x, y, z);
        group.add(mesh);
      }
    }
  }
}

function updateCubies(group, cube) {
  let i = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const mesh = group.children[i++];
        mesh.material = createMaterials(x, y, z, cube);
      }
    }
  }
}

function createMaterials(x, y, z, cube) {
  const black = new THREE.MeshBasicMaterial({ color: 0x000000 });

  const faces = {
    px: x === 1 ? cube.R : null,
    nx: x === -1 ? cube.L : null,
    py: y === 1 ? cube.U : null,
    ny: y === -1 ? cube.D : null,
    pz: z === 1 ? cube.F : null,
    nz: z === -1 ? cube.B : null,
  };

  return [
    faces.px ? coloredMaterial(faces.px, y, z, 'R') : black, // right
    faces.nx ? coloredMaterial(faces.nx, y, z, 'L') : black, // left
    faces.py ? coloredMaterial(faces.py, x, z, 'U') : black, // top
    faces.ny ? coloredMaterial(faces.ny, x, z, 'D') : black, // bottom
    faces.pz ? coloredMaterial(faces.pz, x, y, 'F') : black, // front
    faces.nz ? coloredMaterial(faces.nz, x, y, 'B') : black, // back
  ];
}

function coloredMaterial(face, a, b, faceKey) {
  const index = getStickerIndex(faceKey, a, b);
  return new THREE.MeshBasicMaterial({
    color: COLOR_MAP[face[index]],
  });
}

/* ---- map 3D coords to face index ---- */

function getStickerIndex(face, a, b) {
  const map = {
    U: [[6, 7, 8], [3, 4, 5], [0, 1, 2]],
    D: [[0, 1, 2], [3, 4, 5], [6, 7, 8]],
    F: [[6, 7, 8], [3, 4, 5], [0, 1, 2]],
    B: [[2, 1, 0], [5, 4, 3], [8, 7, 6]],
    L: [[2, 5, 8], [1, 4, 7], [0, 3, 6]],
    R: [[6, 3, 0], [7, 4, 1], [8, 5, 2]],
  };

  return map[face][1 - b][a + 1];
}
