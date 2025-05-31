import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import * as THREE from "three";

// Constants and Configuration
const CARD_DIMENSIONS = { width: 2.4, height: 1.8, margin: 0.6 };
const SPHERE_RADIUS = 8;
const PARTICLE_COUNT = 1500;
const CAMERA_FOV = 75;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000;
const ANIMATION_DURATION = 1500; // ms
const FOCUS_DURATION = 1000; // ms

const ARTICLES_DATA = [
  {
    id: 1,
    title: "AI技術の最新動向と未来予測",
    category: "AI",
    color: "#ff6b6b",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=480&h=360&fit=crop",
  },
  {
    id: 2,
    title: "React18の新機能完全ガイド",
    category: "Frontend",
    color: "#4ecdc4",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=480&h=360&fit=crop",
  },
  {
    id: 3,
    title: "WebAssemblyの実践活用法",
    category: "WebDev",
    color: "#45b7d1",
    thumbnail:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=480&h=360&fit=crop",
  },
  {
    id: 4,
    title: "TypeScript入門から応用まで",
    category: "Language",
    color: "#f9ca24",
    thumbnail:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=480&h=360&fit=crop",
  },
  {
    id: 5,
    title: "3Dウェブ開発の新時代",
    category: "3D",
    color: "#f0932b",
    thumbnail:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=480&h=360&fit=crop",
  },
  {
    id: 6,
    title: "Next.js最適化テクニック",
    category: "Framework",
    color: "#eb4d4b",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=480&h=360&fit=crop",
  },
  {
    id: 7,
    title: "GraphQL活用術完全版",
    category: "API",
    color: "#6c5ce7",
    thumbnail:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=480&h=360&fit=crop",
  },
  {
    id: 8,
    title: "モバイル開発最前線",
    category: "Mobile",
    color: "#a29bfe",
    thumbnail:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=480&h=360&fit=crop",
  },
  {
    id: 9,
    title: "クラウド構築実践ガイド",
    category: "Cloud",
    color: "#fd79a8",
    thumbnail:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=480&h=360&fit=crop",
  },
  {
    id: 10,
    title: "セキュリティ対策の基本",
    category: "Security",
    color: "#00b894",
    thumbnail:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=480&h=360&fit=crop",
  },
  {
    id: 11,
    title: "パフォーマンス改善術",
    category: "Optimization",
    color: "#e17055",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=480&h=360&fit=crop",
  },
  {
    id: 12,
    title: "UI/UX設計の原則",
    category: "Design",
    color: "#81ecec",
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=480&h=360&fit=crop",
  },
];

// Helper Functions
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

const createPlaceholderImage = (color, text) => {
  const canvas = document.createElement("canvas");
  canvas.width = 480;
  canvas.height = 360;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, `${color}80`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      20 + Math.random() * 30,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  return canvas.toDataURL();
};

const createCardTexture = async (article, placeholderCreator) => {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 5;

  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => {
        const placeholderDataUrl = placeholderCreator(
          article.color,
          article.category
        );
        const placeholderImg = new Image();
        placeholderImg.onload = resolve;
        placeholderImg.onerror = reject;
        placeholderImg.src = placeholderDataUrl;
      };
      img.src = article.thumbnail;
    });
    const imageHeight = canvas.height * 0.7;
    ctx.drawImage(img, 10, 10, canvas.width - 20, imageHeight - 20);
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, imageHeight - 20);
  } catch (error) {
    console.warn(
      "Failed to load image, using placeholder:",
      article.title,
      error
    );
    const placeholderDataUrl = placeholderCreator(
      article.color,
      `Error: ${article.category}`
    );
    const placeholderImg = new Image();
    placeholderImg.src = placeholderDataUrl;
    try {
      await new Promise((r) => (placeholderImg.onload = r));
      const imageHeight = canvas.height * 0.7;
      ctx.drawImage(
        placeholderImg,
        10,
        10,
        canvas.width - 20,
        imageHeight - 20
      );
    } catch (e) {
      console.error("Error drawing placeholder after initial failure:", e);
    }
  }

  ctx.shadowColor = "transparent";
  const titleY = canvas.height * 0.7;
  ctx.fillStyle = "#f8f9fa";
  ctx.fillRect(0, titleY, canvas.width, canvas.height - titleY);

  ctx.fillStyle = article.color;
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "left";
  const categoryText = article.category.toUpperCase();
  const categoryWidth = ctx.measureText(categoryText).width + 16;
  ctx.fillRect(15, titleY + 10, categoryWidth, 25);
  ctx.fillStyle = "white";
  ctx.fillText(categoryText, 23, titleY + 27);

  ctx.fillStyle = "#333333";
  ctx.font = "bold 22px Arial";
  const words = article.title.split("");
  let line = "";
  let yPos = titleY + 60;
  const maxWidth = canvas.width - 30;
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i];
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      ctx.fillText(line, 15, yPos);
      line = words[i];
      yPos += 30;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 15, yPos);
  return new THREE.CanvasTexture(canvas);
};

