// utils/validation.ts
export const isValidUrl = (url: string) => {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}
