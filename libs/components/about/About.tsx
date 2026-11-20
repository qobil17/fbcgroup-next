const VALUES = {
  uz: [
    {
      icon: "✦",
      title: "Sifat Kafolati",
      text: "Har bir loyihada faqat sertifikatlangan materiallar va zamonaviy texnologiyalardan foydalanamiz. Natija — uzoq muddatli va ishonchli yechim.",
    },
    {
      icon: "◈",
      title: "Professional Jamoa",
      text: "10 yillik tajribaga ega mutaxassislar jamoamiz fasad o'rnatishdan tortib yoritish tizimlarini loyihalashgacha bo'lgan barcha bosqichlarni o'z zimmasiga oladi.",
    },
    {
      icon: "◉",
      title: "Innovatsion Yechimlar",
      text: "HPLINE fasad panellaridan tortib ALIF LED yoritish tizimlarigacha — biz sanoatdagi eng so'nggi yechimlarni sizning loyihangizga moslashtiramiz.",
    },
    {
      icon: "❖",
      title: "Mijoz Mamnuniyati",
      text: "Buyurtmachi bilan doimiy muloqot, loyihaning har bir bosqichida shaffoflik va o'z vaqtida yetkazib berish — biz uchun murosasiz tamoyillar.",
    },
  ],
  ru: [
    {
      icon: "✦",
      title: "Гарантия качества",
      text: "В каждом проекте используем только сертифицированные материалы и современные технологии. Результат — долгосрочное и надёжное решение.",
    },
    {
      icon: "◈",
      title: "Профессиональная команда",
      text: "Наша команда специалистов с 10-летним опытом берёт на себя все этапы — от монтажа фасадов до проектирования световых систем.",
    },
    {
      icon: "◉",
      title: "Инновационные решения",
      text: "От фасадных панелей HPLINE до систем LED-освещения ALIF — мы адаптируем новейшие отраслевые решения под ваш проект.",
    },
    {
      icon: "❖",
      title: "Удовлетворённость клиента",
      text: "Постоянный диалог с заказчиком, прозрачность на каждом этапе проекта и своевременная сдача — наши непреложные принципы.",
    },
  ],
  en: [
    {
      icon: "✦",
      title: "Quality Guarantee",
      text: "Every project uses only certified materials and modern technologies. The result — a durable and reliable solution.",
    },
    {
      icon: "◈",
      title: "Professional Team",
      text: "Our team of specialists with 10 years of experience handles every stage — from facade installation to lighting system design.",
    },
    {
      icon: "◉",
      title: "Innovative Solutions",
      text: "From HPLINE facade panels to ALIF LED lighting systems — we adapt the latest industry solutions to your project.",
    },
    {
      icon: "❖",
      title: "Client Satisfaction",
      text: "Ongoing communication, full transparency at every project stage, and on-time delivery are our non-negotiable principles.",
    },
  ],
};

interface AboutContent {
  hero: { tag: string; title: string; slogan: string };
  section: { heading: string };
  bodies: [string, string, string];
  stats: Array<{ number: string; label: string }>;
  gallery: { heading: string; sub: string; labels: [string, string, string] };
  valuesHeading: string;
}

