# Rubik's Cube Solver

A Next.js Rubik's Cube solver with interactive 2D/3D views, step-by-step solving, and camera-based face scanning.

**Features**
- 2D cube editor with color picker for manual correction
- 3D cube visualization with animated moves
- Step-by-step solver with Next/Prev and auto-step
- Camera scan for face capture (mobile-friendly start button)

**Getting Started**
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

**How To Use**
1. **Play mode**: Use move buttons to rotate the cube.
2. **Solve**: Press `Solve` to generate a step-by-step solution. Use Next/Prev or Auto Step.
3. **Scan mode**: Tap `Start Camera`, align a face in the grid, then press `Capture Face`.
4. **Fix colors**: Use the 2D cube and color picker to correct any mis-detected stickers.

**Scan Tips**
- Use bright, even lighting.
- Fill the on-screen grid with a single face.
- Keep the cube steady for a clean capture.

**Mobile Camera Notes**
- Camera permissions require a user gesture, so tap `Start Camera` first.
- Camera access only works on HTTPS (or `localhost`).

**Scripts**
```bash
npm run dev
npm run build
npm run start
npm run lint
```
