import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PropTypes from 'prop-types';

const STLViewer = ({ stlData }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!stlData) return;

        // Configuração básica
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Adicionar iluminação
        const ambientLight = new THREE.AmbientLight(0x404040); // Luz ambiente
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5).normalize();
        scene.add(directionalLight);

        // Adicionar OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // Ativar damping (inércia suave ao mover)
        controls.dampingFactor = 0.1; // Ajustar suavidade
        controls.enableZoom = true; // Permitir zoom
        controls.autoRotate = false; // Desativar rotação automática
        controls.target.set(0, 0, 0); // Focar no centro da cena

        // Carregar o modelo STL
        const loader = new STLLoader();
        const geometry = loader.parse(atob(stlData)); // Decodificar Base64

        // Calcular bounding box e centralizar
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;

        if (!boundingBox) {
            console.error("Bounding box não foi calculado corretamente.");
            return;
        }

        const size = new THREE.Vector3();
        boundingBox.getSize(size); // Dimensões do modelo
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);

        geometry.translate(-center.x, -center.y, -center.z); // Centralizar no (0, 0, 0)

        // Adicionar o modelo na cena
        const material = new THREE.MeshStandardMaterial({ color: 0x777777 });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Ajustar posição da câmera
        const fovInRadians = THREE.MathUtils.degToRad(camera.fov);
        const modelSize = Math.max(size.x, size.y, size.z);
        const distance = modelSize / (2 * Math.tan(fovInRadians / 2));
        camera.position.set(0, 0, distance * 1.5); // Margem adicional
        camera.lookAt(0, 0, 0);

        // Função de animação
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update(); // Atualiza os controles
            renderer.render(scene, camera);
        };

        animate();

        // Cleanup ao desmontar o componente
        return () => {
            renderer.dispose();
            controls.dispose();
        };
    }, [stlData]);

    return <canvas ref={canvasRef} />;
};

STLViewer.propTypes = {
    stlData: PropTypes.string.isRequired,
};

export default STLViewer;
