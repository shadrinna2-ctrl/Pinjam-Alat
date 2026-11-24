import React from 'react'
import { AppProvider, useApp } from './lib/store.jsx'
import { useHashRoute } from './lib/router.js'
import SiteHeader from './components/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import Toasts from './components/Toasts.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import Categories from './pages/Categories.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderStatus from './pages/OrderStatus.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import AdminApp from './admin/AdminApp.jsx'

function NotFound() {
  return (
    <div className="container-page py-20 text-center">
      <span className="font-display text-5xl font-bold text-purple/30">404</span>
      <h1 className="mt-2 font-display text-2xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-sm text-muted">Tautan mungkin sudah berubah atau alat telah dihapus admin.</p>
      <a href="#/" className="btn-primary mt-6">Kembali ke beranda</a>
      <a href="#/katalog" className="btn-outline mt-6 ml-2">Buka katalog</a>
    </div>
  )
}

function Shell() {
  const route = useHashRoute()
  const { cartCount } = useApp()
  const [first, second] = route.segments

  if (first === 'admin') {
    return (
      <>
        <AdminApp route={route} />
        <Toasts />
      </>
    )
  }

  let page
  if (!first) page = <Home />
  else if (first === 'katalog') page = <Catalog query={route.query} />
  else if (first === 'kategori') page = <Categories />
  else if (first === 'alat' && second) page = <ProductDetail slug={second} />
  else if (first === 'keranjang') page = <Cart />
  else if (first === 'checkout') page = <Checkout />
  else if (first === 'status') page = <OrderStatus />
  else if (first === 'tentang') page = <About />
  else if (first === 'kontak') page = <Contact />
  else page = <NotFound />

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader path={route.path} cartCount={cartCount} />
      <main className="flex-1">{page}</main>
      <SiteFooter />
      <Toasts />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
