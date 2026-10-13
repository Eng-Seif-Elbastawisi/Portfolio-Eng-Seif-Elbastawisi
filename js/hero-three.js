import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.querySelector('#hero-three-canvas');
const stage = canvas?.closest('.hero-3d-stage');

if (canvas && stage) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.z = 7.6;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch (error) {
    // CSS glow and floating framework icons remain as a graceful fallback without WebGL.
    stage.classList.add('hero-three-fallback');
  }

  if (renderer) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const artwork = new THREE.Group();
    scene.add(artwork);

    scene.add(new THREE.AmbientLight(0x9dbdff, 1.65));
    const keyLight = new THREE.PointLight(0x4f8cff, 36, 18);
    keyLight.position.set(3, 3, 5);
    scene.add(keyLight);
    const violetLight = new THREE.PointLight(0x9b5cff, 24, 16);
    violetLight.position.set(-3, -2, 1);
    scene.add(violetLight);

    const coreGeometry = new THREE.IcosahedronGeometry(1.48, 2);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x3979ff,
      metalness: 0.38,
      roughness: 0.22,
      transmission: 0.12,
      transparent: true,
      opacity: 0.78,
      clearcoat: 1,
      clearcoatRoughness: 0.2,
      flatShading: true
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    artwork.add(core);

    const wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.55, 2)),
      new THREE.LineBasicMaterial({ color: 0x9dc4ff, transparent: true, opacity: 0.55 })
    );
    artwork.add(wire);

    const ringMaterialA = new THREE.MeshBasicMaterial({ color: 0x5da2ff, transparent: true, opacity: 0.72 });
    const ringMaterialB = new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.58 });
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.02, 0.012, 8, 160), ringMaterialA);
    ringA.rotation.set(1.05, 0.25, 0.28);
    artwork.add(ringA);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.22, 0.009, 8, 160), ringMaterialB);
    ringB.rotation.set(0.45, 1.0, -0.52);
    artwork.add(ringB);
    const ringC = new THREE.Mesh(new THREE.TorusGeometry(1.83, 0.008, 8, 160), new THREE.MeshBasicMaterial({ color: 0x6ee7f9, transparent: true, opacity: 0.45 }));
    ringC.rotation.set(1.3, -0.65, 0.7);
    artwork.add(ringC);

    // Tiny glowing nodes around the orbital paths add a subtle developer-network motif.
    const nodeCount = 42;
    const positions = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i += 1) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 1.95 + Math.sin(i * 2.13) * 0.34;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle * 1.7) * 1.7;
      positions[i * 3 + 2] = Math.sin(angle) * radius * 0.52;
    }
    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const nodes = new THREE.Points(nodeGeometry, new THREE.PointsMaterial({ color: 0xb7d7ff, size: 0.045, transparent: true, opacity: 0.9, sizeAttenuation: true }));
    artwork.add(nodes);

    const particlePositions = new Float32Array(220 * 3);
    for (let i = 0; i < particlePositions.length; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 7.5;
      particlePositions[i + 1] = (Math.random() - 0.5) * 7.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4.5;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x83aaff, size: 0.018, transparent: true, opacity: 0.56 }));
    scene.add(particles);

    let targetX = 0;
    let targetY = 0;
    let active = true;
    let frameId = 0;
    const clock = new THREE.Clock();

    function resize() {
      const width = Math.max(stage.clientWidth, 1);
      const height = Math.max(stage.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }

    function animate() {
      if (!reducedMotion) frameId = window.requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      if (!reducedMotion) {
        artwork.rotation.y += (targetY - artwork.rotation.y) * 0.025;
        artwork.rotation.x += (targetX - artwork.rotation.x) * 0.025;
        core.rotation.x = elapsed * 0.12;
        core.rotation.y = elapsed * 0.17;
        wire.rotation.copy(core.rotation);
        ringA.rotation.z += 0.0017;
        ringB.rotation.x -= 0.0012;
        ringC.rotation.y += 0.0014;
        nodes.rotation.y -= 0.001;
        particles.rotation.y = elapsed * 0.012;
      }
      renderer.render(scene, camera);
    }

    stage.addEventListener('pointermove', (event) => {
      if (reducedMotion) return;
      const bounds = stage.getBoundingClientRect();
      targetY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.32;
      targetX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -0.25;
    }, { passive: true });
    stage.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; }, { passive: true });

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active && !frameId) {
        if (reducedMotion) renderer.render(scene, camera);
        else animate();
      }
      if (!active && frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
      if (!active) renderer.render(scene, camera);
    }, { threshold: 0.05 });
    visibilityObserver.observe(stage);
    window.addEventListener('resize', resize, { passive: true });
    resize();
    if (active) {
      if (reducedMotion) renderer.render(scene, camera);
      else animate();
    }

    // Reuse the scene but gently update accent colors when the site theme changes.
    const themeObserver = new MutationObserver(() => {
      const lightTheme = document.documentElement.getAttribute('data-theme') === 'light';
      coreMaterial.color.set(lightTheme ? 0x548bff : 0x3979ff);
      wire.material.color.set(lightTheme ? 0x477de0 : 0x9dc4ff);
      ringA.material.color.set(lightTheme ? 0x3f7de8 : 0x5da2ff);
      renderer.render(scene, camera);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }
}
