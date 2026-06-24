import { db } from "./index";
import { sutras } from "./schema/sutras";
import { glossary } from "./schema/glossary";
import { encyclopedia } from "./schema/encyclopedia";

async function seed() {
  console.log("🌱 Seeding database...");

  // Seed sutras (metadata matching MDX files)
  const sutraData = [
    {
      slug: "diamond-sutra",
      title: "金刚般若波罗蜜经",
      titleEn: "Diamond Sutra",
      dynasty: "唐",
      translator: "鸠摩罗什",
      summary: "《金刚经》是大乘佛教般若部重要经典，主要阐述'空'的智慧，强调不应执着于任何相状，以般若智慧照见诸法实相。",
      category: "般若部",
    },
    {
      slug: "heart-sutra",
      title: "般若波罗蜜多心经",
      titleEn: "Heart Sutra",
      dynasty: "唐",
      translator: "玄奘",
      summary: "《心经》是般若经的精要，以'照见五蕴皆空'为核心，是流传最广的佛经之一。",
      category: "般若部",
    },
    {
      slug: "lotus-sutra",
      title: "妙法莲华经",
      titleEn: "Lotus Sutra",
      dynasty: "姚秦",
      translator: "鸠摩罗什",
      summary: "《法华经》是大乘佛教的重要经典，主张一切众生皆可成佛，开权显实、会三归一。",
      category: "法华部",
    },
    {
      slug: "amitabha-sutra",
      title: "佛说阿弥陀经",
      titleEn: "Amitabha Sutra",
      dynasty: "姚秦",
      translator: "鸠摩罗什",
      summary: "《阿弥陀经》是净土宗根本经典之一，宣说西方极乐世界的殊胜庄严。",
      category: "净土部",
    },
    {
      slug: "shurangama-sutra",
      title: "大佛顶首楞严经",
      titleEn: "Shurangama Sutra",
      dynasty: "唐",
      translator: "般剌密谛",
      summary: "《楞严经》详细阐述如来藏思想与修行方法，被誉为'开悟的楞严'。",
      category: "密教部",
    },
    {
      slug: "avatamsaka-sutra",
      title: "大方广佛华严经",
      titleEn: "Avatamsaka Sutra",
      dynasty: "唐",
      translator: "实叉难陀",
      summary: "《华严经》是华严宗的根本经典，阐述法界缘起、事事无碍的圆融思想。",
      category: "华严部",
    },
    {
      slug: "platform-sutra",
      title: "六祖大师法宝坛经",
      titleEn: "Platform Sutra",
      dynasty: "唐",
      translator: "法海（集记）",
      summary: "《六祖坛经》是禅宗六祖惠能大师的言行录，是唯一被尊为'经'的中国佛教著作。",
      category: "禅宗部",
    },
    {
      slug: "vimalakirti-sutra",
      title: "维摩诘所说经",
      titleEn: "Vimalakirti Sutra",
      dynasty: "姚秦",
      translator: "鸠摩罗什",
      summary: "《维摩诘经》以在家居士维摩诘为主角，阐扬大乘佛教的不二法门。",
      category: "经集部",
    },
  ];

  for (const s of sutraData) {
    await db.insert(sutras).values(s).onConflictDoNothing();
  }
  console.log(`  ✓ Inserted ${sutraData.length} sutras`);

  // Seed glossary (core Buddhist terms)
  const glossaryData = [
    {
      slug: "prajna",
      term: "般若",
      termEn: "Prajñā",
      termSanskrit: "प्रज्ञा",
      definition: "般若意为'智慧'，特指能够通达诸法实相、超越世俗认识的究竟智慧。不同于世间的聪明才智，般若智慧能够照见诸法空性，断除无明烦恼。",
      relatedTerms: ["空性", "菩提", "六度"],
    },
    {
      slug: "bodhi",
      term: "菩提",
      termEn: "Bodhi",
      termSanskrit: "बोधि",
      definition: "菩提意为'觉悟'或'觉智'，指对真理的觉悟。佛陀就是'觉悟者'的意思。菩提心即发愿成佛、利益众生的心。",
      relatedTerms: ["般若", "涅槃", "佛"],
    },
    {
      slug: "shunyata",
      term: "空性",
      termEn: "Śūnyatā",
      termSanskrit: "शून्यता",
      definition: "空性是大乘佛教的核心概念，指一切法没有固定不变的实体性（自性）。'空'不是虚无，而是指事物缘起而有的存在方式——没有独立、不变、主宰的自性。",
      relatedTerms: ["缘起", "般若", "中观"],
    },
    {
      slug: "pratityasamutpada",
      term: "缘起",
      termEn: "Pratītyasamutpāda",
      termSanskrit: "प्रतीत्यसमुत्पाद",
      definition: "缘起是佛教的根本教义，指一切事物都是因缘和合而生，没有独立自存的事物。'此有故彼有，此生故彼生；此无故彼无，此灭故彼灭。'",
      relatedTerms: ["空性", "因果", "十二因缘"],
    },
    {
      slug: "nirvana",
      term: "涅槃",
      termEn: "Nirvāṇa",
      termSanskrit: "निर्वाण",
      definition: "涅槃意为'寂灭'或'圆寂'，是佛教修行的最高目标——烦恼的彻底止息、生死轮回的终结。不是断灭，而是超越一切二元对立的寂静安乐。",
      relatedTerms: ["菩提", "解脱", "轮回"],
    },
  ];

  for (const g of glossaryData) {
    await db.insert(glossary).values(g).onConflictDoNothing();
  }
  console.log(`  ✓ Inserted ${glossaryData.length} glossary terms`);

  // Seed encyclopedia (key figures and schools)
  const encyclopediaData = [
    {
      slug: "nagarjuna",
      title: "龙树",
      category: "人物",
      content: "龙树（Nāgārjuna，约150-250年）是大乘佛教中观学派的开创者，被尊为'八宗共祖'。他的代表作《中论》系统阐述了'缘起性空'的中观思想，对大乘佛教的发展产生了深远影响。主要著作包括《中论》《十二门论》《大智度论》等。",
    },
    {
      slug: "xuanzang",
      title: "玄奘",
      category: "人物",
      content: "玄奘（602-664年）是唐代著名高僧、翻译家，中国佛教四大译经家之一。他于贞观年间西行求法，历经艰险到达印度那烂陀寺，学习多年后携带大量梵文经典回国。归国后翻译佛经75部1335卷，并著有《大唐西域记》。",
    },
    {
      slug: "tientai",
      title: "天台宗",
      category: "宗派",
      content: "天台宗是中国佛教最早的宗派之一，由智顗大师（538-597年）创立。以《法华经》为根本经典，提出'五时八教'的判教体系，以及'一心三观'、'一念三千'等核心教义。天台宗对汉传佛教各宗派都有深远影响。",
    },
    {
      slug: "chan",
      title: "禅宗",
      category: "宗派",
      content: "禅宗是中国化佛教最具代表性的宗派，主张'不立文字，教外别传，直指人心，见性成佛'。由达摩祖师传入中国，至六祖惠能而大盛。禅宗强调直接体验和顿悟，对中国的哲学、文学、艺术产生了深远影响。",
    },
  ];

  for (const e of encyclopediaData) {
    await db.insert(encyclopedia).values(e).onConflictDoNothing();
  }
  console.log(`  ✓ Inserted ${encyclopediaData.length} encyclopedia entries`);

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
