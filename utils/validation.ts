// utils/validation.ts
export const isValidUrl = (url: string) => {
    const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4)
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$','i'
    )
    return pattern.test(url)
}
