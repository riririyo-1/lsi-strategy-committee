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
        placeholderImg.onerror = reject; // Should not happen with Data URL
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
    // No need for await here as it's a fallback within a catch
    placeholderImg.src = placeholderDataUrl;
    try {
      await new Promise((r) => (placeholderImg.onload = r)); // ensure drawn
      const imageHeight = canvas.height * 0.7;
      ctx.drawImage(
        placeholderImg,
        10,
        10,
        canvas.width - 20,
        imageHeight - 20
      );
    } catch (e) {
      /* ignore secondary error */
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
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      CAMERA_NEAR,
      CAMERA_FAR
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 150);
    pointLight.position.set(5, 15, 15);
    pointLight.castShadow = true;
    scene.add(pointLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(-10, 10, 5);
    scene.add(directionalLight);

    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 70;
    }
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x666666,
      size: 0.08,
      transparent: true,
      opacity: 0.5,
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
        // Check if rendererRef.current.domElement is a child of mountRef.current before removing
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
  initialSpherical,
  isTransitioning,
  viewMode,
  getGridCameraRadius
) {
  const sphericalRef = useRef(new THREE.Spherical().copy(initialSpherical));
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  const isAnimatingRef = useRef(false); // Internal animation state for controls

  const updateCameraPosition = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.position
        .setFromSpherical(sphericalRef.current)
        .add(targetRef.current);
      cameraRef.current.lookAt(targetRef.current);
    }
  }, [cameraRef]);

  useEffect(() => {
    // Initialize camera position
    updateCameraPosition();
  }, [updateCameraPosition]);

  const handleMouseDown = useCallback(
    (event) => {
      if (isAnimatingRef.current || isTransitioning) return;
      mouseRef.current.isDown = true;
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
      if (rendererRef.current)
        rendererRef.current.domElement.style.cursor = "grabbing";
    },
    [isTransitioning, rendererRef]
  );

  const handleMouseMove = useCallback(
    (event) => {
      if (!mouseRef.current.isDown || isAnimatingRef.current || isTransitioning)
        return;
      const deltaX = event.clientX - mouseRef.current.x;
      const deltaY = event.clientY - mouseRef.current.y;
      sphericalRef.current.theta -= deltaX * 0.005;
      sphericalRef.current.phi -= deltaY * 0.005;
      sphericalRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI - 0.1, sphericalRef.current.phi)
      );
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
      updateCameraPosition();
    },
    [isTransitioning, updateCameraPosition]
  );

  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDown = false;
    if (rendererRef.current)
      rendererRef.current.domElement.style.cursor = "grab";
  }, [rendererRef]);

  const handleWheel = useCallback(
    (event) => {
      if (isAnimatingRef.current || isTransitioning) return;
      sphericalRef.current.radius += event.deltaY * 0.01;
      const minRadiusGrid = getGridCameraRadius() * 0.5;
      const maxRadiusGrid = getGridCameraRadius() * 2.0;
      const minRadius = viewMode === "grid" ? minRadiusGrid : 3;
      const maxRadius = viewMode === "grid" ? maxRadiusGrid : 25;
      sphericalRef.current.radius = Math.max(
        minRadius,
        Math.min(maxRadius, sphericalRef.current.radius)
      );
      updateCameraPosition();
    },
    [isTransitioning, viewMode, getGridCameraRadius, updateCameraPosition]
  );

  useEffect(() => {
    const domElement = rendererRef.current?.domElement;
    if (!domElement) return;

    domElement.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove); // Listen on document for smoother dragging
    document.addEventListener("mouseup", handleMouseUp); // Listen on document for mouseup outside canvas
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

  return { sphericalRef, targetRef, isAnimatingRef, updateCameraPosition };
}

