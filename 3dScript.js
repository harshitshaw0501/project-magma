// Initialize Locomotive Scroll with optimized settings
const locoScroll = new LocomotiveScroll(document.querySelector("#main"), {
    lerp: 0.05,
    smooth: true,
    multiplier: 0.5,
    smartphone: {
        smooth: true,
        lerp: 0.05,
        multiplier: 0.5,
        breakpoint: 768
    }
});

// Optimize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Optimize loading animation
const loader = document.querySelector(".loading");
window.addEventListener("load", () => {
    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display = "none";
        }, 500);
    }, 1000);
});

// Optimize navbar scroll effect
let lastScroll = 0;
const nav = document.querySelector("#nav");
let scrollTimeout;

window.addEventListener("scroll", () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            const currentScroll = window.pageYOffset;
            if (currentScroll <= 0) {
                nav.classList.remove("scroll-up");
                return;
            }
            if (currentScroll > lastScroll && !nav.classList.contains("scroll-down")) {
                nav.classList.remove("scroll-up");
                nav.classList.add("scroll-down");
            } else if (currentScroll < lastScroll && nav.classList.contains("scroll-down")) {
                nav.classList.remove("scroll-down");
                nav.classList.add("scroll-up");
            }
            lastScroll = currentScroll;
            scrollTimeout = null;
        }, 10);
    }
});

// Optimize mobile menu
const mobileMenu = document.querySelector("#mobile-menu");
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");

function toggleMobileMenu() {
    mobileMenu.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : "";
}

// Optimize smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Optimize video background
const video = document.querySelector("#page1 > video");
if (video) {
    video.playbackRate = 0.8;
    ScrollTrigger.create({
        trigger: "#page1",
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
            video.style.transform = `translateY(${self.progress * 50}px)`;
        }
    });
}

// Optimize text animations
const textElements = document.querySelectorAll(".frontpagetxt > h1, #page2 > h2, #page2 > h1");
textElements.forEach((text, index) => {
    ScrollTrigger.create({
        trigger: text,
        start: "top 80%",
        end: "bottom 20%",
        toggleClass: "active",
        once: true,
        delay: index * 0.2
    });
});

// Optimize canvas animations
const canvas = document.querySelector("#page3 > canvas");
if (canvas) {
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const images = [];
    let currentImage = 0;
    let isAnimating = false;

    // Lazy load images in batches
    function loadImages() {
        const batchSize = 5;
        const startIndex = images.length;
        const endIndex = Math.min(startIndex + batchSize, 147);

        for (let i = startIndex; i < endIndex; i++) {
            const img = new Image();
            img.src = `img/sequence/${i}.png`;
            img.onload = () => {
                images.push(img);
                if (images.length === endIndex && !isAnimating) {
                    animate();
                }
            };
        }
    }

    function animate() {
        if (images.length === 0) return;
        
        isAnimating = true;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(images[currentImage], 0, 0, canvas.width, canvas.height);
        currentImage = (currentImage + 1) % images.length;

        if (images.length < 147) {
            loadImages();
        }
    }

    // Optimize canvas resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(() => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                resizeTimeout = null;
            }, 100);
        }
    });

    // Start loading images
    loadImages();
}

// Optimize button hover effects
const buttons = document.querySelectorAll(".cta-button, .nav-btn");
buttons.forEach(button => {
    button.addEventListener("mouseenter", () => {
        gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    button.addEventListener("mouseleave", () => {
        gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Optimize scroll progress indicator
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
});

// Optimize circle animations
const cir = document.querySelector(".cir");
const cir2 = document.querySelector(".cir2");

if (cir && cir2) {
    ScrollTrigger.create({
        trigger: "#page7",
        start: "top center",
        end: "bottom center",
        onUpdate: (self) => {
            const scale = 1 + (self.progress * 0.5);
            cir.style.transform = `translate(-50%, -50%) scale(${scale})`;
            cir2.style.transform = `scale(${scale * 0.7})`;
        }
    });
}

// Optimize property viewer
function initPropertyViewer() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const propertyModel = document.getElementById('property-model');
    const modelContainer = document.querySelector('.model-container');
    
    // Model view states
    const views = {
        exterior: {
            model: 'path/to/exterior-model.glb',
            camera: { position: { x: 0, y: 5, z: 10 }, target: { x: 0, y: 0, z: 0 } }
        },
        interior: {
            model: 'path/to/interior-model.glb',
            camera: { position: { x: 0, y: 2, z: 5 }, target: { x: 0, y: 1, z: 0 } }
        },
        floorplan: {
            model: 'path/to/floorplan-model.glb',
            camera: { position: { x: 0, y: 10, z: 0 }, target: { x: 0, y: 0, z: 0 } }
        }
    };

    // Initialize Three.js scene with optimized settings
    let scene, camera, renderer, controls;
    function initScene() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, modelContainer.clientWidth / modelContainer.clientHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        
        renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        modelContainer.appendChild(renderer.domElement);

        // Add optimized lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Add optimized orbit controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI / 2;
    }

    // Optimize model loading
    function loadModel(modelPath) {
        const loader = new THREE.GLTFLoader();
        loader.load(
            modelPath,
            (gltf) => {
                // Clear existing model with optimized cleanup
                while(scene.children.length > 0) { 
                    const object = scene.children[0];
                    if(object.type === 'PerspectiveCamera' || object.type === 'AmbientLight' || object.type === 'DirectionalLight') {
                        scene.remove(object);
                    } else {
                        object.traverse((child) => {
                            if(child.geometry) {
                                child.geometry.dispose();
                            }
                            if(child.material) {
                                if(Array.isArray(child.material)) {
                                    child.material.forEach(material => material.dispose());
                                } else {
                                    child.material.dispose();
                                }
                            }
                        });
                        scene.remove(object);
                    }
                }

                // Add new model with optimized settings
                scene.add(gltf.scene);
                
                // Center and scale model efficiently
                const box = new THREE.Box3().setFromObject(gltf.scene);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 5 / maxDim;
                gltf.scene.scale.setScalar(scale);
                gltf.scene.position.sub(center.multiplyScalar(scale));
            },
            undefined,
            (error) => {
                console.error('Error loading model:', error);
            }
        );
    }

    // Optimize view changes
    viewButtons.forEach(button => {
        button.addEventListener("click", () => {
            const view = button.dataset.view;
            
            viewButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            if (views[view]) {
                loadModel(views[view].model);
                camera.position.copy(new THREE.Vector3(
                    views[view].camera.position.x,
                    views[view].camera.position.y,
                    views[view].camera.position.z
                ));
                controls.target.copy(new THREE.Vector3(
                    views[view].camera.target.x,
                    views[view].camera.target.y,
                    views[view].camera.target.z
                ));
            }
        });
    });

    // Optimize animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    // Optimize window resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(() => {
                camera.aspect = modelContainer.clientWidth / modelContainer.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                resizeTimeout = null;
            }, 100);
        }
    });

    // Initialize scene and start animation
    initScene();
    animate();
}

// Initialize property viewer when in view
const propertyViewer = document.getElementById('property-viewer');
if (propertyViewer) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initPropertyViewer();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(propertyViewer);
}

// Optimize smooth scroll to property viewer
function scrollToPropertyViewer() {
    const propertyViewer = document.getElementById('property-viewer');
    if (propertyViewer) {
        propertyViewer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        propertyViewer.classList.add('highlight');
        setTimeout(() => {
            propertyViewer.classList.remove('highlight');
        }, 2000);
    }
}
