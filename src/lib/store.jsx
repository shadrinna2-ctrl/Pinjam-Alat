import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import {
  categories as seedCategories,
  defaultAdminUsers,
  defaultSettings,
  products as seedProducts,
} from '../data/catalog.js'
import {
  addDaysISO,
  orderCode,
  rentalDays,
  rangesOverlap,
  slugify,
  todayISO,
} from './format.js'

const STORAGE_KEY = 'pinjamalat:v2'
const SESSION_KEY = 'pinjamalat:session'
const ATTEMPT_KEY = 'pinjamalat:attempts'

const clone = (value) => JSON.parse(JSON.stringify(value))

const daysAgo = (n) => addDaysISO(todayISO(), -n)

function demoOrders() {
  const build = (id, offset, status, startOffset, days, items, notes = '') => {
    const startDate = addDaysISO(todayISO(), startOffset)
    const endDate = addDaysISO(startDate, days - 1)
    const lines = items.map(([productId, qty]) => {
      const product = seedProducts.find((p) => p.id === productId)
      const price = product.rentalPrice
      return {
        productId,
        name: product.name,
        sku: product.sku,
        price,
        qty,
        days,
        subtotal: price * qty * days,
      }
    })
    const subtotal = lines.reduce((sum, l) => sum + l.subtotal, 0)
    const code = `PA-${addDaysISO(todayISO(), -offset).slice(2).replace(/-/g, '')}-${String(1000 + id)}`
    return {
      id,
      code,
      customer: {
        name: ['Rani Prasetya', 'Dimas Nugroho', 'Salsabila Putri', 'Fajar Ramadhan', 'Nadia Kusuma', 'Yoga Pratama', 'Intan Maharani', 'Rizal Firmansyah'][id % 8],
        phone: ['6281234500011', '6281234500022', '6281234500033', '6281234500044', '6281234500055', '6281234500066', '6281234500077', '6281234500088'][id % 8],
        email: ['rani@kampus.ac.id', 'dimas@kampus.ac.id', 'salsa@kampus.ac.id', 'fajar@kampus.ac.id', 'nadia@kampus.ac.id', 'yoga@kampus.ac.id', 'intan@kampus.ac.id', 'rizal@kampus.ac.id'][id % 8],
        address: 'Laboratorium Terpadu, Kampus Utama',
      },
      startDate,
      endDate,
      days,
      items: lines,
      subtotal,
      additionalCost: 0,
      discount: 0,
      total: subtotal,
      status,
      purpose: 'Praktikum dan penelitian mahasiswa',
      notes,
      adminNote: '',
      createdAt: daysAgo(offset),
      updatedAt: daysAgo(Math.max(0, offset - 1)),
    }
  }

  return [
    build(101, 1, 'menunggu', 3, 3, [[17, 2], [20, 2]]),
    build(102, 2, 'dikonfirmasi', 4, 2, [[12, 1], [13, 2]], 'Butuh kabel UTP tambahan'),
    build(103, 4, 'dipinjam', -1, 4, [[27, 1]]),
    build(104, 7, 'selesai', -10, 3, [[1, 2], [2, 1]]),
    build(105, 12, 'selesai', -16, 5, [[17, 3], [19, 2]]),
    build(106, 20, 'dibatalkan', -8, 2, [[15, 1]]),
    build(107, 28, 'selesai', -34, 7, [[22, 1]]),
    build(108, 42, 'selesai', -50, 4, [[6, 1], [7, 1], [9, 1]]),
    build(109, 55, 'selesai', -62, 3, [[23, 1]]),
    build(110, 70, 'selesai', -78, 2, [[20, 4]]),
  ]
}

const seedMaintenance = [
  {
    id: 1,
    productId: 17,
    quantity: 1,
    startDate: daysAgo(2),
    endDate: addDaysISO(todayISO(), 5),
    description: 'Kalibrasi probe dan penggantian kabel kanal 2.',
    status: 'perawatan',
    createdBy: 'admin',
    createdAt: daysAgo(2),
  },
  {
    id: 2,
    productId: 2,
    quantity: 1,
    startDate: daysAgo(20),
    endDate: daysAgo(6),
    description: 'Penggantian kipas rak server.',
    status: 'selesai',
    createdBy: 'admin',
    createdAt: daysAgo(20),
  },
]

