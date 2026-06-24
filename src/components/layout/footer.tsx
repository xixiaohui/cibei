import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold mb-3">慈悲空间</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              深入经藏，智慧如海。<br />
              现代佛学研究与经典学习平台。
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">探索</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/sutras" className="hover:text-foreground transition-colors">经典库</Link></li>
              <li><Link href="/dictionary" className="hover:text-foreground transition-colors">佛学词典</Link></li>
              <li><Link href="/encyclopedia" className="hover:text-foreground transition-colors">百科</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">关于</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              本站内容仅供学术研究与学习参考，不替代法师指导与宗教实践。
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} 慈悲空间 Cibei Space. 仅限学术研究与学习用途。
        </div>
      </div>
    </footer>
  );
}
