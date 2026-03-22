import axios from 'axios';

/**
 * Converte qualquer link do Google Drive em um link de stream direto
 * (compatível com <img> e embed em PDF/DOCX).
 *
 * @param url - URL original do Google Drive
 * @returns URL de stream direto
 */
export function converterUrlDrive(url: string): string {
  if (!url || typeof url !== 'string') return url;

  if (url.includes('uc?export=view') || url.includes('uc?id=')) {
    return url;
  }

  const matchFileView = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileView) {
    return `https://drive.google.com/uc?export=view&id=${matchFileView[1]}`;
  }

  const matchOpen = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchOpen) {
    return `https://drive.google.com/uc?export=view&id=${matchOpen[1]}`;
  }

  return url;
}

/**
 * Faz o download de uma imagem do Google Drive e retorna um Buffer (Node.js) ou ArrayBuffer (Edge).
 *
 * @param url - URL do Google Drive
 * @returns ArrayBuffer com os bytes da imagem
 */
export async function downloadImagemDrive(url: string): Promise<ArrayBuffer> {
  const urlConvertida = converterUrlDrive(url);

  const response = await axios.get(urlConvertida, {
    responseType: 'arraybuffer',
    timeout: 15000,
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
  });

  return response.data;
}

export function detectarTipoImagem(url: string, contentType?: string): string {
  if (contentType) {
    if (contentType.includes('png')) return 'png';
    if (contentType.includes('gif')) return 'gif';
    if (contentType.includes('webp')) return 'webp';
    return 'jpeg';
  }
  if (url.includes('.png')) return 'png';
  if (url.includes('.gif')) return 'gif';
  return 'jpeg';
}