// Custom Hooks
function useThreeSetup(mountRef) {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05050a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      CAMERA_NEAR,
      CAMERA_FAR
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xadd8e6, 1.2, 200);
    pointLight.position.set(10, 20, 20);
    pointLight.castShadow = true;
    scene.add(pointLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(-15, 15, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const baseColor = new THREE.Color(0x60a5fa);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      const varyingColor = baseColor
        .clone()
        .offsetHSL(0, 0, (Math.random() - 0.5) * 0.4);
      colors[i * 3] = varyingColor.r;
      colors[i * 3 + 1] = varyingColor.g;
      colors[i * 3 + 2] = varyingColor.b;
    }
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particleGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current && mountRef.current) {
        cameraRef.current.aspect =
          mountRef.current.clientWidth / mountRef.current.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(
          mountRef.current.clientWidth,
          mountRef.current.clientHeight
        );
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current && mountRef.current) {
        if (mountRef.current.contains(rendererRef.current.domElement)) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
      }
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              if (object.material.map) object.material.map.dispose();
              object.material.dispose();
            }
          }
        });
      }
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, [mountRef]);

  return { sceneRef, cameraRef, rendererRef };
}

function useCameraControls(
  cameraRef,
  rendererRef,
  sphericalRef,
  targetRef,
  isGlobalTransitioningActive,
  viewMode,
  getGridCameraRadius
) {
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  const isCameraDirectlyControlledRef = useRef(false);

  const updateCameraPosition = useCallback(() => {
    if (cameraRef.current && sphericalRef.current && targetRef.current) {
      cameraRef.current.position
        .setFromSpherical(sphericalRef.current)
        .add(targetRef.current);
      cameraRef.current.lookAt(targetRef.current);
    }
  }, [cameraRef, sphericalRef, targetRef]);

  useEffect(() => {
    updateCameraPosition();
  }, [updateCameraPosition]);

  const handleMouseDown = useCallback(
    (event) => {
      if (isGlobalTransitioningActive) return;
      isCameraDirectlyControlledRef.current = true;
      mouseRef.current.isDown = true;
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
      if (rendererRef.current)
        rendererRef.current.domElement.style.cursor = "grabbing";
    },
    [isGlobalTransitioningActive, rendererRef]
  );

  const handleMouseMove = useCallback(
    (event) => {
      if (!mouseRef.current.isDown || isGlobalTransitioningActive) return;
      const deltaX = event.clientX - mouseRef.current.x;
      const deltaY = event.clientY - mouseRef.current.y;
      if (sphericalRef.current) {
        sphericalRef.current.theta -= deltaX * 0.005;
        sphericalRef.current.phi -= deltaY * 0.005;
        sphericalRef.current.phi = Math.max(
          0.05,
          Math.min(Math.PI - 0.05, sphericalRef.current.phi)
        );
      }
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
      updateCameraPosition();
    },
    [isGlobalTransitioningActive, updateCameraPosition, sphericalRef]
  );

  const handleMouseUp = useCallback(() => {
    isCameraDirectlyControlledRef.current = false;
    mouseRef.current.isDown = false;
    if (rendererRef.current)
      rendererRef.current.domElement.style.cursor = "grab";
  }, [rendererRef]);

  const handleWheel = useCallback(
    (event) => {
      if (isGlobalTransitioningActive) return;
      isCameraDirectlyControlledRef.current = true;
      if (sphericalRef.current) {
        sphericalRef.current.radius += event.deltaY * 0.008;
        const currentGridRadius = getGridCameraRadius();
        const minRadiusGrid = currentGridRadius * 0.4;
        const maxRadiusGrid = currentGridRadius * 2.5;
        const minRadius = viewMode === "grid" ? minRadiusGrid : 2.5;
        const maxRadius = viewMode === "grid" ? maxRadiusGrid : 30;
        sphericalRef.current.radius = Math.max(
          minRadius,
          Math.min(maxRadius, sphericalRef.current.radius)
        );
      }
      updateCameraPosition();
      setTimeout(() => {
        isCameraDirectlyControlledRef.current = false;
      }, 100);
    },
    [
      isGlobalTransitioningActive,
      viewMode,
      getGridCameraRadius,
      updateCameraPosition,
      sphericalRef,
    ]
  );

  useEffect(() => {
    const domElement = rendererRef.current?.domElement;
    if (!domElement) return;

    domElement.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    domElement.addEventListener("wheel", handleWheel);
    domElement.style.cursor = "grab";

    return () => {
      domElement.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      domElement.removeEventListener("wheel", handleWheel);
      domElement.style.cursor = "default";
    };
  }, [
    rendererRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
  ]);

  return { isCameraDirectlyControlledRef, updateCameraPosition };
}

