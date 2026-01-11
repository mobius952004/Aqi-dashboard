import { createContext, useContext } from "react"

export const WardHistoryContext = createContext(null)

export const useWardHistoryContext = () => {
  return useContext(WardHistoryContext)
}