function useArticleCards(sceneRef, articlesData) {
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!sceneRef.current || cardsRef.current.length > 0) return; // Ensure scene exists and cards aren't already created

    let mounted = true;
    const createdCards = [];

    const createCards = async () => {
      for (let index = 0; index < articlesData.length; index++) {
        if (!mounted) return;
        const article = articlesData[index];
        const phi = Math.acos(-1 + (2 * index + 1) / articlesData.length);
        const theta = Math.sqrt(articlesData.length * Math.PI) * phi;
        const x = SPHERE_RADIUS * Math.cos(theta) * Math.sin(phi);
        const y = SPHERE_RADIUS * Math.sin(theta) * Math.sin(phi);
        const z = SPHERE_RADIUS * Math.cos(phi);

        const texture = await createCardTexture(
          article,
          createPlaceholderImage
        );
        if (!mounted) {
          // Check again after await
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
        });
        const card = new THREE.Mesh(geometry, material);

        card.userData = { ...article };
        card.userData.spherePosition = new THREE.Vector3(x, y, z);
        card.userData.gridPosition = new THREE.Vector3(); // Will be calculated later
        card.position.copy(card.userData.spherePosition);
        card.castShadow = true;
        card.receiveShadow = true;

        sceneRef.current.add(card);
        createdCards.push(card);
      }
      if (mounted) {
        cardsRef.current = createdCards;
      }
    };

    createCards().catch((error) =>
      console.error("Error creating cards:", error)
    );

    return () => {
      mounted = false;
      // Cleanup cards if they were added to sceneRef.current
      createdCards.forEach((card) => {
        if (sceneRef.current) sceneRef.current.remove(card);
        if (card.geometry) card.geometry.dispose();
        if (card.material) {
          if (card.material.map) card.material.map.dispose();
          card.material.dispose();
        }
      });
      if (cardsRef.current === createdCards) {
        // Avoid issues if component re-mounts quickly
        cardsRef.current = [];
      }
    };
  }, [sceneRef, articlesData]);

  return cardsRef;
}

