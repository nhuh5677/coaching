import { useEffect, useState } from 'react'
import { subscribeProduct, subscribeProducts } from './products'

export function useProducts() {
  const [state, setState] = useState({ products: [], loading: true, error: null })
  useEffect(
    () => subscribeProducts(
      (products) => setState({ products, loading: false, error: null }),
      (error) => setState((s) => ({ ...s, loading: false, error })),
    ),
    [],
  )
  return state
}

export function useProduct(id) {
  const [state, setState] = useState({ product: null, loading: true, error: null })
  useEffect(() => {
    setState({ product: null, loading: true, error: null })
    return subscribeProduct(
      id,
      (product) => setState({ product, loading: false, error: null }),
      (error) => setState({ product: null, loading: false, error }),
    )
  }, [id])
  return state
}
