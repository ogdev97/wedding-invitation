"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Language = "en" | "zh";

/* ------------------------------------------------------------------ */
/*  Dictionaries                                                       */
/*  `en` defines the canonical shape; `zh` must mirror it exactly.     */
/* ------------------------------------------------------------------ */

const en = {
  nav: {
    home: "Home",
    story: "Story",
    details: "Details",
    gallery: "Gallery",
    rsvp: "RSVP",
  },
  hero: {
    invitation: "An Invitation",
    coupleDate: "15 . 05 . 2027",
    openInvitation: "Open Invitation",
    togetherFamilies: "Together with their families",
    weddingOf: "The Wedding of",
    fullDate: "15th May 2027",
    venue: "VTEC Batu Kawan",
    countdown: "Counting down to forever",
    scroll: "Scroll",
  },
  countdown: {
    days: "Days",
    hours: "Hours",
    mins: "Mins",
    secs: "Secs",
  },
  story: {
    chapter: "Chapter One",
    title: "Our Story",
    quote:
      "Two souls, one path. What started as a chance encounter grew into a love story written in the stars — and now, we invite you to witness our forever.",
    signature: "— Norman & Joo Yi",
    timeline: [
      { year: "Our Meeting", desc: "Where it all began" },
      { year: "Our Journey", desc: "Every moment counted" },
      { year: "Our Forever", desc: "15th May 2027" },
    ],
  },
  details: {
    markCalendar: "Mark Your Calendar",
    title: "The Details",
    cards: {
      date: { label: "Date", value: "15 May 2027", sub: "Saturday" },
      venue: { label: "Venue", value: "VTEC", sub: "Batu Kawan" },
      time: { label: "Time", value: "6:00 PM", sub: "onwards" },
      dress: { label: "Dress Code", value: "Formal", sub: "No colour preference" },
    },
    morningProgramme: "Morning Programme",
    dinnerProgramme: "Dinner Programme",
    morningEvents: [
      {
        time: "9:00 AM",
        title: "Marriage Ceremony",
        desc: "嫁娶 — tea ceremony at the bride's home.",
        location: "Kulim · Bride's Home",
      },
      {
        time: "11:00 AM",
        title: "Tea Ceremony",
        desc: "Tea ceremony at the groom's home.",
        location: "Bayan Lepas, Penang · Groom's Home",
      },
    ],
    events: [
      {
        time: "6:00 PM",
        title: "Photoshoot Session",
        desc: "Photo session with the couple.",
      },
      {
        time: "6:30 PM",
        title: "Cocktail Reception",
        desc: "Welcome drinks and mingling with guests.",
      },
      {
        time: "7:30 PM",
        title: "Wedding Dinner",
        desc: "Feast and celebrate with loved ones.",
      },
      {
        time: "10:00 PM",
        title: "Celebration Ends",
        desc: "Thank you for sharing this day with us.",
      },
    ],
  },
  gallery: {
    moments: "Our Moments",
    title: "Gallery",
    swipe: "Swipe to explore",
    photos: [
      { caption: "Pure Joy", sub: "Petals in the air" },
      { caption: "Together", sub: "Side by side" },
      { caption: "The Rings", sub: "Sealed with love" },
      { caption: "Our Vows", sub: "Words from the heart" },
      { caption: "Forever Starts", sub: "The ceremony" },
    ],
  },
  rsvp: {
    invited: "You're Invited",
    title: "RSVP",
    respondBy: "Kindly respond by 1st April 2027",
    form: {
      nameLabel: "Full Name *",
      namePlaceholder: "Your full name",
      phoneLabel: "Phone Number *",
      phonePlaceholder: "e.g. +60 12-345 6789",
      sideLabel: "Bride or Groom side? *",
      brideSide: "Bride's Side",
      groomSide: "Groom's Side",
      paxLabel: "How many PAX",
      adults: "Guests",
      adultUnit: "adult",
      adultsUnit: "adults",
      guestsInfo:
        "Kids aged 5–12 who don't need a baby chair can be counted as Guests.",
      babiesLabel: "Babies (need baby chair)",
      babyUnit: "baby",
      babiesUnit: "babies",
      dietaryLabel: "Dietary Requirements",
      dietaryPlaceholder: "Vegetarian, halal, allergies…",
      messageLabel: "Message to the Couple",
      messagePlaceholder: "Share your wishes…",
      submit: "Send RSVP",
      sending: "Sending…",
      errorFill:
        "Please fill in name, phone, and select Bride's or Groom's side.",
      errorGeneric: "Something went wrong. Please try again.",
    },
    duplicate: {
      title: "You've already RSVP'd",
      body: "We've already received a response from this device. If you need to update or correct your details, please reach out to the couple directly.",
      whatsappGroom: "WhatsApp Groom",
      whatsappBride: "WhatsApp Bride",
    },
    success: {
      badge: "RSVP Received",
      thankYou: "Thank you!",
      thankYouNamed: "Thank you, {name}!",
      body: "Your response has been lovingly recorded.",
      brideFamily: " The bride's family can't wait to celebrate with you.",
      groomFamily: " The groom's family can't wait to celebrate with you.",
      bothFamily: " We can't wait to celebrate with you.",
      seeYou: "See you on",
      updateNote: "Need to update your details? Contact the couple at",
    },
    contact: {
      intro:
        "For any corrections, misinformation, or other queries, please contact",
      groom: "Groom",
      bride: "Bride",
    },
  },
  audio: {
    hint: "Tap to play music",
  },
};

export type Dict = typeof en;