function useViewTransitions(
  cardsRef,
  cameraRef,
  sphericalRef,
  targetRef,
  isAnimatingRef,
  viewMode,
  setViewMode,
  focusedCard,
  setFocusedCard,
  setFocusedCardRef,
  updateCameraPosition
) {
  const [isTransitioningView, setIsTransitioningView] = useState(false);

  const getGridCameraRadius = useCallback(() => {
    const cols = Math.ceil(Math.sqrt(ARTICLES_DATA.length));
    const spacingH = CARD_DIMENSIONS.width + CARD_DIMENSIONS.margin;
    const spacingV = CARD_DIMENSIONS.height + CARD_DIMENSIONS.margin;
    const gridWidth = (cols - 1) * spacingH;
    const numRows = Math.ceil(ARTICLES_DATA.length / cols);
    const gridHeight = (numRows - 1) * spacingV;
    return Math.max(gridWidth, gridHeight, 5) * 1.1 + 7; // Increased base distance
  }, []);

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
      return () => cancelAnimationFrame(animationFrameId); // Return cleanup function
    },
    []
  );

  const switchToGridView = useCallback(() => {
    if (isTransitioningView || viewMode === "grid" || isAnimatingRef.current)
      return;
    setIsTransitioningView(true);
    isAnimatingRef.current = true;

    const cols = Math.ceil(Math.sqrt(ARTICLES_DATA.length));
    const spacingH = CARD_DIMENSIONS.width + CARD_DIMENSIONS.margin;
    const spacingV = CARD_DIMENSIONS.height + CARD_DIMENSIONS.margin;
    const gridWidth = (cols - 1) * spacingH;
    const numRows = Math.ceil(ARTICLES_DATA.length / cols);
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

    animateTransition(
      Date.now(),
      ANIMATION_DURATION,
      (easedProgress) => {
        sphericalRef.current.radius =
          startCamSpherical.radius +
          (targetCamRadius - startCamSpherical.radius) * easedProgress;
        sphericalRef.current.phi =
          startCamSpherical.phi +
          (targetCamSpherical.phi - startCamSpherical.phi) * easedProgress;
        sphericalRef.current.theta =
          startCamSpherical.theta +
          (targetCamSpherical.theta - startCamSpherical.theta) * easedProgress;
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
        });
      },
      () => {
        setViewMode("grid");
        setIsTransitioningView(false);
        isAnimatingRef.current = false;
      }
    );
  }, [
    isTransitioningView,
    viewMode,
    cardsRef,
    sphericalRef,
    targetRef,
    isAnimatingRef,
    setViewMode,
    getGridCameraRadius,
    animateTransition,
    updateCameraPosition,
  ]);

  const switchToSphereView = useCallback(() => {
    if (isTransitioningView || viewMode === "sphere" || isAnimatingRef.current)
      return;
    setIsTransitioningView(true);
    isAnimatingRef.current = true;

    const targetCamSpherical = new THREE.Spherical(15, Math.PI / 2, 0);
    const startCamSpherical = sphericalRef.current.clone();
    const startCamTarget = targetRef.current.clone();
    const targetCamTarget = new THREE.Vector3(0, 0, 0);
    const cardStartPositions = cardsRef.current.map((card) =>
      card.position.clone()
    );

    animateTransition(
      Date.now(),
      ANIMATION_DURATION,
      (easedProgress) => {
        sphericalRef.current.radius =
          startCamSpherical.radius +
          (targetCamSpherical.radius - startCamSpherical.radius) *
            easedProgress;
        sphericalRef.current.phi =
          startCamSpherical.phi +
          (targetCamSpherical.phi - startCamSpherical.phi) * easedProgress;
        sphericalRef.current.theta =
          startCamSpherical.theta +
          (targetCamSpherical.theta - startCamSpherical.theta) * easedProgress;
        targetRef.current.lerpVectors(
          startCamTarget,
          targetCamTarget,
          easedProgress
        );
        updateCameraPosition();

        cardsRef.current.forEach((card, index) => {
          card.position.lerpVectors(
            cardStartPositions[index],
            card.userData.spherePosition,
            easedProgress
          );
        });
      },
      () => {
        setViewMode("sphere");
        setIsTransitioningView(false);
        isAnimatingRef.current = false;
      }
    );
  }, [
    isTransitioningView,
    viewMode,
    cardsRef,
    sphericalRef,
    targetRef,
    isAnimatingRef,
    setViewMode,
    animateTransition,
    updateCameraPosition,
  ]);

  const focusOnCard = useCallback(
    (cardToFocus) => {
      if (isTransitioningView || isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      setFocusedCard(cardToFocus.userData);
      setFocusedCardRef(cardToFocus);

      const startCamSpherical = sphericalRef.current.clone();
      const startCamTarget = targetRef.current.clone();

      const cardPosition = cardToFocus.position.clone();
      const cameraDirection = new THREE.Vector3()
        .subVectors(cameraRef.current.position, cardPosition)
        .normalize();
      const focusDistance =
        viewMode === "grid" ? CARD_DIMENSIONS.width * 2.2 : 3.8;

      // Target for camera to look at is the card's center
      const newCamTarget = cardPosition.clone();

      // Target camera position: behind the card relative to its current view, then move closer
      // We want the camera to be `focusDistance` away from `newCamTarget` (card's center)
      // The new spherical coordinates will be relative to this `newCamTarget`
      const targetCamPos = new THREE.Vector3().addVectors(
        cardPosition,
        cameraDirection.multiplyScalar(focusDistance)
      );

      const tempSpherical = new THREE.Spherical();
      tempSpherical.setFromCartesianCoords(
        targetCamPos.x - newCamTarget.x,
        targetCamPos.y - newCamTarget.y,
        targetCamPos.z - newCamTarget.z
      );
      // Ensure phi and theta are reasonable if card is directly in front/behind
      if (isNaN(tempSpherical.phi) || isNaN(tempSpherical.theta)) {
        tempSpherical.phi = startCamSpherical.phi; // fallback to current phi
        tempSpherical.theta = startCamSpherical.theta; // fallback to current theta
      }
      tempSpherical.radius = focusDistance;

      animateTransition(
        Date.now(),
        FOCUS_DURATION,
        (easedProgress) => {
          sphericalRef.current.radius =
            startCamSpherical.radius +
            (tempSpherical.radius - startCamSpherical.radius) * easedProgress;
          sphericalRef.current.phi =
            startCamSpherical.phi +
            (tempSpherical.phi - startCamSpherical.phi) * easedProgress;
          sphericalRef.current.theta =
            startCamSpherical.theta +
            (tempSpherical.theta - startCamSpherical.theta) * easedProgress;
          targetRef.current.lerpVectors(
            startCamTarget,
            newCamTarget,
            easedProgress
          );
          updateCameraPosition();
        },
        () => {
          targetRef.current.copy(newCamTarget); // Ensure target is exact
          sphericalRef.current.copy(tempSpherical); // Ensure spherical is exact
          updateCameraPosition();
          isAnimatingRef.current = false;
        }
      );
    },
    [
      isTransitioningView,
      isAnimatingRef,
      setFocusedCard,
      setFocusedCardRef,
      cameraRef,
      viewMode,
      animateTransition,
      updateCameraPosition,
      sphericalRef,
      targetRef,
    ]
  );

  const resetView = useCallback(() => {
    if (isTransitioningView || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
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
        sphericalRef.current.radius =
          startCamSpherical.radius +
          (targetCamRadius - startCamSpherical.radius) * easedProgress;
        sphericalRef.current.phi =
          startCamSpherical.phi +
          (targetCamSpherical.phi - startCamSpherical.phi) * easedProgress;
        sphericalRef.current.theta =
          startCamSpherical.theta +
          (targetCamSpherical.theta - startCamSpherical.theta) * easedProgress;
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
        isAnimatingRef.current = false;
      }
    );
  }, [
    isTransitioningView,
    isAnimatingRef,
    setFocusedCard,
    setFocusedCardRef,
    viewMode,
    getGridCameraRadius,
    animateTransition,
    updateCameraPosition,
    sphericalRef,
    targetRef,
  ]);

  return {
    isTransitioningView,
    switchToGridView,
    switchToSphereView,
    focusOnCard,
    resetView,
    getGridCameraRadius,
  };
}

