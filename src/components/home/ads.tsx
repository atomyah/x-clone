import Image from 'next/image';
import type { Ad } from '@/types/post';

interface AdsProps {
  ads: Ad[];
}

export function Ads({ ads }: AdsProps) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-3 text-zinc-400 dark:text-zinc-500">広告</h2>
      {ads.map((ad) => (
        <a
          key={ad.id}
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block mb-4 last:mb-0 hover:opacity-90 transition-opacity"
        >
          {ad.image && (
            <div className="relative w-full max-w-full mx-auto aspect-5/4 mb-2 rounded overflow-hidden">
              <Image
                src={ad.image}
                alt={ad.title || '広告'}
                fill
                className="object-contain"
                sizes="240px"
              />
            </div>
          )}
          {ad.title && (
            <p className="text-sm font-medium text-zinc-400/90 dark:text-zinc-500 truncate">
              {ad.title}
            </p>
          )}
        </a>
      ))}
    </div>
  );
}
