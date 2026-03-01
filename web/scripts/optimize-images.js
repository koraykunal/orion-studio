async function optimizeImages() {
    const {default: sharp} = await import("sharp")
    const fs = await import("node:fs")
    const path = await import("node:path")

    const inputDir = path.join(__dirname, "../public/p_images")
    const outputDir = path.join(__dirname, "../public/p_images_optimized")

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, {recursive: true})
    }

    const files = fs.readdirSync(inputDir).filter((file) => file.endsWith(".jpg"))

    console.log(`Optimizing ${files.length} images...`)

    for (const file of files) {
        const inputPath = path.join(inputDir, file)
        const outputPath = path.join(outputDir, file.replace(".jpg", ".webp"))

        const stats = fs.statSync(inputPath)
        const originalSize = (stats.size / 1024).toFixed(0)

        await sharp(inputPath)
            .resize(800, null, {withoutEnlargement: true})
            .webp({quality: 80})
            .toFile(outputPath)

        const newStats = fs.statSync(outputPath)
        const newSize = (newStats.size / 1024).toFixed(0)
        const savings = ((1 - newStats.size / stats.size) * 100).toFixed(0)

        console.log(`${file}: ${originalSize}KB -> ${newSize}KB (${savings}% saved)`)
    }

    console.log("\nDone! Images saved to public/p_images_optimized/")
    console.log("Update Portfolio.tsx to use .webp extension")
}

optimizeImages().catch((error) => {
    console.error(error)
    process.exit(1)
})
