'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MOVE_META } from '@/lib/moveMeta';

const COLOR_MAP = {
  W: 0xffffff,
  Y: 0xffff00,
  G: 0x00ff00,
  B: 0x0000ff,
  O: 0xff8800,
  R: 0xff0000,
};

const Cube3D = forwardRef(({ cube }, ref) => {
  const mountRef = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  const cubeGroupRef = useRef(null);
  const cubiesRef = useRef([]); // ⭐ persistent cubies

  /* ---------------- init scene ---------------- */

  useEffect(() => {
    const width = 360;
    const height = 360;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f8f8);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(5, 5, 7);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    /* -------- lights -------- */

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(6, 10, 8);
    scene.add(dir);

    /* -------- controls (mouse) -------- */

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 10;
    controlsRef.current = controls;

    /* -------- cube group -------- */

    const cubeGroup = new THREE.Group();
    cubeGroupRef.current = cubeGroup;
    scene.add(cubeGroup);

    createCubies(cubeGroup, cube, cubiesRef);

    /* -------- render loop -------- */

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  /* ---------------- update colors only ---------------- */

  useEffect(() => {
    if (!cubeGroupRef.current) return;
    updateCubies(cubeGroupRef.current, cube);
  }, [cube]);

  /* ---------------- animation API ---------------- */

  useImperativeHandle(ref, () => ({
    animateMove,
    focusFace,
    resetView,
  }));

  /* ---------------- animate a face move ---------------- */

  function animateMove(move, onComplete) {
    const prime = move.includes("'");
    const face = move[0];

    const { axis, layer, dir } = MOVE_META[face];
    const rotationDir = prime ? -dir : dir;
    const angle = Math.PI / 2 * rotationDir;

    const affected = cubiesRef.current.filter(
      c => Math.round(c.position[axis]) === layer
    );

    let rotated = 0;
    const speed = 0.1;

    function step() {
      rotated += speed;

      affected.forEach(c => {
        c.rotation[axis] += speed * rotationDir;
      });

      if (rotated >= Math.PI / 2) {
        affected.forEach(c => {
          c.rotation[axis] = 0;
          c.position.applyAxisAngle(axisVector(axis), angle);
          c.position.round();
          c.userData[axis] = c.position[axis];
        });
        onComplete?.();
        return;
      }

      requestAnimationFrame(step);
    }

    step();
  }

  /* ---------------- view helpers ---------------- */

  function focusFace(face) {
    const cam = cameraRef.current;
    if (!cam) return;

    const positions = {
      U: [0, 6, 0],
      D: [0, -6, 0],
      F: [0, 0, 6],
      B: [0, 0, -6],
      L: [-6, 0, 0],
      R: [6, 0, 0],
    };

    cam.position.set(...positions[face]);
    cam.lookAt(0, 0, 0);
  }

  function resetView() {
    const cam = cameraRef.current;
    cam.position.set(5, 5, 7);
    cam.lookAt(0, 0, 0);
  }

  return <div ref={mountRef} />;
});

export default Cube3D;

/* ---------------- helpers ---------------- */

function axisVector(axis) {
  if (axis === 'x') return new THREE.Vector3(1, 0, 0);
  if (axis === 'y') return new THREE.Vector3(0, 1, 0);
  return new THREE.Vector3(0, 0, 1);
}

function createCubies(group, cube, cubiesRef) {
  const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);
  cubiesRef.current = [];

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const materials = createMaterials(x, y, z, cube);
        const mesh = new THREE.Mesh(geometry, materials);
        mesh.position.set(x, y, z);
        mesh.userData = { x, y, z };
        group.add(mesh);
        cubiesRef.current.push(mesh);
      }
    }
  }
}

function updateCubies(group, cube) {
  let i = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        group.children[i++].material = createMaterials(x, y, z, cube);
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
  const colorChar = face[index] || face[4]; // fallback to center

  return new THREE.MeshBasicMaterial({
    color: COLOR_MAP[colorChar],
  });
}


/* ---- map 3D coords to face index ---- */

function getStickerIndex(face, a, b) {
  const map = {
    U: [
      [6, 7, 8],
      [3, 4, 5],
      [0, 1, 2],
    ],
    D: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ],
    F: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ],
    B: [
      [2, 1, 0],
      [5, 4, 3],
      [8, 7, 6],
    ],
    L: [
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ],
    R: [
      [8, 5, 2],
      [7, 4, 1],
      [6, 3, 0],
    ],
  };

  return map[face][1 - b][a + 1];
}


