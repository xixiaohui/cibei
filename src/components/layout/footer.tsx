import Link from "next/link";
import { ExternalLink } from "lucide-react";

const internalLinks = [
  { href: "/sutras", label: "经典库" },
  { href: "/stories", label: "佛经故事" },
  { href: "/dictionary", label: "佛学词典" },
  { href: "/encyclopedia", label: "百科" },
  { href: "/paths", label: "学习路径" },
  { href: "/timeline", label: "时间线" },
];

const externalLinks = [
  {
    href: "https://cbetaonline.dila.edu.tw",
    label: "CBETA 中华电子佛典",
    desc: "最完整的汉文大藏经数字化",
  },
  {
    href: "https://21dzk.l.u-tokyo.ac.jp/SAT/",
    label: "SAT 大正藏数据库",
    desc: "东京大学大藏经全文检索",
  },
  {
    href: "https://buddhism.lib.ntu.edu.tw",
    label: "台大佛学数位图书馆",
    desc: "最全面的中文佛学期刊与论文索引",
  },
  {
    href: "https://buddhism.dila.edu.tw",
    label: "法鼓佛学数位典藏",
    desc: "CBETA 全文高级检索与辞典整合",
  },
  {
    href: "https://suttacentral.net",
    label: "SuttaCentral 多语佛典",
    desc: "巴利、梵、汉多语对照早期佛典",
  },
  {
    href: "https://84000.co",
    label: "84000 佛典传译",
    desc: "藏文大藏经英译国际学术项目",
  },
  {
    href: "https://gaya.org.tw/library",
    label: "香光尼众佛学院图书馆",
    desc: "台湾佛学经论藏书与数位资源",
  },
  {
    href: "https://etext.fgs.org.tw",
    label: "佛光山电子大藏经",
    desc: "大正藏、卍续藏全文检索",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="lg:pr-4">
            <Link href="/" className="inline-block mb-5">
              <img src="/logo.png" alt="慈悲空间" className="h-17 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              深入经藏，智慧如海。
            </p>
            <p className="text-xs text-muted-foreground/60 leading-relaxed">
              现代佛学研究与经典学习平台
            </p>
          </div>

          {/* Content modules */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest mb-6">
              探索
            </h4>
            <ul className="space-y-3.5">
              {internalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External resources */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest mb-6">
              外链推荐
            </h4>
            <ul className="space-y-4">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                      {link.label}
                      <ExternalLink className="h-3 w-3 shrink-0 opacity-40 group-hover:opacity-70 transition-opacity" />
                    </span>
                    <span className="block text-xs text-muted-foreground/50 mt-0.5 leading-snug">
                      {link.desc}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest mb-6">
              关于
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              本站内容仅供学术研究与学习参考，不替代法师指导与宗教实践。
            </p>
            <p className="text-xs text-muted-foreground/50 leading-relaxed">
              禁止宗教攻击、门派攻击、迷信宣传、算命占卜、招财改运等内容。
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/40">
            &copy; {new Date().getFullYear()} 慈悲空间 Cibei Space — 仅限学术研究与学习用途
          </p>
          <p className="text-xs text-muted-foreground/30">
            cibei.space
          </p>
        </div>
      </div>
    </footer>
  );
}
