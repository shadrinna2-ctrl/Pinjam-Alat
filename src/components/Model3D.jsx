import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Maximize2, Pause, Play, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import { buildModel } from '../lib/models3d.js'
import ProductArt from './ProductArt.jsx'

/**
 * Viewer 3D interaktif berbasis Three.js + OrbitControls.
 * Drag/geser untuk memutar, scroll/pinch untuk zoom, tombol reset & auto-rotate.
 */
export default function Model3D({ product, height = 380, artFallback = true }) {
  const mountRef = useRef(null)
  const stateRef = useRef(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!product) return
    const mount = mountRef.current
    if (!mount) return

    setFailed(false)
    let disposed = false
    let frame = 0
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    const home = new THREE.Vector3(2.9, 2.1, 3.9)
    camera.position.copy(home)

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      setFailed(true)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.touchAction = 'none'
    renderer.domElement.style.cursor = 'grab'

    scene.add(new THREE.HemisphereLight(0xffffff, 0x2a2f52, 1.7))
    const key = new THREE.DirectionalLight(0xffffff, 2.1)
    key.position.set(4, 6, 5)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    scene.add(key)
    const fill = new THREE.PointLight(0x8b7bff, 2.4, 30)
    fill.position.set(-4, 1.5, 2)
    scene.add(fill)
    const rim = new THREE.PointLight(0xff8fbc, 1.6, 30)
    rim.position.set(2, -1, -4)
    scene.add(rim)

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(3.4, 64),
      new THREE.MeshStandardMaterial({ color: 0x3a4270, transparent: true, opacity: 0.3, roughness: 0.9 }),
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.95
    floor.receiveShadow = true
    scene.add(floor)

    const grid = new THREE.GridHelper(7, 24, 0x8b7bff, 0x4b5480)
    grid.position.y = -0.94
    grid.material.transparent = true
    grid.material.opacity = 0.22
    scene.add(grid)

    const holder = new THREE.Group()
    scene.add(holder)

    const fitAndAdd = (object) => {
      const box = new THREE.Box3().setFromObject(object)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z) || 1
      const scale = 2.1 / maxDim
      object.position.sub(center)
      object.scale.setScalar(scale)
      holder.add(object)
    }

    if (product.customModelUrl) {
      const loader = new GLTFLoader()
      loader.load(
        product.customModelUrl,
        (gltf) => {
          if (disposed) return
          fitAndAdd(gltf.scene)
        },
        undefined,
        () => {
          // Berkas GLB gagal dimuat: pakai model prosedural sebagai cadangan.
          if (!disposed) fitAndAdd(buildModel(product.model3d || 'instrument'))
        },
      )
    } else {
      fitAndAdd(buildModel(product.model3d || 'instrument'))
    }

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enablePan = false
    controls.minDistance = 2.2
    controls.maxDistance = 7.5
    controls.minPolarAngle = 0.25
    controls.maxPolarAngle = Math.PI / 1.9
    controls.target.set(0, 0, 0)
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 1.6

    const resize = () => {
      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(mount)

    const animate = () => {
      frame = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    stateRef.current = {
      controls,
      home,
      zoom(factor) {
        const next = camera.position.clone().multiplyScalar(factor)
        next.clampLength(controls.minDistance, controls.maxDistance)
        camera.position.copy(next)
      },
      reset() {
        camera.position.copy(home)
        controls.target.set(0, 0, 0)
        holder.rotation.set(0, 0, 0)
        controls.update()
      },
      setAutoRotate(value) {
        controls.autoRotate = value
      },
    }

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      controls.dispose()
      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose?.()
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose?.())
          else obj.material?.dispose?.()
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
      stateRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, product?.model3d, product?.customModelUrl])

  useEffect(() => {
    stateRef.current?.setAutoRotate(autoRotate)
  }, [autoRotate])

  if (!product) return null

  if (failed && artFallback) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-ink" style={{ height }}>
        <ProductArt kind={product.art} className="h-full w-full opacity-80" />
        <div className="absolute inset-x-0 bottom-0 bg-ink/85 p-3 text-center text-xs text-white/80">
          Model 3D tidak dapat dimuat. Menampilkan ilustrasi produk.
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_35%,#2d3568,#12162f_70%)]">
      <div className="flex items-center justify-between px-4 pb-2 pt-3 text-[11px] text-white/60">
        <span className="font-semibold text-white/85">Model 3D — {product.name}</span>
        <span className="hidden sm:inline">Drag untuk memutar · Scroll untuk zoom</span>
      </div>
      <div ref={mountRef} className="relative w-full" style={{ height }} />
      <div className="flex flex-wrap items-center justify-center gap-2 px-3 pb-3">
        <button
          type="button"
          onClick={() => stateRef.current?.reset()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-bold text-white hover:bg-white/10"
        >
          <RotateCcw size={13} /> Reset
        </button>
        <button
          type="button"
          onClick={() => setAutoRotate((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-bold text-white hover:bg-white/10"
        >
          {autoRotate ? <Pause size={13} /> : <Play size={13} />}
          {autoRotate ? 'Pause' : 'Putar'}
        </button>
        <button
          type="button"
          aria-label="Perbesar"
          onClick={() => stateRef.current?.zoom(0.86)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-bold text-white hover:bg-white/10"
        >
          <ZoomIn size={13} /> Zoom
        </button>
        <button
          type="button"
          aria-label="Perkecil"
          onClick={() => stateRef.current?.zoom(1.16)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-bold text-white hover:bg-white/10"
        >
          <ZoomOut size={13} /> Perkecil
        </button>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-[11px] text-white/45">
          <Maximize2 size={12} /> 360°
        </span>
      </div>
    </div>
  )
}
