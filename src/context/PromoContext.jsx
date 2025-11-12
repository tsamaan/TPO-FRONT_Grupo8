import React, { createContext, useContext } from 'react'

const PromoContext = createContext()

export const usePromos = () => {
  const context = useContext(PromoContext)
  if (!context) {
    throw new Error('usePromos debe ser usado dentro de un PromoProvider')
  }
  return context
}

export const PromoProvider = ({ children }) => {
  const promos = [
    "¡TODA LA WEB CON DESCUENTOS IMPERDIBLES!",
    "Envio gratis en compras mayores a $20.000",
    "3 y 6 cuotas sin interes"
  ]

  return (
    <PromoContext.Provider value={{ promos }}>
      {children}
    </PromoContext.Provider>
  )
}
