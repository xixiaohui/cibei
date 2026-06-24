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

    // ===== 一、基础教义 (10) =====
    {
      slug: "five-skandhas",
      term: "五蕴",
      termEn: "Five Aggregates",
      termSanskrit: "pañca-skandha",
      definition: "五蕴是佛教对众生身心现象的五种分类：色蕴（物质现象）、受蕴（感受）、想蕴（取相认知）、行蕴（意志行为）、识蕴（了别认识）。五蕴和合而成众生，没有独立不变的实体，是理解'无我'的基础。",
      relatedTerms: ["空性", "无我", "十二因缘"],
    },
    {
      slug: "four-noble-truths",
      term: "四圣谛",
      termEn: "Four Noble Truths",
      termSanskrit: "catvāri-āryasatyāni",
      definition: "四圣谛是佛陀成道后最初宣说的教法，是佛教的基本纲领：苦谛（世间是苦）、集谛（苦的原因是烦恼与业）、灭谛（苦的止息即涅槃）、道谛（通向灭苦的八正道）。",
      relatedTerms: ["八正道", "苦", "涅槃", "烦恼"],
    },
    {
      slug: "noble-eightfold-path",
      term: "八正道",
      termEn: "Noble Eightfold Path",
      termSanskrit: "ārya-aṣṭāṅgika-mārga",
      definition: "八正道是实现解脱的八条正确道路：正见（正确的见解）、正思维、正语、正业、正命、正精进、正念、正定。分为戒（正语、正业、正命）、定（正精进、正念、正定）、慧（正见、正思维）三学。",
      relatedTerms: ["四圣谛", "三学", "禅定", "精进"],
    },
    {
      slug: "twelve-links",
      term: "十二因缘",
      termEn: "Twelve Links of Dependent Origination",
      termSanskrit: "dvādaśāṅga-pratītyasamutpāda",
      definition: "十二因缘是佛陀对生命流转规律的详细说明：无明→行→识→名色→六入→触→受→爱→取→有→生→老死。顺观则为苦的生起（流转门），逆观则为苦的止息（还灭门）。",
      relatedTerms: ["缘起", "无明", "轮回", "业"],
    },
    {
      slug: "three-dharma-seals",
      term: "三法印",
      termEn: "Three Dharma Seals",
      termSanskrit: "tri-dharma-mudrā",
      definition: "三法印是验证佛法真伪的三个标准：诸行无常（一切有为法刹那生灭）、诸法无我（一切法没有独立实体）、涅槃寂静（涅槃超越一切烦恼痛苦）。符合此三者即为佛法正见。",
      relatedTerms: ["无常", "无我", "涅槃"],
    },
    {
      slug: "anitya",
      term: "无常",
      termEn: "Impermanence",
      termSanskrit: "anitya",
      definition: "无常指一切有为法（因缘所生的事物）都是刹那生灭、变化不住的。无常不是消极，而是宇宙人生的真相。接受无常，才能不执着、得自在。",
      relatedTerms: ["三法印", "缘起", "无我", "苦"],
    },
    {
      slug: "anatman",
      term: "无我",
      termEn: "Non-self",
      termSanskrit: "anātman",
      definition: "无我是佛教的核心教义之一，指五蕴之中没有一个常恒、独立、主宰的'我'存在。人与法皆无自性，认识到无我才能断除我执、获得解脱。",
      relatedTerms: ["空性", "五蕴", "三法印", "真如"],
    },
    {
      slug: "duhkha",
      term: "苦",
      termEn: "Suffering",
      termSanskrit: "duḥkha",
      definition: "苦是佛教对人生经验的根本洞察，有三苦（苦苦、坏苦、行苦）和八苦（生、老、病、死、爱别离、怨憎会、求不得、五蕴炽盛）之说。认识到苦并非消极，而是走向解脱的起点。",
      relatedTerms: ["四圣谛", "无常", "轮回", "解脱"],
    },
    {
      slug: "three-realms",
      term: "三界",
      termEn: "Three Realms",
      termSanskrit: "tri-dhātu",
      definition: "三界是众生轮回的三个层次：欲界（有食欲和淫欲的有情世界）、色界（已离欲但还有物质形体的清净世界）、无色界（纯精神状态的最高世界）。三界皆在轮回之中，唯有出三界才能究竟解脱。",
      relatedTerms: ["六道", "轮回", "解脱", "禅定"],
    },
    {
      slug: "six-realms",
      term: "六道",
      termEn: "Six Realms of Rebirth",
      termSanskrit: "ṣaḍ-gati",
      definition: "六道是众生依业力投生的六种生命形态：天道（享福）、人道（修行最宜）、阿修罗道（好斗）、畜生道（愚痴）、饿鬼道（贪欲重）、地狱道（嗔恚重）。六道轮回的根源是无明和贪嗔痴三毒。",
      relatedTerms: ["轮回", "业", "三毒", "三界"],
    },

    // ===== 二、大乘核心概念 (12) =====
    {
      slug: "bodhisattva",
      term: "菩萨",
      termEn: "Bodhisattva",
      termSanskrit: "bodhisattva",
      definition: "菩萨全称'菩提萨埵'，意为'觉有情'。菩萨以成佛为目标，发菩提心，修六度万行，上求佛道、下化众生，不独自解脱而广度一切众生。大乘佛教的核心修行者即菩萨。",
      relatedTerms: ["菩提", "般若", "大乘", "波罗蜜"],
    },
    {
      slug: "tathagata",
      term: "如来",
      termEn: "Tathāgata",
      termSanskrit: "tathāgata",
      definition: "如来是佛的十种称号之一，意为'乘如实之道而来'或'如去'——如实而来，如实而去。表明佛陀亲证真理、如实说法。金刚经中广泛讨论'如来'的涵义，指出不可以色身见如来。",
      relatedTerms: ["真如", "法身", "菩提", "如来藏"],
    },
    {
      slug: "buddha-nature",
      term: "佛性",
      termEn: "Buddha-nature",
      termSanskrit: "buddha-dhātu",
      definition: "佛性指一切众生本自具足的成佛潜能和觉悟本质。虽然众生现在被烦恼覆盖，但佛性从未失去，如金在矿、如月在云。中国佛教各宗（尤其天台、华严、禅宗）对佛性有深入阐发。",
      relatedTerms: ["如来藏", "真如", "菩提", "烦恼"],
    },
    {
      slug: "tathagatagarbha",
      term: "如来藏",
      termEn: "Tathāgatagarbha",
      termSanskrit: "tathāgata-garbha",
      definition: "如来藏意为'如来之胎藏'，指一切众生身中隐藏着的如来法身功德。虽然被烦恼外衣所包裹，但内在的如来智慧德相从未减损。《楞严经》《涅槃经》等对此有详细阐述。",
      relatedTerms: ["佛性", "真如", "如来", "法身"],
    },
    {
      slug: "tathata",
      term: "真如",
      termEn: "Suchness",
      termSanskrit: "tathatā",
      definition: "真如即'真实如此'，指宇宙万法的真实本性——如其本来面目，离一切虚妄分别。《心经》所说'诸法空相'即是真如。真如非有非无，超越一切言诠分别，是修行者最终要证悟的真实。",
      relatedTerms: ["空性", "法界", "如来", "不二"],
    },
    {
      slug: "dharmadhatu",
      term: "法界",
      termEn: "Dharma Realm",
      termSanskrit: "dharma-dhātu",
      definition: "法界有多重含义：一指整个宇宙万法；二指真如理体，即一切法的根本实相；华严宗更提出'一真法界'概念，认为一切法彼此圆融无碍，一即一切、一切即一。《华严经》'应观法界性，一切唯心造'即指此法界。",
      relatedTerms: ["真如", "空性", "不二", "法身"],
    },
    {
      slug: "dharmakaya",
      term: "法身",
      termEn: "Dharma Body",
      termSanskrit: "dharma-kāya",
      definition: "法身是佛的三身之一，指以法（真理）为身——佛所证悟的究竟真理和清净法性。法身无形无相、不生不灭、遍一切处，是一切佛的共同本质。与报身（受用身）和化身（应化身）合称三身。",
      relatedTerms: ["真如", "如来", "佛性", "法界"],
    },
    {
      slug: "mahayana",
      term: "大乘",
      termEn: "Great Vehicle",
      termSanskrit: "mahāyāna",
      definition: "大乘佛教是公元前后兴起的佛教主要传统，以自利利他、广度众生为宗旨，以成佛为最终目标（而非仅阿罗汉）。核心教义包括菩萨道、六度、空性、佛性等。汉传佛教、藏传佛教均属大乘。",
      relatedTerms: ["菩萨", "波罗蜜", "声闻", "方便"],
    },
    {
      slug: "upaya",
      term: "方便",
      termEn: "Skillful Means",
      termSanskrit: "upāya",
      definition: "方便即'善巧方便'，指佛陀和菩萨根据不同众生的根器、时机、因缘，灵活运用各种方法来引导众生趋向觉悟。方便不是妥协，而是智慧与慈悲的结合。《法华经》强调'开权显实'，即方便的最终目的是显示真实。",
      relatedTerms: ["般若", "大乘", "菩萨", "不二"],
    },
    {
      slug: "advaya",
      term: "不二",
      termEn: "Non-duality",
      termSanskrit: "advaya",
      definition: "不二指超越一切二元对立的究竟真实——没有生死/涅槃、烦恼/菩提、世间/出世间的绝对区分。《维摩诘经》以'不二法门'为核心，指出一切分别皆是戏论，离一切分别即入不二。",
      relatedTerms: ["空性", "中道", "真如", "解脱"],
    },
    {
      slug: "middle-way",
      term: "中道",
      termEn: "Middle Way",
      termSanskrit: "madhyamā-pratipad",
      definition: "中道是远离两边（极端）的正确道路。既反对纵欲主义也反对极端苦行，既否定'有'的执着也否定'无'的执着，既不住生死也不住涅槃。龙树菩萨《中论》以'八不中道'系统阐发：不生不灭、不常不断、不一不异、不来不去。",
      relatedTerms: ["空性", "不二", "八正道", "缘起"],
    },
    {
      slug: "anutpattika-dharma-kshanti",
      term: "无生法忍",
      termEn: "Acceptance of Non-arising",
      termSanskrit: "anutpattika-dharma-kṣānti",
      definition: "无生法忍是大乘菩萨的重要阶位，指对'一切法本来无生'这一真理的坚定认可和安住。证得无生法忍的菩萨不再退转，确认诸法实相不生不灭。《维摩诘经》和《楞严经》对此有深入讨论。",
      relatedTerms: ["空性", "不生不灭", "中道", "菩萨"],
    },

    // ===== 三、修行方法 (11) =====
    {
      slug: "paramita",
      term: "波罗蜜",
      termEn: "Perfection",
      termSanskrit: "pāramitā",
      definition: "波罗蜜意为'到彼岸'，指从生死此岸度到涅槃彼岸的修行法门。大乘佛教以六波罗蜜（六度）为主：布施、持戒、忍辱、精进、禅定、般若。每一度都是圆满的修行，以般若为导、前五度为伴。",
      relatedTerms: ["布施", "持戒", "忍辱", "般若"],
    },
    {
      slug: "dana",
      term: "布施",
      termEn: "Generosity",
      termSanskrit: "dāna",
      definition: "布施是六度之首，有三种：财施（以财物帮助他人）、法施（以佛法教导众生）、无畏施（令众生远离恐惧）。布施的核心是舍去悭贪之心，以无我利他的精神广行善法。",
      relatedTerms: ["波罗蜜", "持戒", "功德", "菩萨"],
    },
    {
      slug: "sila",
      term: "持戒",
      termEn: "Morality",
      termSanskrit: "śīla",
      definition: "持戒指守护佛所制定的戒律，止恶行善。在家众持五戒、八戒，出家众持具足戒，大乘菩萨持菩萨戒（摄律仪戒、摄善法戒、饶益有情戒）。戒是修行的根基，'戒为无上菩提本'。",
      relatedTerms: ["波罗蜜", "五戒", "布施", "三学"],
    },
    {
      slug: "kshanti",
      term: "忍辱",
      termEn: "Patience",
      termSanskrit: "kṣānti",
      definition: "忍辱是六度之三，指忍受一切逆境而不起嗔心。包括耐怨害忍（忍受他人侵害）、安受苦忍（忍受自然和身体的苦）、谛察法忍（对深法不生畏惧）。忍辱不是懦弱，而是内心强大的表现。",
      relatedTerms: ["波罗蜜", "精进", "禅定", "无生法忍"],
    },
    {
      slug: "virya",
      term: "精进",
      termEn: "Effort",
      termSanskrit: "vīrya",
      definition: "精进是六度之四，指不懈怠地修持善法、断除恶法。包括擐甲精进（勇猛无畏）、摄善精进（修一切善法）、饶益有情精进（利益众生）。精进是推动修行的动力，'勇猛心易发，长远心难持'。",
      relatedTerms: ["波罗蜜", "八正道", "禅定", "菩萨"],
    },
    {
      slug: "dhyana",
      term: "禅定",
      termEn: "Meditative Concentration",
      termSanskrit: "dhyāna",
      definition: "禅定是六度之五，即心专注一境而不散乱的状态。'禅'（dhyāna）意为'静虑'，'定'（samādhi）意为'等持'。通过修习禅定，可以降伏散乱心，获得身心轻安，进而以定发慧、照见实相。",
      relatedTerms: ["波罗蜜", "三昧", "止观", "般若"],
    },
    {
      slug: "samadhi",
      term: "三昧",
      termEn: "Samādhi",
      termSanskrit: "samādhi",
      definition: "三昧是梵语samādhi的音译，意为'等持'——心平等地安住于一境，不昏沉、不掉举。三昧有深浅不同，从欲界定到四禅八定，乃至首楞严三昧、法华三昧等大乘三昧。三昧是开发智慧的基础。",
      relatedTerms: ["禅定", "止观", "波罗蜜", "解脱"],
    },
    {
      slug: "shamatha-vipashyana",
      term: "止观",
      termEn: "Calm and Insight",
      termSanskrit: "śamatha-vipaśyanā",
      definition: "止（śamatha）是令心专注一境、止息妄念；观（vipaśyanā）是以智慧观照诸法实相。二者相辅相成：止如清水，观如照物——水清方能照物明澈。天台宗以止观为核心修行方法，智者大师著《摩诃止观》系统阐述。",
      relatedTerms: ["禅定", "三昧", "般若", "空性"],
    },
    {
      slug: "dedication",
      term: "回向",
      termEn: "Dedication of Merit",
      termSanskrit: "pariṇāmanā",
      definition: "回向是将所修功德转向特定目标，防止功德散失并令其增长。常回向三种：回向菩提（为成就佛果）、回向众生（愿众生得利益）、回向实际（契合真理）。回向扩大心量，是菩提心在日常修行中的体现。",
      relatedTerms: ["功德", "菩萨", "菩提", "发愿"],
    },
    {
      slug: "puja",
      term: "供养",
      termEn: "Offering",
      termSanskrit: "pūjā",
      definition: "供养是以香、花、灯、果、饮食、衣服等供品恭敬奉献于佛、法、僧三宝。广义的供养包括财供养（物质供养）和法供养（依教修行）。法供养最为殊胜，因为依教修行才是佛的本怀。",
      relatedTerms: ["三宝", "布施", "功德", "回向"],
    },
    {
      slug: "buddha-recollection",
      term: "念佛",
      termEn: "Buddha Recollection",
      termSanskrit: "buddhānusmṛti",
      definition: "念佛有广义和狭义之分。广义指忆念佛的功德、相好、智慧、慈悲；狭义指持诵佛的名号，如称念'南无阿弥陀佛'。净土宗以念佛为主要的修行方法，认为至心念佛可以往生极乐世界。",
      relatedTerms: ["禅定", "三昧", "净土", "阿弥陀佛"],
    },

    // ===== 四、断障与成就 (8) =====
    {
      slug: "avidya",
      term: "无明",
      termEn: "Ignorance",
      termSanskrit: "avidyā",
      definition: "无明是十二因缘之首，指不了知诸法实相的根本迷惑——不知缘起、不知空性、不知四圣谛。无明不是简单的缺乏知识，而是一种对存在的错误认知——执无常为常、执无我为我、执苦为乐。断无明即解脱。",
      relatedTerms: ["十二因缘", "烦恼", "三毒", "轮回"],
    },
    {
      slug: "klesha",
      term: "烦恼",
      termEn: "Afflictions",
      termSanskrit: "kleśa",
      definition: "烦恼是扰乱身心、令心不得安宁的心理状态。根本烦恼有六：贪、嗔、痴、慢、疑、恶见。烦恼是苦的直接原因（集谛），修行的核心就是断除烦恼。《维摩诘经》指出'烦恼即菩提'——烦恼的本性即是空性。",
      relatedTerms: ["三毒", "无明", "四圣谛", "解脱"],
    },
    {
      slug: "three-poisons",
      term: "三毒",
      termEn: "Three Poisons",
      termSanskrit: "tri-viṣa",
      definition: "三毒是三种最根本的烦恼：贪（rāga，贪爱执着）、嗔（dveṣa，愤怒憎恨）、痴（moha，愚痴无明）。一切烦恼都由三毒衍生，三毒是轮回的根本驱动力。修行就是对治三毒——以布施对治贪、以慈悲对治嗔、以智慧对治痴。",
      relatedTerms: ["烦恼", "无明", "六道", "解脱"],
    },
    {
      slug: "karma",
      term: "业",
      termEn: "Karma",
      termSanskrit: "karma",
      definition: "业是梵语'羯磨'的意译，指身、口、意的行为及其所产生的潜在力量。善业感乐果，恶业感苦果，无记业（中性行为）感无记果。业力不是宿命——当下的选择可以改变过去的业力走向。理解业力，才能对自己的生命负责。",
      relatedTerms: ["轮回", "因缘", "苦", "烦恼"],
    },
    {
      slug: "samsara",
      term: "轮回",
      termEn: "Saṃsāra",
      termSanskrit: "saṃsāra",
      definition: "轮回指众生依业力在六道（天、人、阿修罗、畜生、饿鬼、地狱）中不断生死流转，无始无终、循环往复。轮回的驱动力是无明、贪爱和业力。佛教的目标不是求更好的轮回，而是究竟超越轮回、证入涅槃。",
      relatedTerms: ["六道", "业", "无明", "涅槃"],
    },
    {
      slug: "vimoksha",
      term: "解脱",
      termEn: "Liberation",
      termSanskrit: "vimokṣa",
      definition: "解脱指脱离烦恼、业力和生死的束缚，获得究竟自由。小乘以阿罗汉的无余涅槃为终极解脱；大乘以成佛——烦恼障和所知障尽断、圆满证悟法身——为究竟解脱。'解脱'并非远在天边，当下一念离执着，即是一分解脱。",
      relatedTerms: ["涅槃", "无余涅槃", "阿罗汉", "菩萨"],
    },
    {
      slug: "arhat",
      term: "阿罗汉",
      termEn: "Arhat",
      termSanskrit: "arhat",
      definition: "阿罗汉意为'应供'——值得接受天人供养的圣者。阿罗汉已断尽一切烦恼、超脱生死轮回、不受后有。阿罗汉是声闻乘的最高果位（初果→二果→三果→四果阿罗汉）。大乘认为阿罗汉最终还应回小向大、走向菩萨道。",
      relatedTerms: ["声闻", "解脱", "涅槃", "菩萨"],
    },
    {
      slug: "shravaka",
      term: "声闻",
      termEn: "Hearer",
      termSanskrit: "śrāvaka",
      definition: "声闻字面意为'听法者'，指亲闻佛陀说法而修行证果的弟子。声闻乘以阿罗汉为最高目标，注重个人解脱。大乘经典常以'声闻、缘觉、菩萨'三乘并称，并引导声闻回小向大——从小乘的自利转向大乘的利他。",
      relatedTerms: ["阿罗汉", "菩萨", "大乘", "缘觉"],
    },

    // ===== 五、常见名相 (8) =====
    {
      slug: "three-jewels",
      term: "三宝",
      termEn: "Three Jewels",
      termSanskrit: "tri-ratna",
      definition: "三宝是佛教徒皈依的三种对象：佛宝（觉悟者——释迦牟尼佛及一切诸佛）、法宝（佛所证悟和宣说的真理——经律论三藏）、僧宝（修行佛法的清净僧团）。皈依三宝是成为佛教徒的根本标志。'皈依'即身心归向、依托。",
      relatedTerms: ["三藏", "佛性", "法轮"],
    },
    {
      slug: "tripitaka",
      term: "三藏",
      termEn: "Three Baskets",
      termSanskrit: "tri-piṭaka",
      definition: "三藏是佛教经典的总集分类：经藏（sūtra，佛所说的教法）、律藏（vinaya，僧团戒律和规范）、论藏（abhidharma，对教法的系统阐释和哲学分析）。通晓三藏的法师称为'三藏法师'，如玄奘大师。",
      relatedTerms: ["三宝", "法轮", "菩萨"],
    },
    {
      slug: "five-precepts",
      term: "五戒",
      termEn: "Five Precepts",
      termSanskrit: "pañca-śīla",
      definition: "五戒是在家佛教徒应受持的五条基本戒律：不杀生（不伤害生命）、不偷盗（不取未给与之物）、不邪淫（不发生不正当性关系）、不妄语（不说虚诳不实的话）、不饮酒（不饮用令人放逸迷乱的酒精）。五戒是道德生活的基础。",
      relatedTerms: ["持戒", "三学", "十善"],
    },
    {
      slug: "dharma-wheel",
      term: "法轮",
      termEn: "Dharma Wheel",
      termSanskrit: "dharma-cakra",
      definition: "法轮是佛法的象征。佛陀在鹿野苑初次说法称为'初转法轮'。法轮常以八辐代表八正道，以轮喻法——如转轮圣王的宝轮能摧伏一切敌人，佛法能摧破一切烦恼；如车轮转动不息，佛法传播永不止息。",
      relatedTerms: ["八正道", "三宝", "四圣谛"],
    },
    {
      slug: "punya",
      term: "功德",
      termEn: "Merit",
      termSanskrit: "puṇya",
      definition: "功指修行之功（精进修行），德指所得之果（福德智慧）。广义的功德指一切善行所积累的福德资粮。'功德'与'福德'有别——执相而修得福德，离相而修得功德。六祖惠能云：'见性是功，平等是德。'",
      relatedTerms: ["回向", "布施", "供养", "波罗蜜"],
    },
    {
      slug: "kalyanamitra",
      term: "善知识",
      termEn: "Spiritual Friend",
      termSanskrit: "kalyāṇamitra",
      definition: "善知识指能引导他人走向善法、趋向觉悟的良师益友。包括教授善知识（讲授佛法者）、同行善知识（共同修行者）、外护善知识（护持修行者）。《华严经》说一切佛法皆从善知识而得，善知识是成佛的全因缘。",
      relatedTerms: ["三宝", "菩萨", "法门"],
    },
    {
      slug: "dharma-gate",
      term: "法门",
      termEn: "Dharma Gate",
      termSanskrit: "dharma-paryāya",
      definition: "法门即进入佛法真理的门径和方法。佛教有八万四千法门之说，因众生根器不同，佛陀开示了种种不同的修行方法——如念佛法门、禅观法门、持咒法门等。'法门无量誓愿学'是菩萨四弘誓愿之一。",
      relatedTerms: ["方便", "波罗蜜", "菩萨", "善知识"],
    },
    {
      slug: "prithagjana",
      term: "凡夫",
      termEn: "Ordinary Person",
      termSanskrit: "pṛthagjana",
      definition: "凡夫指尚未见道（未证悟真理）的普通众生——被烦恼束缚、在生死中流转。与圣者（已见道的修行者）相对。'凡'与'圣'的区别在于是否如实知见诸法实相。凡夫虽未觉悟，但本具佛性，终究可以成佛。",
      relatedTerms: ["佛性", "烦恼", "轮回", "菩萨"],
    },

    // ===== 六、重要经文概念 (6) =====
    {
      slug: "anuttara-samyak-sambodhi",
      term: "阿耨多罗三藐三菩提",
      termEn: "Unsurpassed Perfect Enlightenment",
      termSanskrit: "anuttarā-samyak-saṃbodhi",
      definition: "阿耨多罗三藐三菩提是梵语音译，意为'无上正等正觉'。阿耨多罗（anuttarā）= 无上，三藐（samyak）= 正等/正确圆满，三菩提（saṃbodhi）= 正觉/究竟觉悟。这是佛所成就的最高觉悟境界，超越一切声闻缘觉。",
      relatedTerms: ["菩提", "菩萨", "涅槃", "般若"],
    },
    {
      slug: "four-marks",
      term: "四相",
      termEn: "Four Marks",
      termSanskrit: "",
      definition: "四相是《金刚经》中的重要概念：我相（执着有实在的自我）、人相（执着有实在的他人）、众生相（执着有实在的众生）、寿者相（执着有实在的生命延续）。破除四相是金刚经的核心修行——'无我相、无人相、无众生相、无寿者相'。",
      relatedTerms: ["无我", "空性", "金刚经", "凡夫"],
    },
    {
      slug: "nirupadhishesha-nirvana",
      term: "无余涅槃",
      termEn: "Nirvana without Remainder",
      termSanskrit: "nirupadhiśeṣa-nirvāṇa",
      definition: "无余涅槃是涅槃的一种，指烦恼和五蕴（身心）皆灭尽的究竟涅槃——不再有任何残余、不再受后有。与有余涅槃（烦恼已断但身体仍在）相对。《金刚经》说佛陀令一切众生入无余涅槃而灭度之，即令众生达究竟解脱。",
      relatedTerms: ["涅槃", "解脱", "阿罗汉", "五蕴"],
    },
    {
      slug: "all-dharmas-are-empty",
      term: "诸法空相",
      termEn: "All Dharmas are Empty",
      termSanskrit: "",
      definition: "'诸法空相'出自《心经》'是诸法空相，不生不灭，不垢不净，不增不减'。意指一切法（现象）的真实相状即是空——不是没有现象，而是现象没有独立自性。空即是诸法的实相，不是离开诸法另外有一个空。",
      relatedTerms: ["空性", "真如", "不生不灭", "中道"],
    },
    {
      slug: "neither-arising-nor-ceasing",
      term: "不生不灭",
      termEn: "Neither Arising nor Ceasing",
      termSanskrit: "anutpāda-nirodha",
      definition: "不生不灭是《心经》和龙树《中论》的核心教义，指诸法实相超越了一切生灭变化的假相。从世俗谛看万物有生有灭；从胜义谛看，缘起的本质即是无自性空，空中本无生灭可得。领悟不生不灭即契入涅槃寂静。",
      relatedTerms: ["空性", "诸法空相", "中道", "无生法忍"],
    },
    {
      slug: "thus-have-i-heard",
      term: "如是我闻",
      termEn: "Thus Have I Heard",
      termSanskrit: "evaṃ mayā śrutam",
      definition: "如是我闻是绝大多数佛经的开头语，意为'我是这样听佛说的'。据传为阿难尊者在第一次结集时诵出经藏的口吻。这四个字包含信（如）、闻（我闻）二义，表示经文是如实亲闻于佛，令后人生信。",
      relatedTerms: ["阿罗汉", "声闻", "三藏"],
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
