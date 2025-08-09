"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";
const FALLBACK = "/placeholder.webp";
export default function SafeImage(props: ImageProps & { fallbackSrc?: string }) {
  const { fallbackSrc, ...rest } = props;
  const [src, setSrc] = useState(rest.src);
  return <Image {...rest} src={src} onError={() => setSrc(fallbackSrc ?? FALLBACK)} unoptimized />;
}