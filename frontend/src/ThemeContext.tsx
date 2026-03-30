import { createContext } from "react"

export type Theme = 'light' | 'dark';
interface ThemeContextType {
    theme: Theme
    setTheme: React.Dispatch<React.SetStateAction<Theme>>
}

export const ThemeContext = createContext<ThemeContextType | null>(null)