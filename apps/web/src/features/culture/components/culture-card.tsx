import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { CultureTopic } from '../culture-topics';

/** Thẻ chủ đề văn hóa: ảnh 4:3, chip nhóm, tiêu đề serif, tóm tắt 2 dòng → trang chủ đề. */
export function CultureCard({ topic }: { topic: CultureTopic }) {
  const t = useTranslations('culture');
  return (
    <Link href={`/culture/${topic.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-editorial transition hover:border-primary/40">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <Image src={topic.image} alt={t(`topics.${topic.key}.title`)} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 80vw"
            className="object-cover transition duration-700 group-hover:scale-105" />
          <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold backdrop-blur">{t(`groups.${topic.group}`)}</span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-display text-xl font-medium">{t(`topics.${topic.key}.title`)}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{t(`topics.${topic.key}.summary`)}</p>
          <span className="mt-auto pt-3 text-sm font-semibold text-primary">{t('readMore')} →</span>
        </div>
      </article>
    </Link>
  );
}
