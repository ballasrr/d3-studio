/**
 * D3 — single content source.
 * Copy changes happen here, never inside JSX. Safe to edit without touching layout.
 */

export type NavItem = { label: string; href: string };

export type Stat = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export type Service = {
  id: string;
  index: string;
  title: string;
  description: string;
  tags: string[];
  price: string;
  term: string;
  icon: "site" | "bolt" | "app" | "cart" | "cube";
  wide?: boolean;
};

export type CaseStudy = {
  id: string;
  client: string;
  title: string;
  subtitle: string;
  industry: string;
  year: string;
  services: string[];
  result: string;
  resultLabel: string;
  visual: "dashboard" | "landing" | "commerce" | "mobile" | "configurator";
  tone: "lime" | "neutral" | "warm" | "ice";
};

export type ProcessStep = {
  n: string;
  title: string;
  duration: string;
  text: string;
  deliverables: string[];
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
};

export type Plan = {
  id: string;
  name: string;
  price: string;
  term: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
};

export type FaqItem = { q: string; a: string };

export const site = {
  name: "D3",
  legal: "D3 Studio",
  url: "https://d3.studio",
  description:
    "D3 — студия разработки сайтов и цифровых продуктов. Дизайн, 3D-графика и продакшн-код: от идеи до запуска за 6–10 недель.",

  nav: [
    { label: "Услуги", href: "#services" },
    { label: "Кейсы", href: "#work" },
    { label: "Процесс", href: "#process" },
    { label: "Тарифы", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ] as NavItem[],

  contacts: {
    email: "hello@d3.studio",
    telegram: "@d3studio",
    telegramUrl: "https://t.me/d3studio",
    city: "Москва · Дизайн-завод «Флакон»",
    hours: "Пн–Пт, 10:00–19:00 МСК",
    response: "Отвечаем в течение 3 часов в рабочее время",
  },

  hero: {
    eyebrow: "Product design & engineering studio",
    lines: ["Третье", "измерение", "бизнеса"],
    accentLine: 1,
    lead: "D3 проектирует и собирает сайты, веб-сервисы и цифровые продукты. От стратегии и 3D-дизайна до продакшн-кода — без посредников между вами и командой.",
    primaryCta: { label: "Обсудить проект", href: "#contact" },
    secondaryCta: { label: "Смотреть кейсы", href: "#work" },
    availability: "2 слота на декабрь",
    meta: [
      { label: "Локация", value: "Москва · работаем по РФ и миру" },
      { label: "Формат", value: "Фикс-цена, договор, NDA" },
      { label: "Запуск", value: "6–10 недель от брифа" },
    ],
    stats: [
      { value: 47, label: "продуктов запущено с 2018" },
      { value: 8, label: "лет продуктовой команде" },
      { value: 4.9, decimals: 1, suffix: "/5", label: "средняя оценка после запуска" },
    ] as Stat[],
  },

  proof: {
    label: "Нам доверяют продукт",
    items: [
      { name: "ORBITA", style: "display" },
      { name: "СЕВЕР", style: "sans" },
      { name: "KUPER", style: "mono" },
      { name: "STRAVINSKY", style: "outline" },
      { name: "NORDSOFT", style: "sans" },
      { name: "MOLOT", style: "display" },
      { name: "AXIOM", style: "mono" },
      { name: "HYDRA", style: "outline" },
    ],
  },

  manifesto: {
    index: "01",
    label: "Подход",
    title: "Не агентство. Продуктовая команда.",
    accent: "команда",
    body: [
      "Мы не продаём часы и не рисуем «просто красивый сайт». Собираем работающий продукт: изучаем, как вы зарабатываете, находим узкое место и закрываем его дизайном и кодом.",
      "В команде — арт-директор, дизайнер интерфейсов, 3D-художник и два инженера. Вы общаетесь с теми, кто делает, — без аккаунт-менеджеров-посредников.",
    ],
    points: [
      {
        title: "Один ответственный",
        text: "Тимлид отвечает за срок, смету и качество — от брифа до запуска. Один канал связи, один статус в неделю.",
      },
      {
        title: "Фикс-цена",
        text: "Смета фиксируется в договоре после дискавери. Никаких «это оказалось сложнее» посреди проекта.",
      },
      {
        title: "Код, который живёт",
        text: "TypeScript, тесты, CI и документация. Передаём репозиторий — не запираем сайт в конструкторе.",
      },
    ],
    metrics: [
      { value: 47, label: "проектов в проде", note: "с 2018 года" },
      { value: 92, suffix: "%", label: "клиентов возвращаются", note: "за апдейтами и поддержкой" },
      { value: 15, suffix: " дн", label: "средний срок лендинга", note: "от брифа до публикации" },
    ],
  },

  services: {
    index: "02",
    label: "Услуги",
    title: "Собираем целиком, а не по частям",
    accent: "целиком",
    description:
      "Дизайн, код и 3D — в одной команде. Поэтому сайт не разваливается на стыке «макет готов, а верстка не та».",
    items: [
      {
        id: "corporate",
        index: "S.01",
        title: "Корпоративный сайт",
        description:
          "Многостраничник со структурой под поиск и продажи: услуги, кейсы, команда, блог. Дизайн, который показывает уровень компании, а не «рассказывает о ценностях».",
        tags: ["Дизайн", "Next.js", "CMS", "SEO"],
        price: "от 450 000 ₽",
        term: "6–8 недель",
        icon: "site",
        wide: true,
      },
      {
        id: "landing",
        index: "S.02",
        title: "Лендинг и промо",
        description:
          "Одна страница — одна мысль — одно действие. 3D и motion, которые работают на конверсию, а не против неё.",
        tags: ["Арт-дирекшн", "3D", "GSAP", "A/B"],
        price: "от 180 000 ₽",
        term: "2–4 недели",
        icon: "bolt",
      },
      {
        id: "product",
        index: "S.03",
        title: "Веб-сервис и SaaS",
        description:
          "Авторизация, оплаты, личный кабинет, админка. Пишем фронтенд и бэкенд, тестируем, выкатываем и остаёмся на поддержке.",
        tags: ["React", "FastAPI", "PostgreSQL", "Docker"],
        price: "от 900 000 ₽",
        term: "8–12 недель",
        icon: "app",
        wide: true,
      },
      {
        id: "ecommerce",
        index: "S.04",
        title: "Интернет-магазин",
        description:
          "Каталог, корзина, оплата, склад и доставка. Скорость и SEO на уровне, который не стыдно показывать инвесторам.",
        tags: ["Каталог", "Оплата", "1С", "Аналитика"],
        price: "от 550 000 ₽",
        term: "6–9 недель",
        icon: "cart",
      },
      {
        id: "design-system",
        index: "S.05",
        title: "Дизайн-система и 3D",
        description:
          "Токены, компоненты, гайдлайны и 3D-графика — чтобы новые страницы собирались за дни. Отдельно — если дизайн есть, а системы нет.",
        tags: ["UI-кит", "3D", "Motion", "Гайдлайн"],
        price: "от 250 000 ₽",
        term: "3–5 недель",
        icon: "cube",
      },
    ] as Service[],
  },

  work: {
    index: "03",
    label: "Кейсы",
    title: "Цифры, которые можно проверить",
    accent: "проверить",
    description:
      "Пять проектов последних двух лет. В каждом — задача бизнеса, наше решение и метрика после запуска.",
    items: [
      {
        id: "orbita",
        client: "ORBITA",
        title: "Платформа грузоперевозок",
        subtitle: "Личный кабинет перевозчика: заявки, рейсы, документы и оплата в одном окне.",
        industry: "Логистика",
        year: "2026",
        services: ["Исследование", "UX/UI", "Веб-приложение"],
        result: "+38%",
        resultLabel: "заявок с сайта за 3 месяца",
        visual: "dashboard",
        tone: "lime",
      },
      {
        id: "sever",
        client: "СЕВЕР",
        title: "Сайт жилого квартала",
        subtitle: "Продажа квартир без звонка: фильтр планировок, 3D-тур по двору, онлайн-бронь.",
        industry: "Девелопмент",
        year: "2025",
        services: ["Арт-дирекшн", "3D", "Лендинг"],
        result: "1 240",
        resultLabel: "броней за первый месяц",
        visual: "landing",
        tone: "neutral",
      },
      {
        id: "stravinsky",
        client: "STRAVINSKY",
        title: "Магазин с AR-примеркой",
        subtitle: "Мода, каталог на 4 000 SKU и примерка обуви камерой телефона прямо в карточке.",
        industry: "E-commerce",
        year: "2025",
        services: ["E-commerce", "3D/AR", "Интеграции"],
        result: "×2,4",
        resultLabel: "средний чек после редизайна",
        visual: "commerce",
        tone: "warm",
      },
      {
        id: "molot",
        client: "MOLOT",
        title: "Каталог и конфигуратор",
        subtitle: "B2B-каталог промышленной мебели: 1 800 позиций, расчёт комплектации в реальном времени.",
        industry: "Производство",
        year: "2024",
        services: ["Каталог", "Конфигуратор", "1С"],
        result: "−40%",
        resultLabel: "ручных заявок в почте",
        visual: "configurator",
        tone: "ice",
      },
      {
        id: "axiom",
        client: "AXIOM",
        title: "Дашборд для финтеха",
        subtitle: "Отчётность для 60 филиалов: срезы за секунды вместо трёх дней в Excel.",
        industry: "Финтех",
        year: "2024",
        services: ["Продуктовый дизайн", "SaaS", "API"],
        result: "−3 дн",
        resultLabel: "к ежемесячной отчётности",
        visual: "mobile",
        tone: "neutral",
      },
    ] as CaseStudy[],
  },

  process: {
    index: "04",
    label: "Процесс",
    title: "Понятный путь без сюрпризов",
    accent: "без сюрпризов",
    description:
      "Четыре этапа, фиксированные артефакты и демо каждую неделю. Вы всегда знаете, что происходит и когда будет готово.",
    steps: [
      {
        n: "01",
        title: "Дискавери",
        duration: "1–2 недели",
        text: "Интервью с теми, кто продаёт и покупает. Смотрим аналитику, конкурентов и текущие узкие места. Формулируем, какую задачу решает продукт.",
        deliverables: ["Бриф и цели", "Карта сценариев", "Структура и прототип"],
      },
      {
        n: "02",
        title: "Дизайн",
        duration: "2–3 недели",
        text: "Арт-дирекшн, макеты ключевых экранов, 3D-графика и motion. Собираем дизайн-систему, чтобы дальше страницы росли без хаоса.",
        deliverables: ["Макеты всех экранов", "Дизайн-токены", "Кликабельный прототип"],
      },
      {
        n: "03",
        title: "Разработка",
        duration: "3–5 недель",
        text: "Фронтенд, бэкенд, интеграции, тесты и доступность. Показываем staging каждую неделю — вы видите продукт, а не отчёт о прогрессе.",
        deliverables: ["Staging-сборка", "Репозиторий и CI", "QA-отчёт"],
      },
      {
        n: "04",
        title: "Запуск",
        duration: "1 неделя",
        text: "Домен, аналитика, SEO, скорость и обучение команды. После релиза 30 дней гарантии — правим всё, что нашли в реальной эксплуатации.",
        deliverables: ["Продакшн и доступы", "Документация", "30 дней гарантии"],
      },
    ] as ProcessStep[],
  },

  stack: {
    label: "Стек",
    title: "Технологии без культа",
    description:
      "Выбираем инструменты под задачу и передаём код с документацией. Никаких «только мы знаем, как это работает».",
    groups: [
      { title: "Фронтенд", items: ["Next.js", "React", "TypeScript", "Tailwind", "Three.js", "GSAP"] },
      { title: "Бэкенд", items: ["Node.js", "FastAPI", "PostgreSQL", "Redis", "Docker", "CI/CD"] },
      { title: "Дизайн", items: ["Figma", "Blender", "After Effects", "Spline", "Rive"] },
    ],
  },

  testimonials: {
    index: "05",
    label: "Отзывы",
    title: "Говорят заказчики",
    accent: "заказчики",
    description: "Без «Иван И., клиент». Реальные роли, компании и конкретные результаты.",
    items: [
      {
        quote:
          "За семь недель собрали платформу, которую мы год не могли запустить с подрядчиком на аутсорсе. Отдельное спасибо за то, что сами нашли дыру в сценарии оформления заявки.",
        name: "Марина Ковалёва",
        role: "Директор по маркетингу",
        company: "ORBITA",
        initials: "МК",
      },
      {
        quote:
          "Первый подрядчик прислал «редизайн» из шаблона. D3 начали с интервью с нашими продавцами — и это видно в цифрах: средний чек вырос в 2,4 раза.",
        name: "Илья Соколов",
        role: "CEO",
        company: "STRAVINSKY",
        initials: "ИС",
      },
      {
        quote:
          "Писали код так, что наша команда смогла продолжить без них. Передали репозиторий, документацию и провели два воркшопа. Это редкость на рынке.",
        name: "Дмитрий Ким",
        role: "Основатель",
        company: "AXIOM",
        initials: "ДК",
      },
    ] as Testimonial[],
  },

  pricing: {
    index: "06",
    label: "Тарифы",
    title: "Фикс-цена в договоре",
    accent: "в договоре",
    description:
      "Три формата работы. Итоговая смета — после 30 минут дискавери: считаем по экранам, интеграциям и контенту.",
    note: "Оплата 40% / 40% / 20%. Работаем по договору и ЭДО, принимаем безнал. НДС не облагается (УСН).",
    plans: [
      {
        id: "landing",
        name: "Лендинг",
        price: "180 000 ₽",
        term: "2–4 недели",
        description: "Одна страница под запуск продукта или рекламу.",
        features: [
          "Арт-дирекшн и 3D-графика",
          "Адаптив под все экраны",
          "Анимации и интерактив",
          "Аналитика и цели",
          "2 итерации правок",
          "Гарантия 30 дней",
        ],
        cta: "Запустить лендинг",
      },
      {
        id: "corporate",
        name: "Сайт компании",
        price: "450 000 ₽",
        term: "6–8 недель",
        description: "Многостраничный сайт с CMS и структурой под SEO.",
        features: [
          "Дискавери и структура",
          "Дизайн 8–12 экранов",
          "CMS и обучение команды",
          "SEO-база и скорость 90+",
          "3 итерации правок",
          "Поддержка 60 дней",
        ],
        popular: true,
        cta: "Обсудить сайт",
      },
      {
        id: "product",
        name: "Цифровой продукт",
        price: "от 900 000 ₽",
        term: "8–12 недель",
        description: "Веб-сервис или SaaS с бэкендом и админкой.",
        features: [
          "Исследование и прототип",
          "Личный кабинет и оплаты",
          "Админка и роли",
          "Бэкенд, API, тесты",
          "CI/CD и мониторинг",
          "Команда на связи 5/7",
        ],
        cta: "Собрать продукт",
      },
    ] as Plan[],
    addons: [
      { title: "3D-сцена для сайта", price: "от 90 000 ₽" },
      { title: "Копирайтинг и контент", price: "от 35 000 ₽" },
      { title: "Поддержка после запуска", price: "от 40 000 ₽/мес" },
    ],
  },

  faq: {
    index: "07",
    label: "Вопросы",
    title: "Коротко о важном",
    accent: "важном",
    description: "Если ответа нет — напишите, ответим лично.",
    items: [
      {
        q: "Сколько стоит сайт?",
        a: "Лендинг — от 180 000 ₽, корпоративный сайт — от 450 000 ₽, веб-сервис — от 900 000 ₽. Точная смета после 30-минутного дискавери: считаем по экранам, интеграциям и контенту, а не «на глаз».",
      },
      {
        q: "Какие сроки?",
        a: "Лендинг — 2–4 недели, сайт компании — 6–8 недель, продукт — 8–12 недель. Срок фиксируем в договоре вместе со штрафом за просрочку по нашей вине.",
      },
      {
        q: "Что нужно от нас для старта?",
        a: "30 минут на интервью, доступ к текущему сайту и аналитике, контент. Тексты и фото можем собрать сами — это отдельная услуга.",
      },
      {
        q: "Как проходит оплата?",
        a: "40% — предоплата, 40% — после утверждения дизайна, 20% — после запуска. Работаем по договору и ЭДО, принимаем безнал.",
      },
      {
        q: "Работаете по NDA?",
        a: "Да, подписываем до обсуждения деталей. В портфолио показываем проект только с письменного согласия клиента.",
      },
      {
        q: "Что будет после запуска?",
        a: "30 дней бесплатной гарантии и обучение вашей команды. Дальше — поддержка от 40 000 ₽ в месяц или передача кода и документации без условий.",
      },
    ] as FaqItem[],
  },

  contact: {
    index: "08",
    label: "Контакты",
    title: "Обсудим ваш проект",
    accent: "проект",
    description:
      "Расскажите задачу — вернёмся с планом, сметой и сроком. Без презентаций, продаж и «давайте созвонимся ещё раз».",
    form: {
      name: "Имя",
      namePlaceholder: "Как к вам обращаться",
      company: "Компания",
      companyPlaceholder: "Необязательно",
      contact: "Email или Telegram",
      contactPlaceholder: "you@company.ru или @username",
      budget: "Бюджет",
      budgets: [
        "До 250 000 ₽",
        "250–500 000 ₽",
        "500 000–1 000 000 ₽",
        "Более 1 000 000 ₽",
        "Пока не знаю",
      ],
      message: "Задача",
      messagePlaceholder: "Что делаем, для кого, к какому сроку",
      submit: "Отправить заявку",
      sending: "Отправляем…",
      successTitle: "Заявка ушла",
      successText:
        "Мы уже читаем. Ответим на указанный контакт в течение 3 часов в рабочее время.",
      successReset: "Отправить ещё одну",
      errorName: "Укажите, как к вам обращаться",
      errorContact: "Нужен email или Telegram для ответа",
      errorMessage: "Пара слов о задаче — чтобы мы ответили по делу",
      privacy: "Отправляя форму, вы соглашаетесь с политикой конфиденциальности.",
    },
    meta: [
      { label: "Почта", value: "hello@d3.studio", href: "mailto:hello@d3.studio" },
      { label: "Telegram", value: "@d3studio", href: "https://t.me/d3studio" },
      { label: "Офис", value: "Москва · Дизайн-завод «Флакон»" },
      { label: "Ответ", value: "3 часа в рабочее время" },
    ],
  },

  footer: {
    tagline: "Сайты, сервисы и 3D для бизнеса, которому нужно больше.",
    columns: [
      {
        title: "Студия",
        links: [
          { label: "Подход", href: "#approach" },
          { label: "Кейсы", href: "#work" },
          { label: "Процесс", href: "#process" },
          { label: "Контакты", href: "#contact" },
        ],
      },
      {
        title: "Услуги",
        links: [
          { label: "Корпоративные сайты", href: "#services" },
          { label: "Лендинги", href: "#services" },
          { label: "Веб-сервисы", href: "#services" },
          { label: "Магазины", href: "#services" },
          { label: "3D и дизайн-системы", href: "#services" },
        ],
      },
      {
        title: "Документы",
        links: [
          { label: "Политика конфиденциальности", href: "#" },
          { label: "Договор", href: "#" },
          { label: "NDA", href: "#" },
        ],
      },
    ] as { title: string; links: NavItem[] }[],
    legal: "© 2026 D3 Studio. Все права защищены.",
    madeWith: "Сделано на Next.js, Three.js и чистом упрямстве",
    backToTop: "Наверх",
  },
};

export type SiteContent = typeof site;