function useArticleCards(sceneRef, articlesData) {
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!sceneRef.current || cardsRef.current.length > 0) {
      // console.log('useArticleCards: Scene not ready or cards already exist.', sceneRef.current, cardsRef.current.length);
      return;
    }

    let mounted = true;
    const createdCards = [];
    // console.log('useArticleCards: Starting card creation process.');

    const createCards = async () => {
      for (let index = 0; index < articlesData.length; index++) {
        if (!mounted) {
          // console.log('useArticleCards: Unmounted during card creation loop.');
          return;
        }
        const article = articlesData[index];
        const phi = Math.acos(-1 + (2 * index + 1) / articlesData.length);
        const theta = Math.sqrt(articlesData.length * Math.PI) * phi;
        const x = SPHERE_RADIUS * Math.cos(theta) * Math.sin(phi);
        const y = SPHERE_RADIUS * Math.sin(theta) * Math.sin(phi);
        const z = SPHERE_RADIUS * Math.cos(phi);

        // console.log(`useArticleCards: Creating texture for article ${article.id}`);
        const texture = await createCardTexture(
          article,
          createPlaceholderImage
        );
        if (!mounted) {
          // console.log(`useArticleCards: Unmounted after texture creation for article ${article.id}`);
          texture.dispose();
          return;
        }

        const geometry = new THREE.PlaneGeometry(
          CARD_DIMENSIONS.width,
          CARD_DIMENSIONS.height
        );
        const material = new THREE.MeshLambertMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
          opacity: 1,
        }); // Initial opacity 1
        const card = new THREE.Mesh(geometry, material);

        card.userData = { ...article };
        card.userData.spherePosition = new THREE.Vector3(x, y, z);
        card.userData.gridPosition = new THREE.Vector3();
        card.position.copy(card.userData.spherePosition);
        card.castShadow = true;
        card.receiveShadow = true;

        if (sceneRef.current) {
          sceneRef.current.add(card);
          // console.log(`useArticleCards: Added card ${article.id} to scene.`);
        } else {
          // console.warn(`useArticleCards: sceneRef.current is null when trying to add card ${article.id}.`);
        }
        createdCards.push(card);
      }
      if (mounted) {
        cardsRef.current = createdCards;
        // console.log('useArticleCards: Finished card creation. Total cards:', cardsRef.current.length);
      }
    };

    createCards().catch((error) =>
      console.error("Error creating cards in useArticleCards:", error)
    );

    return () => {
      mounted = false;
      // console.log('useArticleCards: Cleanup initiated. Cards to clean:', createdCards.length);
      createdCards.forEach((card) => {
        if (sceneRef.current) sceneRef.current.remove(card);
        if (card.geometry) card.geometry.dispose();
        if (card.material) {
          if (card.material.map) card.material.map.dispose();
          card.material.dispose();
        }
      });
      // Only reset cardsRef if it's still pointing to the array created in this effect instance.
      // This helps prevent issues if the component re-mounts and this cleanup runs after new cards are set.
      if (cardsRef.current === createdCards) {
        cardsRef.current = [];
        // console.log('useArticleCards: cardsRef reset in cleanup.');
      }
    };
  }, [sceneRef, articlesData]); // articlesData is memoized, sceneRef should be stable after mount.

  return cardsRef;
}