// UI Components
// const ControlsOverlay = () => (  // This component is no longer used.
//   <div className="absolute top-4 left-4 text-white bg-black bg-opacity-60 p-4 rounded-lg backdrop-blur-md shadow-lg max-w-xs">
//     <h2 className="text-xl font-bold mb-3 border-b border-gray-700 pb-2">🌐 3D Article Explorer</h2>
//     <div className="text-xs sm:text-sm space-y-1.5 text-gray-300">
//       <p><span className="font-semibold text-gray-100">🖱️ Drag:</span> Rotate View</p>
//       <p><span className="font-semibold text-gray-100">🔄 Wheel:</span> Zoom In/Out</p>
//       <p><span className="font-semibold text-gray-100">👆 Card Click:</span> Focus Card</p>
//       <p><span className="font-semibold text-gray-100">📖 Focused Card Click:</span> View Details</p>
//       <p><span className="font-semibold text-gray-100">🌌 Empty Space Click:</span> Reset View</p>
//       <p><span className="font-semibold text-gray-100">📊 Buttons Below:</span> Toggle Grid/Sphere</p>
//     </div>
//   </div>
// );

const FocusedCardPanel = ({ card, onReset }) => {
  if (!card) return null;
  const handleOpenArticle = () => {
    const articleUrl = `https://example.com/article/${card.id}`; // Replace with actual URL
    window.open(articleUrl, "_blank");
  };
  return (
    <div className="absolute top-4 right-4 text-white bg-black bg-opacity-75 p-4 sm:p-6 rounded-lg backdrop-blur-md shadow-xl max-w-xs w-11/12 sm:w-auto">
      <div className="flex items-center justify-between mb-3">
        <span
          className="px-3 py-1 rounded-full text-xs font-bold shadow-sm"
          style={{
            backgroundColor: card.color,
            color: "#fff",
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          {card.category.toUpperCase()}
        </span>
        <button
          onClick={onReset}
          className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
          aria-label="Close focused card view"
        >
          &times;
        </button>
      </div>
      <h3
        onClick={handleOpenArticle}
        className="text-base sm:text-lg font-semibold mb-2 leading-tight cursor-pointer hover:underline"
      >
        {card.title}
      </h3>
      <p className="text-xs text-gray-400 mb-3">Article ID: {card.id}</p>
      <div className="bg-indigo-500 bg-opacity-20 p-3 rounded mb-4 border border-indigo-500 border-opacity-40">
        <p className="text-xs text-indigo-200">
          💡 Click the card title or the button below to open the article.
        </p>
      </div>
      <button
        onClick={handleOpenArticle}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors font-semibold shadow-md text-sm"
      >
        Read Article 🚀
      </button>
    </div>
  );
};

const StatsDisplay = ({ count, mode }) => (
  <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-60 p-3 sm:p-4 rounded-lg backdrop-blur-md shadow-lg">
    <div className="text-base sm:text-lg font-bold">{count} Articles</div>
    <div className="text-xs sm:text-sm text-gray-300">
      View:{" "}
      <span className="font-semibold text-gray-100">
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
  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
    <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-full px-2 py-1.5 sm:px-3 sm:py-2 shadow-2xl">
      <button
        onClick={onSwitchToGrid}
        disabled={isTransitioning || currentMode === "grid"}
        className={`px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ease-out
          ${
            currentMode === "grid"
              ? "bg-white text-gray-900 shadow-md scale-105 cursor-default"
              : "text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600"
          }
          ${
            isTransitioning && currentMode !== "grid"
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
      >
        Grid
      </button>
      <button
        onClick={onSwitchToSphere}
        disabled={isTransitioning || currentMode === "sphere"}
        className={`px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ease-out
          ${
            currentMode === "sphere"
              ? "bg-white text-gray-900 shadow-md scale-105 cursor-default"
              : "text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600"
          }
          ${
            isTransitioning && currentMode !== "sphere"
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
      >
        Sphere
      </button>
    </div>
  </div>
);

// Main Component
const ArticleViewer3D = () => {
  const mountRef = useRef(null);
  const { sceneRef, cameraRef, rendererRef } = useThreeSetup(mountRef);

  const articles = useMemo(() => ARTICLES_DATA, []);
  const cardsRef = useArticleCards(sceneRef, articles);

  const [viewMode, setViewMode] = useState("sphere"); // 'sphere' or 'grid'
  const [focusedCard, setFocusedCard] = useState(null);
  const [focusedCardRef, setFocusedCardRef] = useState(null); // Stores the THREE.Mesh object of the focused card
  const raycasterRef = useRef(new THREE.Raycaster());

  const initialSpherical = useMemo(
    () => new THREE.Spherical(15, Math.PI / 2, 0),
    []
  );
  const { sphericalRef, targetRef, isAnimatingRef, updateCameraPosition } =
    useCameraControls(
      cameraRef,
      rendererRef,
      initialSpherical,
      false,
      viewMode,
      () => 15 /* temp grid radius */
    );
  // Note: getGridCameraRadius will be passed from useViewTransitions hook

  const {
    isTransitioningView,
    switchToGridView,
    switchToSphereView,
    focusOnCard,
    resetView,
    getGridCameraRadius,
  } = useViewTransitions(
    cardsRef,
    cameraRef,
    sphericalRef,
    targetRef,
    isAnimatingRef,
    viewMode,
    setViewMode,
    focusedCard,
    setFocusedCard,
    setFocusedCardRef,
    updateCameraPosition
  );

  // Update camera controls with the correct getGridCameraRadius from transitions hook
  useEffect(() => {
    if (isAnimatingRef) {
      // Check if isAnimatingRef is available from useCameraControls
      // This is a bit of a workaround to inject the correct getGridCameraRadius
      // Ideally, useCameraControls would take it as a stable prop or context
    }
  }, [getGridCameraRadius, isAnimatingRef]);

  const handleClick = useCallback(
    (event) => {
      if (
        isAnimatingRef.current ||
        isTransitioningView ||
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
      ); // Non-recursive

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
      isAnimatingRef,
      isTransitioningView,
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
    return () => domElement.removeEventListener("click", handleClick);
  }, [rendererRef, handleClick]);

  // Animation Loop
  useEffect(() => {
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isAnimatingRef.current && !isTransitioningView) {
        // Only apply these effects if no major animation is happening
        // Subtle floating animation for cards in sphere view
        if (
          viewMode === "sphere" &&
          !focusedCard &&
          cardsRef.current.length > 0
        ) {
          const time = Date.now() * 0.0002;
          cardsRef.current.forEach((card, index) => {
            if (card.userData.spherePosition) {
              const basePos = card.userData.spherePosition;
              card.position.x = basePos.x + Math.sin(time + index * 0.5) * 0.05;
              card.position.y = basePos.y + Math.cos(time + index * 0.3) * 0.05;
              card.position.z = basePos.z + Math.sin(time + index * 0.7) * 0.05;
            }
          });
        }
      }

      // Update card appearances (opacity, lookAt)
      if (cameraRef.current && cardsRef.current.length > 0) {
        cardsRef.current.forEach((card) => {
          if (viewMode === "sphere" || focusedCard || viewMode === "grid") {
            // Always look at camera for now
            card.lookAt(cameraRef.current.position);
          }

          const isThisCardFocused =
            focusedCardRef === card ||
            (focusedCard &&
              String(card.userData.id) === String(focusedCard.id));
          if (isThisCardFocused) {
            card.material.opacity = 1.0;
            card.material.emissive.setHex(0x111111);
          } else if (focusedCard) {
            card.material.opacity = 0.15;
            card.material.emissive.setHex(0x000000);
          } else {
            card.material.opacity = 1.0;
            card.material.emissive.setHex(0x000000);
          }
          card.material.needsUpdate = true;
        });
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    rendererRef,
    sceneRef,
    cameraRef,
    cardsRef,
    viewMode,
    focusedCard,
    focusedCardRef,
    isAnimatingRef,
    isTransitioningView,
  ]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div ref={mountRef} className="w-full h-full" />
      {/* <ControlsOverlay /> */}{" "}
      {/* ControlsOverlay is removed as per user request */}
      <FocusedCardPanel card={focusedCard} onReset={resetView} />
      <StatsDisplay count={articles.length} mode={viewMode} />
      <ViewModeSwitcher
        currentMode={viewMode}
        onSwitchToGrid={switchToGridView}
        onSwitchToSphere={switchToSphereView}
        isTransitioning={isTransitioningView || isAnimatingRef.current}
      />
      {/* Global styles for body can be handled by Tailwind config or a global CSS file */}
    </div>
  );
};

export default ArticleViewer3D;
