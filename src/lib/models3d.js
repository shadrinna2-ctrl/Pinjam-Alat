import * as THREE from 'three'

/**
 * Model 3D prosedural untuk setiap jenis alat.
 * Model dibuat dari geometri dasar agar ringan (tanpa file GLB eksternal),
 * sementara admin tetap dapat mengunggah berkas GLB/GLTF sendiri.
 */

const C = {
  body: 0x2a3157,
  bodyLight: 0x3a4270,
  panel: 0x1b2142,
  metal: 0xb9bfd9,
  metalDark: 0x7c83a8,
  dark: 0x141830,
  accent: 0x8b7bff,
  pink: 0xff8fbc,
  screen: 0x2b6f8f,
  cyan: 0x64d8e8,
  mint: 0x59f2b0,
  amber: 0xffca6b,
}

const mat = (color, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.25, ...extra })

const box = (parent, w, h, d, color, x = 0, y = 0, z = 0) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color))
  m.position.set(x, y, z)
  parent.add(m)
  return m
}

const cyl = (parent, rt, rb, h, color, x = 0, y = 0, z = 0, seg = 32) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color))
  m.position.set(x, y, z)
  parent.add(m)
  return m
}

const screen = (parent, w, h, x, y, z, color = C.cyan) => {
  box(parent, w, h, 0.025, C.dark, x, y, z + 0.01)
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w * 0.9, h * 0.82),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.65 }),
  )
  m.position.set(x, y, z + 0.03)
  parent.add(m)
  return m
}

const knob = (parent, x, y, z, r = 0.08, color = C.metal) => {
  const m = cyl(parent, r, r, 0.05, color, x, y, z, 24)
  m.rotation.x = Math.PI / 2
  return m
}

const lights = (parent, x, y, z, count, gap = 0.09) => {
  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 10, 10),
      new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? C.mint : i % 3 === 1 ? C.accent : C.amber }),
    )
    m.position.set(x + i * gap, y, z)
    parent.add(m)
  }
}

const feet = (group, w, z) => {
  box(group, 0.1, 0.08, 0.12, C.dark, -w / 2 + 0.15, -0.63, z)
  box(group, 0.1, 0.08, 0.12, C.dark, w / 2 - 0.15, -0.63, z)
}

