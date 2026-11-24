import { addDaysISO, todayISO } from './format.js'
import { useApp } from './store.jsx'

export function useAddToCart() {
  const { dispatch, toast } = useApp()
  return (product, qty = 1) => {
    const startDate = todayISO()
    const endDate = addDaysISO(startDate, 1)
    dispatch({ type: 'cart/add', payload: { product, qty, startDate, endDate } })
    toast(`${product.name} ditambahkan ke keranjang.`)
  }
}