const CONTENT: Record<string, AboutContent> = {
  uz: {
    hero: {
      tag: "O'zbekiston #1 Fasad & Yoritish",
      title: "FBC Group",
      slogan:
        "Zamonaviy fasad va yoritish yechimlari bilan binolaringizga yangi hayot bering.",
    },
    section: { heading: "Biz Haqimizda" },
    bodies: [
      "FBC Group — O'zbekistonda fasad qoplama tizimlari va professional yoritish yechimlari sohasida yetakchi kompaniya. 2015-yildan buyon biz mamlakat bo'ylab yuzlab tijorat, sanoat va turar-joy binolarini zamonaviy ko'rinishga keltirdik.",
      "HPLINE bo'limida biz HPL panellar, granit va seranit qoplamalar hamda Alikafon materiallar yordamida binolarning tashqi ko'rinishini tubdan o'zgartiramiz. Fasad — bu faqat estetika emas, u binoni harorat, namlik va tashqi ta'sirlardan himoya qiluvchi muhim qatlamdir.",
      "ALIF Light bo'limida biz LED yoritish, dekorativ chiroqlar va favqulodda yoritish tizimlarini loyihalash hamda o'rnatish xizmatlarini ko'rsatamiz. Energiya tejaydigan, uzoq umr ko'radigan va estetik jihatdan go'zal yoritish yechimlari bizning ixtisosligimizdir.",
    ],
    stats: [
      { number: "500+", label: "Tugallangan loyiha" },
      { number: "10+", label: "Yillik tajriba" },
      { number: "12", label: "Viloyat bo'ylab" },
    ],
    gallery: {
      heading: "Loyihalarimizdan",
      sub: "Amalga oshirilgan ishlarimizning bir qismi",
      labels: ["HPLINE · Fasad", "ALIF · LED Yoritish", "HPLINE · Granit"],
    },
    valuesHeading: "Bizning Qadriyatlarimiz",
  },
  ru: {
    hero: {
      tag: "Фасад и освещение №1 в Узбекистане",
      title: "FBC Group",
      slogan:
        "Современные фасадные и световые решения для новой жизни ваших зданий.",
    },
    section: { heading: "О нас" },
    bodies: [
      "FBC Group — ведущая компания Узбекистана в области фасадных систем и профессионального освещения. С 2015 года мы преобразили сотни коммерческих, промышленных и жилых зданий по всей стране.",
      "Подразделение HPLINE трансформирует фасады с помощью HPL-панелей, гранитных и серанитовых покрытий, а также материалов Аликафон. Фасад — это не только эстетика, но и защита здания от тепла, влаги и внешних воздействий.",
      "Подразделение ALIF Light проектирует и монтирует LED-освещение, декоративные светильники и системы аварийного освещения. Энергоэффективные, долговечные и эстетически безупречные световые решения — наша специализация.",
    ],
    stats: [
      { number: "500+", label: "Завершённых проектов" },
      { number: "10+", label: "Лет опыта" },
      { number: "14", label: "Регионов охвата" },
    ],
    gallery: {
      heading: "Наши проекты",
      sub: "Часть выполненных работ",
      labels: ["HPLINE · Фасад", "ALIF · LED освещение", "HPLINE · Гранит"],
    },
    valuesHeading: "Наши ценности",
  },
  en: {
    hero: {
      tag: "Uzbekistan's #1 Facade & Lighting",
      title: "FBC Group",
      slogan:
        "Transforming buildings with modern facade and lighting solutions.",
    },
    section: { heading: "About Us" },
    bodies: [
      "FBC Group is the leading company in Uzbekistan specialising in facade cladding systems and professional lighting solutions. Since 2015, we have transformed hundreds of commercial, industrial, and residential buildings across the country.",
      "The HPLINE division transforms building exteriors with HPL panels, granite and seranit cladding, and Alikafon materials. A facade is more than aesthetics — it is a critical layer protecting a building from heat, moisture, and external influences.",
      "The ALIF Light division designs and installs LED lighting, decorative fixtures, and emergency lighting systems. Energy-efficient, long-lasting, and visually stunning lighting solutions are our speciality.",
    ],
    stats: [
      { number: "500+", label: "Completed Projects" },
      { number: "10+", label: "Years of Experience" },
      { number: "14", label: "Regions Covered" },
    ],
    gallery: {
      heading: "Our Projects",
      sub: "A selection of completed work",
      labels: ["HPLINE · Facade", "ALIF · LED Lighting", "HPLINE · Granite"],
    },
    valuesHeading: "Our Values",
  },
};

interface AboutProps {
  locale: string;
}

const About = ({ locale }: AboutProps) => {
  const c = CONTENT[locale] ?? CONTENT.uz;
  const values = VALUES[locale as keyof typeof VALUES] ?? VALUES.uz;

  return (
    <div className="about-page">
      {/* ── Hero ────────────────────────────────────────── */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero__content">
            <span className="about-hero__tag">{c.hero.tag}</span>
            <h1 className="about-hero__title">{c.hero.title}</h1>
            <p className="about-hero__slogan">{c.hero.slogan}</p>
          </div>
        </div>
      </section>

      {/* ── About ───────────────────────────────────────── */}
      <section className="about-section">
        <div className="container">
          <div className="about-section__inner">
            <div className="about-section__text-block">
              <h2 className="about-section__heading">{c.section.heading}</h2>
              {c.bodies.map((body, i) => (
                <p key={i} className="about-section__body">
                  {body}
                </p>
              ))}
            </div>

            <div className="about-section__stats">
              {c.stats.map((stat) => (
                <div key={stat.label} className="stat-box">
                  <span className="stat-box__number">{stat.number}</span>
                  <span className="stat-box__label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery ─────────────────────────────────────── */}
      <section className="about-gallery">
        <div className="container">
          <h2 className="about-gallery__heading">{c.gallery.heading}</h2>
          <p className="about-gallery__sub">{c.gallery.sub}</p>
          <div className="gallery-grid">
            <div className="gallery-item gallery-item--large">
              <span className="gallery-item__label">{c.gallery.labels[0]}</span>
            </div>
            <div className="gallery-item gallery-item--tall">
              <span className="gallery-item__label">{c.gallery.labels[1]}</span>
            </div>
            <div className="gallery-item">
              <span className="gallery-item__label">{c.gallery.labels[2]}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────── */}
      <section className="about-values">
        <div className="container">
          <h2 className="about-values__heading">{c.valuesHeading}</h2>
          <div className="values-grid">
            {values.map((v) => (
              <div className="value-card" key={v.title}>
                <span className="value-card__icon">{v.icon}</span>
                <h3 className="value-card__title">{v.title}</h3>
                <p className="value-card__text">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