const builders = {
  workstation(g) {
    box(g, 1.1, 1.25, 0.85, C.body, -0.35, -0.02, 0)
    box(g, 0.95, 1.05, 0.02, C.bodyLight, -0.35, -0.02, 0.44)
    for (let i = 0; i < 4; i++) box(g, 0.8, 0.02, 0.02, C.panel, -0.35, -0.4 + i * 0.22, 0.45)
    cyl(g, 0.12, 0.12, 0.03, C.accent, -0.35, 0.3, 0.45)
    lights(g, -0.2, -0.55, 0.46, 3, 0.07)

    box(g, 0.06, 0.5, 0.06, C.metalDark, 0.75, -0.35, -0.2)
    box(g, 0.7, 0.42, 0.03, C.panel, 0.75, 0.15, -0.2)
    screen(g, 0.66, 0.38, 0.75, 0.15, -0.16, C.cyan)
    box(g, 0.5, 0.02, 0.2, C.dark, 0.75, -0.62, -0.2)

    box(g, 0.55, 0.02, 0.2, C.bodyLight, 0.75, -0.6, 0.25)
    box(g, 0.75, 0.04, 0.35, C.panel, 0.75, -0.58, 0.25)
  },
  laptop(g) {
    box(g, 1.35, 0.04, 0.95, C.metalDark, 0, -0.2, 0.1)
    box(g, 1.25, 0.015, 0.75, C.dark, 0, -0.17, 0.05)
    box(g, 0.35, 0.01, 0.2, C.bodyLight, 0, -0.16, 0.42)

    const lid = new THREE.Group()
    lid.position.set(0, -0.18, -0.38)
    lid.rotation.x = -0.12
    box(lid, 1.35, 0.85, 0.035, C.body)
    screen(lid, 1.24, 0.74, 0, 0.35, 0.02, C.cyan)
    g.add(lid)
  },
  server(g) {
    box(g, 1.05, 1.5, 0.9, C.body)
    box(g, 0.95, 1.4, 0.02, C.bodyLight, 0, 0, 0.46)
    for (let i = 0; i < 7; i++) {
      box(g, 0.85, 0.15, 0.03, C.panel, 0, 0.55 - i * 0.2, 0.47)
      lights(g, -0.3, 0.55 - i * 0.2, 0.5, 3, 0.07)
      box(g, 0.35, 0.08, 0.02, C.metalDark, 0.05, 0.55 - i * 0.2, 0.5)
    }
    feet(g, 1.05, 0.3)
  },
  nas(g) {
    box(g, 1.1, 1.0, 0.85, C.body)
    for (let i = 0; i < 4; i++) {
      box(g, 0.95, 0.18, 0.05, C.bodyLight, 0, 0.34 - i * 0.24, 0.44)
      box(g, 0.6, 0.08, 0.02, C.panel, -0.1, 0.34 - i * 0.24, 0.47)
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 10), new THREE.MeshBasicMaterial({ color: C.mint }))
      led.position.set(0.38, 0.34 - i * 0.24, 0.47)
      g.add(led)
    }
    box(g, 0.9, 0.03, 0.04, C.accent, 0, -0.43, 0.47)
    feet(g, 1.1, 0.3)
  },
  router(g) {
    box(g, 1.5, 0.34, 0.85, C.body)
    box(g, 0.7, 0.18, 0.03, C.bodyLight, -0.35, 0, 0.44)
    lights(g, 0.1, 0.04, 0.45, 4, 0.1)
    const a = cyl(g, 0.025, 0.025, 0.7, C.metal, -0.6, 0.45, -0.3)
    a.rotation.z = 0.35
    const b = cyl(g, 0.025, 0.025, 0.7, C.metal, 0.6, 0.45, -0.3)
    b.rotation.z = -0.35
    const c = cyl(g, 0.02, 0.02, 0.55, C.metalDark, 0.15, 0.4, -0.3)
    c.rotation.z = 0.12
    box(g, 1.5, 0.05, 0.02, C.panel, 0, -0.2, 0.44)
    feet(g, 1.5, 0.3)
  },
  switch(g) {
    box(g, 1.7, 0.24, 0.7, C.body)
    box(g, 1.6, 0.18, 0.02, C.bodyLight, 0, 0, 0.36)
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 12; c++) {
        box(g, 0.1, 0.07, 0.03, C.dark, -0.68 + c * 0.12, 0.04 - r * 0.09, 0.38)
      }
    }
    lights(g, -0.75, -0.1, 0.39, 5, 0.08)
    box(g, 0.3, 0.12, 0.03, C.accent, 0.7, 0.02, 0.38)
    feet(g, 1.7, 0.25)
  },
  firewall(g) {
    box(g, 1.35, 0.75, 0.75, C.body)
    const shield = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.34, 0.06, 6),
      mat(C.accent, { metalness: 0.5 }),
    )
    shield.rotation.x = Math.PI / 2
    shield.rotation.z = Math.PI / 6
    shield.position.set(0, 0.03, 0.39)
    g.add(shield)
    box(g, 0.5, 0.14, 0.03, C.panel, -0.35, -0.27, 0.38)
    lights(g, 0.3, -0.27, 0.39, 3, 0.1)
    feet(g, 1.35, 0.25)
  },
  splicer(g) {
    box(g, 1.4, 0.8, 0.95, C.body)
    screen(g, 0.6, 0.45, -0.3, 0.05, 0.48, C.cyan)
    box(g, 0.45, 0.22, 0.03, C.bodyLight, 0.42, 0.12, 0.48)
    lights(g, 0.28, 0.2, 0.5, 3, 0.08)
    knob(g, 0.45, -0.15, 0.49, 0.09, C.accent)
    const fiberA = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.012, 8, 40, Math.PI),
      mat(C.pink, { roughness: 0.3 }),
    )
    fiberA.position.set(-0.75, 0.1, 0)
    fiberA.rotation.z = Math.PI / 2
    g.add(fiberA)
    const fiberB = fiberA.clone()
    fiberB.material = mat(C.cyan, { roughness: 0.3 })
    fiberB.position.x = 0.75
    fiberB.rotation.z = -Math.PI / 2
    g.add(fiberB)
    feet(g, 1.4, 0.3)
  },
  instrument(g) {
    box(g, 1.5, 0.7, 0.75, C.body)
    box(g, 1.42, 0.06, 0.6, C.bodyLight, 0, 0.3, 0.06)
    screen(g, 0.8, 0.4, -0.28, 0.02, 0.38, C.cyan)
    for (let i = 0; i < 3; i++) box(g, 0.22, 0.03, 0.02, C.metalDark, -0.55 + i * 0.27, -0.24, 0.39)
    knob(g, 0.42, 0.14, 0.39, 0.11, C.accent)
    knob(g, 0.64, 0.14, 0.39, 0.08)
    knob(g, 0.42, -0.12, 0.39, 0.08)
    lights(g, 0.58, -0.24, 0.4, 3, 0.08)
    feet(g, 1.5, 0.28)
  },
  psu(g) {
    box(g, 1.45, 0.65, 0.75, C.body)
    screen(g, 0.42, 0.26, -0.42, 0.12, 0.38, C.cyan)
    screen(g, 0.42, 0.26, -0.42, -0.16, 0.38, C.amber)
    box(g, 0.45, 0.42, 0.03, C.panel, 0.05, -0.02, 0.38)
    lights(g, -0.1, 0.12, 0.4, 3, 0.08)
    knob(g, 0.45, 0.14, 0.39, 0.11, C.accent)
    knob(g, 0.62, -0.06, 0.39, 0.09)
    knob(g, 0.45, -0.2, 0.39, 0.07)
    feet(g, 1.45, 0.28)
  },
  machine(g) {
    box(g, 1.9, 1.35, 1.3, C.body)
    box(g, 1.75, 1.1, 1.15, C.dark, 0, 0.05, 0)
    box(g, 1.8, 0.12, 1.2, C.bodyLight, 0, 0.62, 0)
    const rail = box(g, 1.55, 0.06, 0.06, C.metal, 0, 0.36, 0.1)
    rail.position.z = 0.05
    box(g, 0.4, 0.26, 0.3, C.metalDark, -0.15, 0.28, 0.05)
    cyl(g, 0.015, 0.015, 0.28, C.pink, -0.15, 0.06, 0.05, 12)
    box(g, 0.55, 0.1, 0.4, C.body, 0.4, -0.4, 0.2)
    lights(g, 0.35, -0.4, 0.42, 4, 0.07)
    screen(g, 0.4, 0.22, 0.4, -0.4, 0.44, C.cyan)
    feet(g, 1.9, 0.5)
  },
  printer3d(g) {
    const frame = 1.15
    for (const x of [-frame / 2, frame / 2]) {
      for (const z of [-frame / 2, frame / 2]) {
        box(g, 0.06, 1.35, 0.06, C.metal, x, 0, z)
      }
    }
    box(g, 1.2, 0.07, 1.2, C.bodyLight, 0, 0.68, 0)
    box(g, 1.2, 0.07, 1.2, C.bodyLight, 0, -0.68, 0)
    box(g, 1.2, 0.06, 0.08, C.metalDark, 0, 0.3, -frame / 2)
    box(g, 0.3, 0.22, 0.3, C.accent, -0.1, 0.16, 0)
    cyl(g, 0.02, 0.02, 0.22, C.pink, -0.1, 0.02, 0, 12)
    box(g, 1.0, 0.06, 1.0, C.panel, 0, -0.6, 0)
    box(g, 0.8, 0.16, 0.8, C.accent, 0, -0.5, 0, {})
    feet(g, 1.2, 0.55)
  },
  handheld(g) {
    box(g, 0.72, 1.15, 0.28, C.body)
    screen(g, 0.56, 0.42, 0, 0.22, 0.15, C.amber)
    knob(g, 0, -0.22, 0.15, 0.13, C.accent)
    lights(g, -0.2, -0.44, 0.15, 3, 0.08)
    const lens = cyl(g, 0.1, 0.11, 0.1, C.dark, 0, 0.62, 0.02)
    lens.rotation.x = Math.PI / 2
    feet(g, 0.72, 0.05)
  },
  camera(g) {
    box(g, 1.1, 0.62, 0.45, C.body)
    box(g, 0.35, 0.16, 0.3, C.bodyLight, -0.28, 0.38, 0)
    const lensA = cyl(g, 0.26, 0.28, 0.5, C.dark, 0, 0, 0.4, 40)
    lensA.rotation.x = Math.PI / 2
    const lensB = cyl(g, 0.2, 0.2, 0.06, C.accent, 0, 0, 0.67, 40)
    lensB.rotation.x = Math.PI / 2
    const lensC = cyl(g, 0.12, 0.12, 0.03, C.cyan, 0, 0, 0.71, 40)
    lensC.rotation.x = Math.PI / 2
    box(g, 0.18, 0.1, 0.18, C.panel, 0.38, 0.3, 0)
    const btn = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), mat(C.pink))
    btn.position.set(0.42, 0.22, 0.16)
    g.add(btn)
    box(g, 0.5, 0.14, 0.3, C.panel, 0, -0.4, 0)
  },
  tripod(g) {
    cyl(g, 0.07, 0.07, 0.5, C.metal, 0, 0.55, 0, 16)
    box(g, 0.32, 0.1, 0.32, C.body, 0, 0.86, 0)
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI * 2) / 3
      const leg = new THREE.Group()
      leg.position.set(0, 0.3, 0)
      leg.rotation.z = Math.sin(a) * 0.42
      leg.rotation.x = Math.cos(a) * 0.42
      cyl(leg, 0.035, 0.035, 1.1, C.metalDark, 0, -0.5, 0, 12)
      g.add(leg)
    }
    box(g, 0.55, 0.16, 0.4, C.body, 0, 1.0, 0)
    cyl(g, 0.1, 0.12, 0.2, C.dark, 0, 1.15, 0.15, 24)
    const k = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), mat(C.pink))
    k.position.set(0.2, 1.08, 0)
    g.add(k)
  },
  mic(g) {
    const body = cyl(g, 0.16, 0.16, 0.85, C.body, 0, 0.35, 0, 32)
    body.rotation.x = 0
    cyl(g, 0.135, 0.135, 0.5, C.bodyLight, 0, 0.42, 0, 32)
    for (let i = 0; i < 8; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.145, 0.006, 6, 32),
        mat(C.dark),
      )
      ring.rotation.x = Math.PI / 2
      ring.position.set(0, 0.24 + i * 0.06, 0)
      g.add(ring)
    }
    cyl(g, 0.2, 0.24, 0.07, C.accent, 0, -0.09, 0, 32)
    cyl(g, 0.05, 0.05, 0.5, C.metalDark, 0, -0.4, 0, 16)
    box(g, 0.4, 0.06, 0.4, C.panel, 0, -0.66, 0)
  },
  ring(g) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.62, 0.09, 16, 64),
      new THREE.MeshStandardMaterial({
        color: C.pink,
        emissive: 0xff9ec6,
        emissiveIntensity: 0.55,
        roughness: 0.4,
      }),
    )
    ring.position.y = 0.28
    g.add(ring)
    cyl(g, 0.16, 0.16, 0.06, C.body, 0, 0.28, 0, 32).rotation.x = Math.PI / 2
    cyl(g, 0.045, 0.045, 0.85, C.metal, 0, -0.32, 0, 16)
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI * 2) / 3
      const leg = new THREE.Group()
      leg.position.set(0, -0.7, 0)
      leg.rotation.z = Math.sin(a) * 0.5
      leg.rotation.x = Math.cos(a) * 0.5
      cyl(leg, 0.026, 0.026, 0.55, C.metalDark, 0, -0.25, 0, 12)
      g.add(leg)
    }
  },
  speaker(g) {
    box(g, 0.8, 1.35, 0.65, C.body)
    const w1 = cyl(g, 0.26, 0.26, 0.06, C.dark, 0, 0.34, 0.33, 40)
    w1.rotation.x = Math.PI / 2
    const w2 = cyl(g, 0.19, 0.19, 0.04, C.accent, 0, 0.34, 0.36, 40)
    w2.rotation.x = Math.PI / 2
    const t1 = cyl(g, 0.15, 0.15, 0.05, C.dark, 0, -0.18, 0.33, 40)
    t1.rotation.x = Math.PI / 2
    const t2 = cyl(g, 0.09, 0.09, 0.04, C.pink, 0, -0.18, 0.35, 40)
    t2.rotation.x = Math.PI / 2
    box(g, 0.4, 0.03, 0.02, C.accent, 0, -0.45, 0.33)
    feet(g, 0.8, 0.2)
  },
  webcam(g) {
    box(g, 1.3, 0.32, 0.32, C.body)
    const l = cyl(g, 0.15, 0.15, 0.08, C.dark, 0, 0, 0.18, 40)
    l.rotation.x = Math.PI / 2
    const l2 = cyl(g, 0.09, 0.09, 0.04, C.cyan, 0, 0, 0.23, 40)
    l2.rotation.x = Math.PI / 2
    lights(g, 0.42, 0, 0.18, 2, 0.1)
    box(g, 0.3, 0.28, 0.18, C.metalDark, 0, -0.18, -0.05)
    box(g, 0.7, 0.04, 0.4, C.panel, 0, -0.35, -0.05)
  },
  projector(g) {
    box(g, 1.4, 0.62, 0.9, C.body)
    const lens = cyl(g, 0.24, 0.26, 0.12, C.dark, -0.45, 0, 0.47, 40)
    lens.rotation.x = Math.PI / 2
    const glass = cyl(g, 0.17, 0.17, 0.03, C.cyan, -0.45, 0, 0.54, 40)
    glass.rotation.x = Math.PI / 2
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.5, 1.4, 32, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xffe6a8,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
      }),
    )
    cone.position.set(-1.2, 0, 0.6)
    cone.rotation.z = Math.PI / 2
    g.add(cone)
    lights(g, 0.35, 0.1, 0.47, 3, 0.09)
    box(g, 0.4, 0.18, 0.03, C.bodyLight, 0.35, -0.12, 0.46)
    feet(g, 1.4, 0.32)
  },
  rework(g) {
    box(g, 1.2, 0.18, 0.9, C.body, 0, -0.5, 0)
    box(g, 0.14, 0.95, 0.14, C.metalDark, -0.45, -0.05, -0.3)
    box(g, 0.8, 0.14, 0.14, C.metal, -0.15, 0.42, -0.3)
    const head = box(g, 0.34, 0.2, 0.3, C.bodyLight, 0.22, 0.32, -0.3)
    head.rotation.y = 0.2
    cyl(g, 0.03, 0.09, 0.3, C.metalDark, 0.22, 0.12, -0.3, 16)
    box(g, 0.45, 0.06, 0.35, C.panel, 0.2, -0.38, 0.05)
    lights(g, -0.3, 0.18, 0.1, 4, 0.09)
    screen(g, 0.4, 0.22, -0.3, 0.18, 0.03, C.amber)
  },
}

export const modelKinds = Object.keys(builders).sort()

export function buildModel(kind = 'instrument') {
  const group = new THREE.Group()
  const builder = builders[kind] || builders.instrument
  builder(group)
  group.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  return group
}
