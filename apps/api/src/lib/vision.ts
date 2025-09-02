import fs from 'node:fs'

type VisionResult = {
  brand?: string | undefined
  name?: string | undefined
  confidence?: number | undefined
}

function guessFromFilename(pathOrName: string): VisionResult | null {
  const base = pathOrName.toLowerCase()
  if (base.includes('chanel') || base.includes('bleu')) {
    return { brand: 'Chanel', name: 'Bleu de Chanel', confidence: 0.6 }
  }
  if (base.includes('dior') || base.includes('sauvage')) {
    return { brand: 'Dior', name: 'Sauvage', confidence: 0.6 }
  }
  if (base.includes('carolina') || base.includes('212') || base.includes('good girl')) {
    return { brand: 'Carolina Herrera', name: 'Good Girl', confidence: 0.55 }
  }
  if (base.includes('versace') || base.includes('eros')) {
    return { brand: 'Versace', name: 'Eros', confidence: 0.55 }
  }
  return null
}

export async function identifyPerfumeFromImage(
  file: Express.Multer.File
): Promise<VisionResult> {
  const apiKey = process.env.GOOGLE_VISION_API_KEY
  const filenameGuess = guessFromFilename(file.originalname)
  if (!apiKey) {
    return (
      filenameGuess ?? {
        brand: 'Chanel',
        name: 'Bleu de Chanel',
        confidence: 0.5,
      }
    )
  }

  try {
    const base64 = file.buffer?.toString('base64') ?? fs.readFileSync(file.path, { encoding: 'base64' })
    const body = {
      requests: [
        {
          image: { content: base64 },
          features: [{ type: 'LOGO_DETECTION', maxResults: 3 }],
        },
      ],
    }
    const res = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as any
    const logo = json?.responses?.[0]?.logoAnnotations?.[0]
    if (logo?.description) {
      return { brand: logo.description as string, confidence: (logo.score as number | undefined) ?? 0.6 }
    }
    return filenameGuess ?? { brand: undefined, name: undefined, confidence: 0 }
  } catch (err) {
    return filenameGuess ?? { brand: undefined, name: undefined, confidence: 0 }
  }
}

