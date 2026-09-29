import { useEffect, useRef } from 'react'

// Sân cầu lông 3D + vợt + quả cầu, animation theo scroll (port từ bản HTML cũ)
export default function HeroCanvas({ heroRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    let disposed = false
    let cleanup = () => {}

    import('three').then((THREE) => {
      if (disposed) return
      const canvas = canvasRef.current
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000, 0)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200)
      camera.position.set(0, 6, 14)
      camera.lookAt(0, 0, 0)

      // Ánh sáng (nhân PI để giữ độ sáng như three r128)
      scene.add(new THREE.AmbientLight(0xffffff, 0.35 * Math.PI))
      const dirLight = new THREE.DirectionalLight(0x00e5a0, 1.2 * Math.PI)
      dirLight.position.set(5, 10, 5)
      scene.add(dirLight)
      const fillLight = new THREE.DirectionalLight(0x4488ff, 0.5 * Math.PI)
      fillLight.position.set(-8, 4, -4)
      scene.add(fillLight)

      // ── SÂN ──
      const courtGroup = new THREE.Group()
      scene.add(courtGroup)

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(13.4, 6.1),
        new THREE.MeshStandardMaterial({ color: 0x0a1520, roughness: 0.8, metalness: 0.1, transparent: true, opacity: 0.7 }),
      )
      floor.rotation.x = -Math.PI / 2
      courtGroup.add(floor)

      const makeLine = (points, color = 0x00e5a0, opacity = 0.6) =>
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
        )
      const hLine = (z, x1, x2, o) => makeLine([new THREE.Vector3(x1, 0.01, z), new THREE.Vector3(x2, 0.01, z)], 0x00e5a0, o)
      const vLine = (x, z1, z2, o) => makeLine([new THREE.Vector3(x, 0.01, z1), new THREE.Vector3(x, 0.01, z2)], 0x00e5a0, o)

      courtGroup.add(hLine(-3.05, -6.7, 6.7, 0.8), hLine(3.05, -6.7, 6.7, 0.8))
      courtGroup.add(vLine(-6.7, -3.05, 3.05, 0.8), vLine(6.7, -3.05, 3.05, 0.8))
      courtGroup.add(vLine(0, -3.05, 3.05, 0.5))
      courtGroup.add(hLine(-1.98, -6.7, 6.7, 0.4), hLine(1.98, -6.7, 6.7, 0.4))
      courtGroup.add(hLine(-2.53, -6.7, 6.7, 0.3), hLine(2.53, -6.7, 6.7, 0.3))
      courtGroup.add(vLine(-5.18, -3.05, 3.05, 0.3), vLine(5.18, -3.05, 3.05, 0.3))

      // Lưới
      const net = new THREE.Mesh(
        new THREE.PlaneGeometry(13.4, 1.55),
        new THREE.MeshStandardMaterial({ color: 0x00e5a0, transparent: true, opacity: 0.12, side: THREE.DoubleSide }),
      )
      net.position.set(0, 0.78, 0)
      courtGroup.add(net)
      const netWire = new THREE.Mesh(
        new THREE.PlaneGeometry(13.4, 1.55, 26, 8),
        new THREE.MeshBasicMaterial({ color: 0x00e5a0, transparent: true, opacity: 0.25, wireframe: true }),
      )
      netWire.position.set(0, 0.78, 0)
      courtGroup.add(netWire)
      courtGroup.add(makeLine([new THREE.Vector3(-6.7, 1.55, 0), new THREE.Vector3(6.7, 1.55, 0)], 0x00e5a0, 0.9))
      courtGroup.rotation.y = 0.3

      // ── QUẢ CẦU ──
      const cork = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0xffe0a0, roughness: 0.6 }),
      )
      const skirt = new THREE.Mesh(
        new THREE.ConeGeometry(0.5, 0.8, 16, 1, true),
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, side: THREE.DoubleSide }),
      )
      skirt.position.y = 0.4
      const skirtLines = new THREE.Mesh(
        new THREE.ConeGeometry(0.5, 0.8, 16, 1, true),
        new THREE.MeshBasicMaterial({ color: 0x00e5a0, transparent: true, opacity: 0.5, wireframe: true }),
      )
      skirtLines.position.y = 0.4
      const shuttle = new THREE.Group()
      shuttle.add(cork, skirt, skirtLines)
      shuttle.position.set(3, 4, -2)
      shuttle.rotation.z = -0.5
      scene.add(shuttle)

      // ── VỢT ──
      const racketGroup = new THREE.Group()
      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.05, 1.5, 8),
        new THREE.MeshStandardMaterial({ color: 0x1a2a3a, roughness: 0.7 }),
      )
      handle.position.y = -0.75
      racketGroup.add(handle)
      const head = new THREE.Mesh(
        new THREE.TorusGeometry(0.55, 0.04, 8, 32),
        new THREE.MeshStandardMaterial({ color: 0x00c882, roughness: 0.3, metalness: 0.5 }),
      )
      head.position.y = 0.55
      racketGroup.add(head)
      for (let i = -4; i <= 4; i++) {
        const x = i * 0.12
        const halfH = Math.sqrt(Math.max(0, 0.55 * 0.55 - x * x))
        racketGroup.add(makeLine([new THREE.Vector3(x, 0.55 - halfH, 0.01), new THREE.Vector3(x, 0.55 + halfH, 0.01)], 0x00e5a0, 0.4))
      }
      for (let i = -4; i <= 4; i++) {
        const y = 0.55 + i * 0.12
        const halfW = Math.sqrt(Math.max(0, 0.55 * 0.55 - (y - 0.55) * (y - 0.55)))
        if (halfW > 0.02) {
          racketGroup.add(makeLine([new THREE.Vector3(-halfW, y, 0.01), new THREE.Vector3(halfW, y, 0.01)], 0x00e5a0, 0.4))
        }
      }
      racketGroup.position.set(-2, 2.5, 1)
      racketGroup.rotation.z = 0.6
      racketGroup.rotation.y = 0.3
      scene.add(racketGroup)

      // ── VỆT CẦU ──
      const trailCount = 80
      const trailPositions = new Float32Array(trailCount * 3)
      for (let i = 0; i < trailCount; i++) {
        trailPositions[i * 3] = shuttle.position.x
        trailPositions[i * 3 + 1] = shuttle.position.y
        trailPositions[i * 3 + 2] = shuttle.position.z
      }
      const trailGeo = new THREE.BufferGeometry()
      trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))
      const trailMat = new THREE.PointsMaterial({ color: 0x00e5a0, size: 0.06, transparent: true, opacity: 0.5 })
      scene.add(new THREE.Points(trailGeo, trailMat))

      const clock = new THREE.Clock()
      let trailIdx = 0
      let rafId = 0

      function animate() {
        rafId = requestAnimationFrame(animate)
        const t = clock.getElapsedTime()
        const heroH = heroRef.current?.offsetHeight || window.innerHeight
        const scrollPct = Math.min(window.scrollY / (heroH * 0.85), 1)

        // Nếu đã cuộn qua hero thì bỏ qua render cho đỡ tốn pin
        if (window.scrollY > heroH * 1.2) return

        const idleFloat = Math.sin(t * 0.8) * 0.15

        if (scrollPct < 0.5) {
          const p = scrollPct / 0.5
          racketGroup.position.set(-2 + p * 0.8, 2.5 + idleFloat + p * 1.2, 1)
          racketGroup.rotation.z = 0.6 - p * 1.8
          racketGroup.rotation.x = -p * 0.6
        } else {
          const p = (scrollPct - 0.5) / 0.5
          const ease = 1 - Math.pow(1 - p, 3)
          racketGroup.position.set(-2 + 0.8 + ease * 2.5, 2.5 + idleFloat + 1.2 - ease * 3.0, 1)
          racketGroup.rotation.z = 0.6 - 1.8 + ease * -1.4
          racketGroup.rotation.x = -0.6 + ease * -0.5
        }

        if (scrollPct < 0.6) {
          shuttle.position.set(3 + Math.sin(t * 0.6) * 0.1, 4 + Math.cos(t * 0.5) * 0.12, -2)
          shuttle.rotation.z = -0.5 + Math.sin(t * 0.4) * 0.05
        } else {
          const p = (scrollPct - 0.6) / 0.4
          const ease = p * p
          shuttle.position.set(3 - ease * 9, 4 - ease * 5, -2 - ease * 3)
          shuttle.rotation.z = -0.5 - ease * 3
          shuttle.rotation.x = ease * 2
        }

        trailIdx = (trailIdx + 1) % trailCount
        const tp = trailGeo.attributes.position
        tp.setXYZ(trailIdx, shuttle.position.x, shuttle.position.y, shuttle.position.z)
        tp.needsUpdate = true
        trailMat.opacity = 0.1 + scrollPct * 0.6

        courtGroup.rotation.y = 0.3 + Math.sin(t * 0.15) * 0.04 + scrollPct * 0.3
        courtGroup.position.y = -1 - scrollPct * 1.5

        camera.position.x = Math.sin(t * 0.1) * 0.4
        camera.position.y = 6 + scrollPct * 2
        camera.position.z = 14 + scrollPct * 2

        renderer.render(scene, camera)
      }
      animate()

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('resize', onResize)

      cleanup = () => {
        cancelAnimationFrame(rafId)
        window.removeEventListener('resize', onResize)
        scene.traverse((obj) => {
          obj.geometry?.dispose()
          obj.material?.dispose()
        })
        renderer.dispose()
      }
    })

    return () => {
      disposed = true
      cleanup()
    }
  }, [heroRef])

  return <canvas id="three-canvas" ref={canvasRef} />
}