function seedState() {
  return {
    products: clone(seedProducts),
    categories: clone(seedCategories),
    orders: demoOrders(),
    maintenance: clone(seedMaintenance),
    settings: { ...defaultSettings },
    adminUsers: clone(defaultAdminUsers),
    logs: [
      {
        id: 1,
        userId: 'admin',
        action: 'login',
        entityType: 'session',
        entityId: 0,
        description: 'Admin masuk ke dashboard',
        ip: '127.0.0.1',
        createdAt: new Date().toISOString(),
      },
    ],
    cart: [],
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedState()
    const parsed = JSON.parse(raw)
    const base = seedState()
    return {
      ...base,
      ...parsed,
      settings: { ...base.settings, ...(parsed.settings || {}) },
      products: parsed.products?.length ? parsed.products : base.products,
      categories: parsed.categories?.length ? parsed.categories : base.categories,
    }
  } catch {
    return seedState()
  }
}

function nextId(list) {
  return list.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
}

function reducer(state, action) {
  switch (action.type) {
    case 'cart/add': {
      const { product, qty, startDate, endDate } = action.payload
      const existing = state.cart.find((line) => line.productId === product.id)
      const cart = existing
        ? state.cart.map((line) =>
            line.productId === product.id
              ? { ...line, qty: Math.min(product.stockTotal, line.qty + qty), startDate, endDate }
              : line,
          )
        : [
            ...state.cart,
            {
              productId: product.id,
              name: product.name,
              slug: product.slug,
              sku: product.sku,
              price: product.rentalPrice,
              qty,
              stockTotal: product.stockTotal,
              startDate,
              endDate,
            },
          ]
      return { ...state, cart }
    }
    case 'cart/qty': {
      const cart = state.cart
        .map((line) =>
          line.productId === action.payload.productId
            ? { ...line, qty: Math.max(1, Math.min(line.stockTotal, action.payload.qty)) }
            : line,
        )
        .filter((line) => line.qty > 0)
      return { ...state, cart }
    }
    case 'cart/dates': {
      const cart = state.cart.map((line) => ({ ...line, startDate: action.payload.startDate, endDate: action.payload.endDate }))
      return { ...state, cart }
    }
    case 'cart/remove':
      return { ...state, cart: state.cart.filter((line) => line.productId !== action.payload.productId) }
    case 'cart/clear':
      return { ...state, cart: [] }
    case 'order/create':
      return { ...state, orders: [action.payload, ...state.orders], cart: [] }
    case 'order/status':
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id
            ? {
                ...order,
                status: action.payload.status,
                adminNote: action.payload.adminNote ?? order.adminNote,
                updatedAt: new Date().toISOString(),
              }
            : order,
        ),
      }
    case 'product/save': {
      const payload = action.payload
      const exists = state.products.some((p) => p.id === payload.id)
      const withSlug = {
        ...payload,
        slug: payload.slug ? slugify(payload.slug) : slugify(payload.name),
        updatedAt: new Date().toISOString(),
      }
      return {
        ...state,
        products: exists
          ? state.products.map((p) => (p.id === payload.id ? { ...p, ...withSlug } : p))
          : [{ ...withSlug, id: nextId(state.products), createdAt: new Date().toISOString() }, ...state.products],
      }
    }
    case 'product/delete':
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload ? { ...p, status: 'nonaktif' } : p,
        ),
      }
    case 'product/restore':
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload ? { ...p, status: 'aktif' } : p,
        ),
      }
    case 'category/save': {
      const payload = action.payload
      const exists = state.categories.some((c) => c.id === payload.id)
      const withSlug = { ...payload, slug: payload.slug ? slugify(payload.slug) : slugify(payload.name) }
      return {
        ...state,
        categories: exists
          ? state.categories.map((c) => (c.id === payload.id ? { ...c, ...withSlug } : c))
          : [...state.categories, { ...withSlug, id: nextId(state.categories) }],
      }
    }
    case 'category/toggle':
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload ? { ...c, status: !c.status } : c,
        ),
      }
    case 'maintenance/add':
      return {
        ...state,
        maintenance: [{ ...action.payload, id: nextId(state.maintenance) }, ...state.maintenance],
      }
    case 'maintenance/finish':
      return {
        ...state,
        maintenance: state.maintenance.map((m) =>
          m.id === action.payload ? { ...m, status: 'selesai' } : m,
        ),
      }
    case 'settings/save':
      return { ...state, settings: { ...state.settings, ...action.payload } }
    case 'admin/save': {
      const payload = action.payload
      const exists = state.adminUsers.some((u) => u.id === payload.id)
      return {
        ...state,
        adminUsers: exists
          ? state.adminUsers.map((u) => (u.id === payload.id ? { ...u, ...payload } : u))
          : [{ ...payload, id: nextId(state.adminUsers) }, ...state.adminUsers],
      }
    }
    case 'admin/toggle':
      return {
        ...state,
        adminUsers: state.adminUsers.map((u) =>
          u.id === action.payload ? { ...u, status: !u.status } : u,
        ),
      }
    case 'log/add':
      return {
        ...state,
        logs: [{ ...action.payload, id: nextId(state.logs) }, ...state.logs].slice(0, 200),
      }
    case 'state/reset':
      return seedState()
    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const [session, setSession] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* kuota penyimpanan habis — data tetap hidup di memori */
    }
  }, [state])

  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    else localStorage.removeItem(SESSION_KEY)
  }, [session])

  const toast = (message, tone = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((list) => [...list, { id, message, tone }])
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 3600)
  }

  const value = useMemo(() => {
    const activeProducts = state.products.filter((p) => p.status === 'aktif')

    const maintenanceUnits = (productId, start, end) =>
      state.maintenance
        .filter(
          (m) =>
            m.productId === productId &&
            m.status === 'perawatan' &&
            (!start || !end || rangesOverlap(m.startDate, m.endDate, start, end)),
        )
        .reduce((sum, m) => sum + Number(m.quantity || 1), 0)

    const rentedUnits = (productId, start, end) =>
      state.orders
        .filter(
          (o) =>
            ['dikonfirmasi', 'dipinjam'].includes(o.status) &&
            (!start || !end || rangesOverlap(o.startDate, o.endDate, start, end)),
        )
        .flatMap((o) => o.items)
        .filter((item) => item.productId === productId)
        .reduce((sum, item) => sum + Number(item.qty || 0), 0)

    const availableFor = (productId, start, end) => {
      const product = state.products.find((p) => p.id === Number(productId))
      if (!product) return 0
      const value =
        Number(product.stockTotal) -
        maintenanceUnits(productId, start, end) -
        rentedUnits(productId, start, end)
      return Math.max(0, value)
    }

    const productById = (id) => state.products.find((p) => p.id === Number(id))
    const productBySlug = (slug) => state.products.find((p) => p.slug === slug)
    const categoryBySlug = (slug) => state.categories.find((c) => c.slug === slug)

    const logAction = (action, entityType, entityId, description) => {
      dispatch({
        type: 'log/add',
        payload: {
          userId: session?.username || 'system',
          action,
          entityType,
          entityId,
          description,
          ip: '127.0.0.1',
          createdAt: new Date().toISOString(),
        },
      })
    }

    const login = (username, password) => {
      let attempts = { count: 0, until: 0 }
      try {
        attempts = JSON.parse(localStorage.getItem(ATTEMPT_KEY) || '{}')
      } catch {
        /* abaikan */
      }
      if (attempts.until && Date.now() < attempts.until) {
        const secs = Math.ceil((attempts.until - Date.now()) / 1000)
        return { ok: false, error: `Terlalu banyak percobaan. Coba lagi dalam ${secs} detik.` }
      }
      const user = state.adminUsers.find(
        (u) => u.username.toLowerCase() === String(username).trim().toLowerCase(),
      )
      if (!user || user.password !== password) {
        const count = (attempts.count || 0) + 1
        const locked = count >= 5 ? Date.now() + 60_000 : 0
        localStorage.setItem(ATTEMPT_KEY, JSON.stringify({ count, until: locked }))
        return {
          ok: false,
          error: locked
            ? 'Percobaan login melebihi batas. Tunggu 60 detik.'
            : `Username atau password salah. Sisa percobaan: ${Math.max(0, 5 - count)}.`,
        }
      }
      if (!user.status) return { ok: false, error: 'Akun admin ini sedang dinonaktifkan.' }
      localStorage.removeItem(ATTEMPT_KEY)
      setSession({ username: user.username, name: user.name, role: user.role, loginAt: Date.now() })
      dispatch({
        type: 'log/add',
        payload: {
          userId: user.username,
          action: 'login',
          entityType: 'session',
          entityId: user.id,
          description: `${user.name} masuk ke dashboard`,
          ip: '127.0.0.1',
          createdAt: new Date().toISOString(),
        },
      })
      return { ok: true }
    }

    const logout = () => setSession(null)

    const createOrder = (form) => {
      const days = rentalDays(form.startDate, form.endDate)
      if (!days) return { ok: false, error: 'Tanggal selesai harus sama atau setelah tanggal mulai.' }
      if (!state.cart.length) return { ok: false, error: 'Keranjang masih kosong.' }

      for (const line of state.cart) {
        const available = availableFor(line.productId, form.startDate, form.endDate)
        if (line.qty > available) {
          const product = productById(line.productId)
          return {
            ok: false,
            error: `Stok ${product?.name || line.name} tidak mencukupi untuk tanggal tersebut (tersedia ${available} unit).`,
          }
        }
      }

      const items = state.cart.map((line) => ({
        productId: line.productId,
        name: line.name,
        sku: line.sku,
        price: line.price,
        qty: line.qty,
        days,
        subtotal: line.price * line.qty * days,
      }))
      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
      const order = {
        id: nextId(state.orders),
        code: orderCode(),
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: (form.email || '').trim(),
          address: (form.address || '').trim(),
        },
        startDate: form.startDate,
        endDate: form.endDate,
        days,
        items,
        subtotal,
        additionalCost: 0,
        discount: 0,
        total: subtotal,
        status: 'menunggu',
        purpose: (form.purpose || '').trim(),
        notes: (form.notes || '').trim(),
        adminNote: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      dispatch({ type: 'order/create', payload: order })
      return { ok: true, order }
    }

    const findOrder = (code, phone) =>
      state.orders.find(
        (order) =>
          order.code.toLowerCase() === String(code).trim().toLowerCase() &&
          order.customer.phone.replace(/\D/g, '').endsWith(String(phone).replace(/\D/g, '')),
      )

    const customers = Object.values(
      state.orders.reduce((acc, order) => {
        const key = order.customer.phone
        if (!acc[key]) {
          acc[key] = {
            name: order.customer.name,
            phone: order.customer.phone,
            email: order.customer.email,
            address: order.customer.address,
            orderCount: 0,
            totalSpent: 0,
            lastStatus: order.status,
            lastOrderAt: order.createdAt,
            orders: [],
          }
        }
        acc[key].orderCount += 1
        acc[key].totalSpent += order.status !== 'dibatalkan' ? order.total : 0
        acc[key].orders.push(order)
        if (new Date(order.createdAt) > new Date(acc[key].lastOrderAt)) {
          acc[key].lastOrderAt = order.createdAt
          acc[key].lastStatus = order.status
        }
        return acc
      }, {}),
    ).sort((a, b) => new Date(b.lastOrderAt) - new Date(a.lastOrderAt))

    return {
      ...state,
      cartCount: state.cart.reduce((sum, line) => sum + line.qty, 0),
      session,
      toasts,
      toast,
      activeProducts,
      productById,
      productBySlug,
      categoryBySlug,
      availableFor,
      maintenanceUnits,
      rentedUnits,
      customers,
      login,
      logout,
      createOrder,
      findOrder,
      logAction,
      dispatch,
      resetDemo: () => {
        localStorage.removeItem(STORAGE_KEY)
        dispatch({ type: 'state/reset' })
        toast('Data demo dikembalikan ke kondisi awal.')
      },
    }
  }, [state, session, toasts])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp harus dipakai di dalam AppProvider')
  return context
}

export const STATUS_META = {
  menunggu: { label: 'Menunggu konfirmasi', className: 'bg-[#FFF4DC] text-[#A36C00]' },
  dikonfirmasi: { label: 'Dikonfirmasi', className: 'bg-[#E8F5FF] text-[#2873B5]' },
  dipinjam: { label: 'Sedang dipinjam', className: 'bg-purpleSoft text-[#6755E9]' },
  selesai: { label: 'Selesai', className: 'bg-[#E6F8EF] text-[#16834B]' },
  dibatalkan: { label: 'Dibatalkan', className: 'bg-[#FFF0F2] text-[#D34C70]' },
}