function useViewTransitions(
  cardsRef,
  cameraRef,
  sphericalRef,
  targetRef,
  isCameraBusyRef,
  viewMode,
  setViewMode,
  focusedCard,
  setFocusedCard,
  setFocusedCardRef,
  updateCameraPosition,
  getGridCameraRadius,
  setIsGlobalTransitioning
) {
  const isViewAnimatingRef = useRef(false);

  const animateTransition = useCallback(
    (startTime, duration, updateFn, onComplete) => {
      let animationFrameId;
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);
        updateFn(easedProgress);
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          onComplete();
        }
      };
      animationFrameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrameId);
    },
    []
  );

  const switchToGridView = useCallback(() => {
    if (
      isViewAnimatingRef.current ||
      isCameraBusyRef.current ||
      viewMode === "grid" ||
      cardsRef.current.length === 0
    )
      return;
    isViewAnimatingRef.current = true;
    setIsGlobalTransitioning(true);
    setFocusedCard(null);
    setFocusedCardRef(null);

    const cols = Math.ceil(Math.sqrt(cardsRef.current.length));
    const spacingH = CARD_DIMENSIONS.width + CARD_DIMENSIONS.margin;
    const spacingV = CARD_DIMENSIONS.height + CARD_DIMENSIONS.margin;
    const gridWidth = (cols - 1) * spacingH;
    const numRows = Math.ceil(cardsRef.current.length / cols);
    const gridHeight = (numRows - 1) * spacingV;
    const startX = -gridWidth / 2;
    const startY = gridHeight / 2;

    const targetCamRadius = getGridCameraRadius();
    const targetCamSpherical = new THREE.Spherical(
      targetCamRadius,
      Math.PI / 2,
      0
    );
    const startCamSpherical = sphericalRef.current.clone();
    const startCamTarget = targetRef.current.clone();
    const targetCamTarget = new THREE.Vector3(0, 0, 0);

    const cardStartPositions = cardsRef.current.map((card) =>
      card.position.clone()
    );
    const cardStartQuaternions = cardsRef.current.map((card) =>
      card.quaternion.clone()
    );
    const targetQuaternion = new THREE.Quaternion();

    animateTransition(
      Date.now(),
      ANIMATION_DURATION,
      (easedProgress) => {
        sphericalRef.current.theta =
          startCamSpherical.theta +
          (targetCamSpherical.theta - startCamSpherical.theta) * easedProgress;
        sphericalRef.current.phi =
          startCamSpherical.phi +
          (targetCamSpherical.phi - startCamSpherical.phi) * easedProgress;
        sphericalRef.current.radius =
          startCamSpherical.radius +
          (targetCamRadius - startCamSpherical.radius) * easedProgress;
        targetRef.current.lerpVectors(
          startCamTarget,
          targetCamTarget,
          easedProgress
        );
        updateCameraPosition();

        cardsRef.current.forEach((card, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          const targetX = startX + col * spacingH;
          const targetY = startY - row * spacingV;
          card.userData.gridPosition.set(targetX, targetY, 0);
          card.position.lerpVectors(
            cardStartPositions[index],
            card.userData.gridPosition,
            easedProgress
          );
          card.quaternion.slerpQuaternions(
            cardStartQuaternions[index],
            targetQuaternion,
            easedProgress
          );
        });
      },
      () => {
        setViewMode("grid");
        cardsRef.current.forEach((card) =>
          card.quaternion.copy(targetQuaternion)
        );
        targetRef.current.copy(targetCamTarget);
        sphericalRef.current.copy(targetCamSpherical);
        updateCameraPosition();
        isViewAnimatingRef.current = false;
        setIsGlobalTransitioning(false);
      }
    );
  }, [
    viewMode,
    cardsRef,
    sphericalRef,
    targetRef,
    isCameraBusyRef,
    setViewMode,
    getGridCameraRadius,
    animateTransition,
    updateCameraPosition,
    setFocusedCard,
    setFocusedCardRef,
    setIsGlobalTransitioning,
  ]);

  const switchToSphereView = useCallback(() => {
    if (
      isViewAnimatingRef.current ||
      isCameraBusyRef.current ||
      viewMode === "sphere" ||
      cardsRef.current.length === 0
    )
      return;
    isViewAnimatingRef.current = true;
    setIsGlobalTransitioning(true);
    setFocusedCard(null);
    setFocusedCardRef(null);

    const targetCamSpherical = new THREE.Spherical(15, Math.PI / 2, 0);
    const startCamSpherical = sphericalRef.current.clone();
    const startCamTarget = targetRef.current.clone();
    const targetCamTarget = new THREE.Vector3(0, 0, 0);
    const cardStartPositions = cardsRef.current.map((card) =>
      card.position.clone()
    );
    const cardStartQuaternions = cardsRef.current.map((card) =>
      card.quaternion.clone()
    );
    const intermediateTargetQuaternion = new THREE.Quaternion();

    animateTransition(
      Date.now(),
      ANIMATION_DURATION,
      (easedProgress) => {
        sphericalRef.current.theta =
          startCamSpherical.theta +
          (targetCamSpherical.theta - startCamSpherical.theta) * easedProgress;
        sphericalRef.current.phi =
          startCamSpherical.phi +
          (targetCamSpherical.phi - startCamSpherical.phi) * easedProgress;
        sphericalRef.current.radius =
          startCamSpherical.radius +
          (targetCamSpherical.radius - startCamSpherical.radius) *
            easedProgress;
        targetRef.current.lerpVectors(
          startCamTarget,
          targetCamTarget,
          easedProgress
        );

        cardsRef.current.forEach((card, index) => {
          card.position.lerpVectors(
            cardStartPositions[index],
            card.userData.spherePosition,
            easedProgress
          );
          card.quaternion.slerpQuaternions(
            cardStartQuaternions[index],
            intermediateTargetQuaternion,
            easedProgress
          );
        });
        updateCameraPosition();
      },
      () => {
        setViewMode("sphere");
        targetRef.current.copy(targetCamTarget);
        sphericalRef.current.copy(targetCamSpherical);
        updateCameraPosition();
        isViewAnimatingRef.current = false;
        setIsGlobalTransitioning(false);
      }
    );
  }, [
    viewMode,
    cardsRef,
    sphericalRef,
    targetRef,
    isCameraBusyRef,
    setViewMode,
    animateTransition,
    updateCameraPosition,
    setFocusedCard,
    setFocusedCardRef,
    setIsGlobalTransitioning,
  ]);

  const focusOnCard = useCallback(
    (cardToFocus) => {
      if (
        isViewAnimatingRef.current ||
        isCameraBusyRef.current ||
        !cameraRef.current
      )
        return;
      isViewAnimatingRef.current = true;
      setIsGlobalTransitioning(true);
      setFocusedCard(cardToFocus.userData);
      setFocusedCardRef(cardToFocus);

      const startCamSpherical = sphericalRef.current.clone();
      const startCamTarget = targetRef.current.clone();

      const cardPosition = cardToFocus.position.clone();
      const focusDistance =
        viewMode === "grid" ? CARD_DIMENSIONS.width * 2.0 : 3.5;
      const newCamTarget = cardPosition.clone();

      let offsetDirection = new THREE.Vector3()
        .subVectors(cameraRef.current.position, newCamTarget)
        .normalize();
      if (offsetDirection.lengthSq() === 0) {
        offsetDirection.set(0, 0, 1);
      }
      const targetCamFinalPosition = new THREE.Vector3().addVectors(
        newCamTarget,
        offsetDirection.multiplyScalar(focusDistance)
      );

      const tempSphericalTarget = new THREE.Spherical();
      tempSphericalTarget.setFromCartesianCoords(
        targetCamFinalPosition.x - newCamTarget.x,
        targetCamFinalPosition.y - newCamTarget.y,
        targetCamFinalPosition.z - newCamTarget.z
      );

      animateTransition(
        Date.now(),
        FOCUS_DURATION,
        (easedProgress) => {
          sphericalRef.current.theta =
            startCamSpherical.theta +
            (tempSphericalTarget.theta - startCamSpherical.theta) *
              easedProgress;
          sphericalRef.current.phi =
            startCamSpherical.phi +
            (tempSphericalTarget.phi - startCamSpherical.phi) * easedProgress;
          sphericalRef.current.radius =
            startCamSpherical.radius +
            (tempSphericalTarget.radius - startCamSpherical.radius) *
              easedProgress;
          targetRef.current.lerpVectors(
            startCamTarget,
            newCamTarget,
            easedProgress
          );
          updateCameraPosition();
        },
        () => {
          targetRef.current.copy(newCamTarget);
          sphericalRef.current.copy(tempSphericalTarget);
          updateCameraPosition();
          isViewAnimatingRef.current = false;
          setIsGlobalTransitioning(false);
        }
      );
    },
    [
      cameraRef,
      viewMode,
      sphericalRef,
      targetRef,
      isCameraBusyRef,
      animateTransition,
      updateCameraPosition,
      setFocusedCard,
      setFocusedCardRef,
      setIsGlobalTransitioning,
    ]
  );

  const resetView = useCallback(() => {
    if (isViewAnimatingRef.current || isCameraBusyRef.current) return;
    isViewAnimatingRef.current = true;
    setIsGlobalTransitioning(true);
    setFocusedCard(null);
    setFocusedCardRef(null);

    const targetCamRadius = viewMode === "sphere" ? 15 : getGridCameraRadius();
    const targetCamSpherical = new THREE.Spherical(
      targetCamRadius,
      Math.PI / 2,
      0
    );
    const startCamSpherical = sphericalRef.current.clone();
    const startCamTarget = targetRef.current.clone();
    const targetCamTarget = new THREE.Vector3(0, 0, 0);

    animateTransition(
      Date.now(),
      FOCUS_DURATION,
      (easedProgress) => {
        sphericalRef.current.theta =
          startCamSpherical.theta +
          (targetCamSpherical.theta - startCamSpherical.theta) * easedProgress;
        sphericalRef.current.phi =
          startCamSpherical.phi +
          (targetCamSpherical.phi - startCamSpherical.phi) * easedProgress;
        sphericalRef.current.radius =
          startCamSpherical.radius +
          (targetCamRadius - startCamSpherical.radius) * easedProgress;
        targetRef.current.lerpVectors(
          startCamTarget,
          targetCamTarget,
          easedProgress
        );
        updateCameraPosition();
      },
      () => {
        targetRef.current.copy(targetCamTarget);
        sphericalRef.current.copy(targetCamSpherical);
        updateCameraPosition();
        isViewAnimatingRef.current = false;
        setIsGlobalTransitioning(false);
      }
    );
  }, [
    viewMode,
    sphericalRef,
    targetRef,
    isCameraBusyRef,
    getGridCameraRadius,
    animateTransition,
    updateCameraPosition,
    setFocusedCard,
    setFocusedCardRef,
    setIsGlobalTransitioning,
  ]);

  return { switchToGridView, switchToSphereView, focusOnCard, resetView };
}

