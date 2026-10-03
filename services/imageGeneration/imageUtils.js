/**
 * Image Utilities - Dimension extraction and format inspection for JPEG, PNG, WebP
 */

export function getImageDimensions(buffer) {
  if (!buffer || buffer.length < 16) return null;

  // 1. PNG check: 89 50 4E 47 0D 0A 1A 0A
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    if (buffer.length >= 24) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height, format: 'png' };
    }
  }

  // 2. JPEG check: FF D8
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
    let offset = 2;
    while (offset < buffer.length - 8) {
      if (buffer[offset] !== 0xFF) {
        offset++;
        continue;
      }
      const marker = buffer[offset + 1];
      // Baseline, Progressive, and other SOF markers (excluding DHT, DQT, etc.)
      const isSof = (marker >= 0xC0 && marker <= 0xC3) ||
                    (marker >= 0xC5 && marker <= 0xC7) ||
                    (marker >= 0xC9 && marker <= 0xCB) ||
                    (marker >= 0xCD && marker <= 0xCF);
      if (isSof) {
        const height = buffer.readUInt16BE(offset + 5);
        const width = buffer.readUInt16BE(offset + 7);
        return { width, height, format: 'jpeg' };
      }
      const len = buffer.readUInt16BE(offset + 2);
      if (len <= 0) break;
      offset += 2 + len;
    }
  }

  // 3. WebP check: RIFF .... WEBP
  if (buffer.slice(0, 4).toString('ascii') === 'RIFF' && buffer.slice(8, 12).toString('ascii') === 'WEBP') {
    const formatChunk = buffer.slice(12, 16).toString('ascii');
    if (formatChunk === 'VP8 ' && buffer.length >= 30) {
      const width = buffer.readUInt16LE(26) & 0x3fff;
      const height = buffer.readUInt16LE(28) & 0x3fff;
      return { width, height, format: 'webp' };
    } else if (formatChunk === 'VP8L' && buffer.length >= 25) {
      const b1 = buffer[21];
      const b2 = buffer[22];
      const b3 = buffer[23];
      const b4 = buffer[24];
      const width = 1 + (((b2 & 0x3f) << 8) | b1);
      const height = 1 + (((b4 & 0xf) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6));
      return { width, height, format: 'webp' };
    } else if (formatChunk === 'VP8X' && buffer.length >= 30) {
      const width = 1 + buffer.readUIntLE(24, 3);
      const height = 1 + buffer.readUIntLE(27, 3);
      return { width, height, format: 'webp' };
    }
  }

  return null;
}
