import { Link } from '@/i18n/routing';

/** Tab dạng viên thuốc nối các trang cùng một mục menu (VD Khám phá: Địa điểm | Lịch trình; Cộng đồng: Câu chuyện | Bài viết | Theo dõi). */
export function PageTabs({ tabs, active, label }: { tabs: { href: string; label: string }[]; active: string; label: string }) {
  return (
    <nav aria-label={label} className="no-scrollbar mb-4 inline-flex max-w-full overflow-x-auto rounded-full border border-border bg-card p-1 lg:mb-5">
      {tabs.map(({ href, label: text }) => (
        <Link key={href} href={href} aria-current={href === active ? 'page' : undefined}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
            href === active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
          {text}
        </Link>
      ))}
    </nav>
  );
}