// UI Components
const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const FocusedCardPanel = ({ card, onReset }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (card) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [card]);

  if (!card && !isVisible) return null;

  const handleOpenArticle = () => {
    const articleUrl = `https://example.com/article/${card.id}`;
    window.open(articleUrl, "_blank");
  };

  return (
    <div
      className={`absolute top-6 right-6 text-white bg-slate-800/70 backdrop-blur-xl 
                  border border-slate-700/80 shadow-2xl rounded-xl 
                  p-5 sm:p-6 max-w-xs w-[calc(100%-3rem)] sm:w-auto
                  transition-all duration-300 ease-out ${
                    isVisible
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className="px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md"
          style={{
            backgroundColor: card?.color ? `${card.color}EE` : "#777777EE",
            color: "#FFFFFF",
            textShadow: "1px 1px 3px rgba(0,0,0,0.4)",
          }}
        >
          {card?.category?.toUpperCase() || "N/A"}
        </span>
        <button
          onClick={onReset}
          className="text-slate-400 hover:text-sky-300 transition-colors text-2xl leading-none p-1 -mr-1 rounded-full hover:bg-slate-700/50"
          aria-label="Close focused card view"
        >
          &times;
        </button>
      </div>
      <h3
        onClick={handleOpenArticle}
        className="text-lg sm:text-xl font-semibold mb-2.5 leading-tight cursor-pointer hover:text-sky-300 transition-colors"
      >
        {card?.title || "Loading..."}
      </h3>
      <p className="text-xs text-slate-400 mb-4">
        Article ID: {card?.id || "..."}
      </p>

      <div className="bg-sky-500/10 p-3.5 rounded-lg mb-5 border border-sky-500/30">
        <p className="text-xs text-sky-200/90">
          💡 Click the card title or the button below to open the article.
        </p>
      </div>

      <button
        onClick={handleOpenArticle}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500
                   text-white py-3 px-4 rounded-lg transition-all duration-300 font-semibold shadow-lg 
                   hover:shadow-xl hover:brightness-110 transform hover:scale-[1.02] active:scale-95 text-sm"
      >
        Read Article <ArrowRightIcon />
      </button>
    </div>
  );
};

const StatsDisplay = ({ count, mode }) => (
  <div className="absolute bottom-6 left-6 text-white bg-slate-800/70 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-xl p-3.5 sm:p-4">
    <div className="text-sm sm:text-md font-bold text-slate-100">
      {count} Articles
    </div>
    <div className="text-xs sm:text-sm text-slate-400">
      View:{" "}
      <span className="font-semibold text-sky-300">
        {mode === "sphere" ? "Sphere" : "Grid"}
      </span>
    </div>
  </div>
);

const ViewModeSwitcher = ({
  currentMode,
  onSwitchToGrid,
  onSwitchToSphere,
  isTransitioning,
}) => (
  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
    <div className="flex items-center space-x-1 bg-black/30 backdrop-blur-md rounded-full p-1 shadow-xl border border-white/10">
      {["grid", "sphere"].map((mode) => (
        <button
          key={mode}
          onClick={mode === "grid" ? onSwitchToGrid : onSwitchToSphere}
          disabled={isTransitioning || currentMode === mode}
          className={`px-4 sm:px-5 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ease-out
            ${
              currentMode === mode
                ? "bg-white/20 text-sky-100 shadow-md"
                : `text-slate-400 hover:text-sky-300 
                 ${
                   isTransitioning
                     ? "opacity-50 cursor-not-allowed"
                     : "hover:bg-white/10"
                 }`
            }
            ${
              isTransitioning && currentMode !== mode
                ? "cursor-not-allowed"
                : ""
            }
            ${currentMode === mode ? "cursor-default" : "cursor-pointer"}
          `}
        >
          <span className="capitalize">{mode}</span>
        </button>
      ))}
    </div>
  </div>
);

// Main Component
const ArticleViewer3D = () => {
  const mountRef = useRef(null);
  const { sceneRef, cameraRef, rendererRef } = useThreeSetup(mountRef);

  const articles = useMemo(() => ARTICLES_DATA, []);
  const cardsRef = useArticleCards(sceneRef, articles);

  const [viewMode, setViewMode] = useState("sphere");
  const [focusedCard, setFocusedCard] = useState(null);
  const [focusedCardRef, setFocusedCardRef] = useState(null);
  const raycasterRef = useRef(new THREE.Raycaster());

  const initialSpherical = useMemo(
    () => new THREE.Spherical(15, Math.PI / 2, 0),
    []
  );
  const sphericalRef = useRef(new THREE.Spherical().copy(initialSpherical));
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));

  const [isGlobalTransitioning, setIsGlobalTransitioning] = useState(false);

  const getGridCameraRadius = useCallback(() => {
    const numArticles = ARTICLES_DATA.length;
    if (numArticles === 0) return 10;
    const cols = Math.ceil(Math.sqrt(numArticles));
    const spacingH = CARD_DIMENSIONS.width + CARD_DIMENSIONS.margin;
    const spacingV = CARD_DIMENSIONS.height + CARD_DIMENSIONS.margin;
    const gridWidth = (cols - 1) * spacingH;
    const numRows = Math.ceil(numArticles / cols);
    const gridHeight = (numRows - 1) * spacingV;
    return Math.max(gridWidth, gridHeight, 6) * 1.2 + 8;
  }, []);

  const { isCameraDirectlyControlledRef, updateCameraPosition } =
    useCameraControls(
      cameraRef,
      rendererRef,
      sphericalRef,
      targetRef,
      isGlobalTransitioning,
      viewMode,
      getGridCameraRadius
    );

  const { switchToGridView, switchToSphereView, focusOnCard, resetView } =
    useViewTransitions(
      cardsRef,
      cameraRef,
      sphericalRef,
      targetRef,
      isCameraDirectlyControlledRef,
      viewMode,
      setViewMode,
      focusedCard,
      setFocusedCard,
      setFocusedCardRef,
      updateCameraPosition,
      getGridCameraRadius,
      setIsGlobalTransitioning
    );

  const handleClick = useCallback(
    (event) => {
      if (
        isCameraDirectlyControlledRef.current ||
        isGlobalTransitioning ||
        !rendererRef.current ||
        !cameraRef.current ||
        cardsRef.current.length === 0
      )
        return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycasterRef.current.setFromCamera(mouse, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(
        cardsRef.current,
        false
      );

      if (intersects.length > 0) {
        const clickedCardObject = intersects[0].object;
        if (
          focusedCard &&
          (clickedCardObject === focusedCardRef ||
            clickedCardObject.userData.id === focusedCard.id)
        ) {
          const articleUrl = `https://example.com/article/${focusedCard.id}`;
          window.open(articleUrl, "_blank");
        } else {
          focusOnCard(clickedCardObject);
        }
      } else if (focusedCard) {
        resetView();
      }
    },
    [
      isCameraDirectlyControlledRef,
      isGlobalTransitioning,
      rendererRef,
      cameraRef,
      cardsRef,
      focusedCard,
      focusedCardRef,
      focusOnCard,
      resetView,
    ]
  );

  useEffect(() => {
    const domElement = rendererRef.current?.domElement;
    if (!domElement) return;
    domElement.addEventListener("click", handleClick);
    return () => {
      if (domElement) {
        domElement.removeEventListener("click", handleClick);
      }
    };
  }, [rendererRef, handleClick]);

  // Animation Loop
  useEffect(() => {
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isCameraDirectlyControlledRef.current && !isGlobalTransitioning) {
        if (
          viewMode === "sphere" &&
          !focusedCard &&
          cardsRef.current.length > 0
        ) {
          const time = Date.now() * 0.00015;
          cardsRef.current.forEach((card, index) => {
            if (card.userData.spherePosition) {
              const basePos = card.userData.spherePosition;
              card.position.x = basePos.x + Math.sin(time + index * 0.6) * 0.04;
              card.position.y = basePos.y + Math.cos(time + index * 0.4) * 0.04;
              card.position.z = basePos.z + Math.sin(time + index * 0.8) * 0.04;
            }
          });
        }
      }

      if (cameraRef.current && cardsRef.current.length > 0) {
        cardsRef.current.forEach((card) => {
          if (viewMode === "sphere" || focusedCard) {
            card.lookAt(cameraRef.current.position);
          }
          const isThisCardFocused =
            focusedCardRef === card ||
            (focusedCard &&
              String(card.userData.id) === String(focusedCard.id));

          const targetOpacity = isThisCardFocused
            ? 1.0
            : focusedCard
            ? 0.15
            : 1.0;
          const targetEmissive = 0x000000;

          // Set opacity directly for immediate effect, good for debugging visibility
          card.material.opacity = targetOpacity;

          if (card.material.emissive.getHex() !== targetEmissive) {
            card.material.emissive.setHex(targetEmissive);
          }

          card.material.needsUpdate = true;
        });
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    if (rendererRef.current) {
      // console.log('Starting animation loop');
      animate();
    }
    return () => {
      // console.log('Stopping animation loop');
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    rendererRef,
    sceneRef,
    cameraRef,
    cardsRef,
    viewMode,
    focusedCard,
    focusedCardRef,
    isCameraDirectlyControlledRef,
    isGlobalTransitioning,
  ]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 font-sans">
      <div ref={mountRef} className="w-full h-full" />
      <FocusedCardPanel card={focusedCard} onReset={resetView} />
      <StatsDisplay count={articles.length} mode={viewMode} />
      <ViewModeSwitcher
        currentMode={viewMode}
        onSwitchToGrid={switchToGridView}
        onSwitchToSphere={switchToSphereView}
        isTransitioning={
          isGlobalTransitioning || isCameraDirectlyControlledRef.current
        }
      />
    </div>
  );
};

export default ArticleViewer3D;
