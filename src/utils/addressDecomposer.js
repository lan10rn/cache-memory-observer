/**
 * Address Decomposer Utility
 * Helper functions for bit width calculations and address decomposition
 * into Tag, Index, and Offset fields based on cache geometry.
 */

export function calculateCacheGeometry(config) {
  const {
    mainMemorySizeBytes = 1024, // e.g. 1KB = 1024 Bytes
    cacheSizeBytes = 256,       // e.g. 256 Bytes
    blockSizeBytes = 16,        // e.g. 16 Bytes
    mappingType = 'direct',     // 'direct', 'fully', 'set'
    associativity = 2           // K-way (ignored if direct [1] or fully [Lines])
  } = config;

  const totalAddressBits = Math.ceil(Math.log2(mainMemorySizeBytes));
  const numLines = Math.floor(cacheSizeBytes / blockSizeBytes);

  let numSets = 1;
  let effectiveK = associativity;

  if (mappingType === 'direct') {
    numSets = numLines;
    effectiveK = 1;
  } else if (mappingType === 'fully') {
    numSets = 1;
    effectiveK = numLines;
  } else {
    // Set associative
    const k = Math.max(1, Math.min(numLines, associativity));
    numSets = Math.max(1, Math.floor(numLines / k));
    effectiveK = k;
  }

  const offsetBits = Math.ceil(Math.log2(blockSizeBytes));
  const indexBits = Math.ceil(Math.log2(numSets));
  const tagBits = Math.max(0, totalAddressBits - indexBits - offsetBits);

  return {
    mainMemorySizeBytes,
    cacheSizeBytes,
    blockSizeBytes,
    numLines,
    numSets,
    associativity: effectiveK,
    totalAddressBits,
    tagBits,
    indexBits,
    offsetBits
  };
}

export function decomposeAddress(addressInput, geometry) {
  // Parse address input (accept hex string like "0x1A", decimal number, or binary string)
  let numericAddr = 0;

  if (typeof addressInput === 'number') {
    numericAddr = addressInput;
  } else if (typeof addressInput === 'string') {
    const trimmed = addressInput.trim();
    if (trimmed.startsWith('0x') || trimmed.startsWith('0X')) {
      numericAddr = parseInt(trimmed, 16);
    } else if (trimmed.startsWith('0b') || trimmed.startsWith('0B')) {
      numericAddr = parseInt(trimmed.slice(2), 2);
    } else if (/^[01]+$/.test(trimmed) && trimmed.length > 4) {
      numericAddr = parseInt(trimmed, 2);
    } else {
      numericAddr = parseInt(trimmed, 10);
    }
  }

  if (isNaN(numericAddr) || numericAddr < 0) {
    numericAddr = 0;
  }

  // Cap within memory bounds
  const maxAddr = geometry.mainMemorySizeBytes - 1;
  const boundedAddr = numericAddr % geometry.mainMemorySizeBytes;

  // Convert to fixed-width binary string
  const totalBits = geometry.totalAddressBits;
  let binaryStr = boundedAddr.toString(2).padStart(totalBits, '0');
  
  // Truncate if larger than totalBits
  if (binaryStr.length > totalBits) {
    binaryStr = binaryStr.slice(binaryStr.length - totalBits);
  }

  const { tagBits, indexBits, offsetBits } = geometry;

  // Extract slices: [Tag] [Index] [Offset]
  const tagBin = binaryStr.slice(0, tagBits) || '0';
  const indexBin = indexBits > 0 ? binaryStr.slice(tagBits, tagBits + indexBits) : '';
  const offsetBin = offsetBits > 0 ? binaryStr.slice(tagBits + indexBits) : '';

  const tagVal = parseInt(tagBin, 2) || 0;
  const indexVal = indexBits > 0 ? (parseInt(indexBin, 2) || 0) : 0;
  const offsetVal = offsetBits > 0 ? (parseInt(offsetBin, 2) || 0) : 0;

  const blockNumber = Math.floor(boundedAddr / geometry.blockSizeBytes);

  return {
    rawInput: addressInput,
    addressDec: boundedAddr,
    addressHex: `0x${boundedAddr.toString(16).toUpperCase().padStart(Math.ceil(totalBits / 4), '0')}`,
    binaryStr,
    tagBin,
    indexBin,
    offsetBin,
    tagVal,
    indexVal,
    offsetVal,
    blockNumber,
    tagHex: `0x${tagVal.toString(16).toUpperCase()}`,
    indexHex: indexBits > 0 ? `0x${indexVal.toString(16).toUpperCase()}` : 'N/A'
  };
}