const zh: Dict = {
  nav: {
    home: "首页",
    story: "故事",
    details: "详情",
    gallery: "相册",
    rsvp: "回复",
  },
  hero: {
    invitation: "诚挚邀请",
    coupleDate: "2027 . 05 . 15",
    openInvitation: "打开请柬",
    togetherFamilies: "在双方家庭的祝福下",
    weddingOf: "诚邀您见证",
    fullDate: "2027年5月15日",
    venue: "VTEC・峇都加湾",
    countdown: "倒数我们的永远",
    scroll: "向下滑动",
  },
  countdown: {
    days: "天",
    hours: "时",
    mins: "分",
    secs: "秒",
  },
  story: {
    chapter: "第一章",
    title: "我们的故事",
    quote:
      "两个灵魂，一条路。始于一次偶然的相遇，渐渐写成一段命中注定的爱情——如今，我们诚邀您见证我们的永远。",
    signature: "— Norman & Joo Yi",
    timeline: [
      { year: "我们的相遇", desc: "一切的开始" },
      { year: "我们的旅程", desc: "每一刻都珍贵" },
      { year: "我们的永远", desc: "2027年5月15日" },
    ],
  },
  details: {
    markCalendar: "记下这个日子",
    title: "婚礼详情",
    cards: {
      date: { label: "日期", value: "2027年5月15日", sub: "星期六" },
      venue: { label: "地点", value: "VTEC", sub: "峇都加湾" },
      time: { label: "时间", value: "傍晚6点", sub: "起" },
      dress: { label: "着装要求", value: "正式着装", sub: "无颜色限制" },
    },
    morningProgramme: "早晨流程",
    dinnerProgramme: "晚宴流程",
    morningEvents: [
      {
        time: "上午 9:00",
        title: "嫁娶",
        desc: "在女方家中举行敬茶仪式。",
        location: "居林 · 女方家",
      },
      {
        time: "上午 11:00",
        title: "敬茶仪式",
        desc: "在男方家中举行敬茶仪式。",
        location: "峇六拜，槟城 · 男方家",
      },
    ],
    events: [
      {
        time: "傍晚 6:00",
        title: "婚纱拍摄",
        desc: "与新人合影留念。",
      },
      {
        time: "傍晚 6:30",
        title: "鸡尾酒会",
        desc: "迎宾饮品，与宾客欢聚。",
      },
      {
        time: "晚上 7:30",
        title: "婚宴开席",
        desc: "与挚爱共享盛宴，欢庆良辰。",
      },
      {
        time: "晚上 10:00",
        title: "婚宴结束",
        desc: "感谢您与我们共度此日。",
      },
    ],
  },
  gallery: {
    moments: "美好瞬间",
    title: "相册",
    swipe: "滑动浏览",
    photos: [
      { caption: "纯粹的喜悦", sub: "花瓣纷飞" },
      { caption: "相伴", sub: "并肩而立" },
      { caption: "戒指", sub: "以爱为证" },
      { caption: "誓言", sub: "发自内心的话语" },
      { caption: "永远的开始", sub: "婚礼仪式" },
    ],
  },
  rsvp: {
    invited: "诚邀出席",
    title: "出席回复",
    respondBy: "请于2027年4月1日前回复",
    form: {
      nameLabel: "姓名 *",
      namePlaceholder: "您的姓名",
      phoneLabel: "电话号码 *",
      phonePlaceholder: "例如 +60 12-345 6789",
      sideLabel: "女方或男方亲友？ *",
      brideSide: "女方亲友",
      groomSide: "男方亲友",
      paxLabel: "出席人数",
      adults: "宾客",
      adultUnit: "位成人",
      adultsUnit: "位成人",
      guestsInfo: "5至12岁、不需要婴儿椅的小孩可算作宾客。",
      babiesLabel: "婴儿（需婴儿椅）",
      babyUnit: "位婴儿",
      babiesUnit: "位婴儿",
      dietaryLabel: "饮食需求",
      dietaryPlaceholder: "素食、清真、过敏等…",
      messageLabel: "给新人的祝福",
      messagePlaceholder: "写下您的祝福…",
      submit: "提交回复",
      sending: "提交中…",
      errorFill: "请填写姓名、电话，并选择女方或男方亲友。",
      errorGeneric: "出了点问题，请重试。",
    },
    duplicate: {
      title: "您已经回复过了",
      body: "我们已收到来自此设备的回复。如需更新或更正信息，请直接联系新人。",
      whatsappGroom: "WhatsApp 新郎",
      whatsappBride: "WhatsApp 新娘",
    },
    success: {
      badge: "已收到回复",
      thankYou: "谢谢您！",
      thankYouNamed: "谢谢您，{name}！",
      body: "我们已用心记下您的回复。",
      brideFamily: "女方家庭期待与您共庆。",
      groomFamily: "男方家庭期待与您共庆。",
      bothFamily: "我们期待与您共庆。",
      seeYou: "我们相约",
      updateNote: "需要更新您的信息？请联系新人",
    },
    contact: {
      intro: "如需更正信息或有任何疑问，请联系",
      groom: "新郎",
      bride: "新娘",
    },
  },
  audio: {
    hint: "点击播放音乐",
  },
};

const DICTS: Record<Language, Dict> = { en, zh };

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggle: () => void;
  t: Dict;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "wedding-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start "en" so server and first client render match (no hydration mismatch).
  const [lang, setLangState] = useState<Language>("en");

  // Restore saved preference after mount.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "zh") setLangState(saved);
  }, []);

  // Keep <html lang> in sync for accessibility.
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next = prev === "en" ? "zh" : "en";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, toggle, t: DICTS[lang] }),
    [lang, setLang, toggle]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
