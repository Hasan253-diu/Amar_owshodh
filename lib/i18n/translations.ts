export type Language = 'bn' | 'en';

export interface Translations {
  common: {
    appName: string;
    appNameEn: string;
    appNameBn: string;
    appSubtitle: string;
    appTagline: string;
    loading: string;
    save: string;
    cancel: string;
    update: string;
    delete: string;
    edit: string;
    archive: string;
    activate: string;
    or: string;
    active: string;
    archived: string;
    pending: string;
    taken: string;
    skipped: string;
    all: string;
    date: string;
    time: string;
    status: string;
    notes: string;
    actions: string;
    back: string;
    logout: string;
    login: string;
    register: string;
    user: string;
    admin: string;
    disclaimerTitle: string;
    disclaimerText: string;
    footerCopyright: string;
    guestBannerNotice: string;
    exitGuestMode: string;
    guestActionRestricted: string;
    loginToContinue: string;
    daysOfWeek: string[];
    daysOfWeekShort: string[];
    months: string[];
  };
  navigation: {
    dashboard: string;
    medicines: string;
    schedule: string;
    calendar: string;
    history: string;
    reports: string;
    settings: string;
    profile: string;
    adminPanel: string;
  };
  home: {
    badge: string;
    heroTitle1: string;
    heroTitle2: string;
    heroSubtitle: string;
    getStarted: string;
    viewDemo: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    newUser: string;
    createAccount: string;
    alreadyHaveAccount: string;
    signIn: string;
    registerTitle: string;
    registerSubtitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    rememberMe: string;
    forgotPassword: string;
    submitting: string;
    registerAgreement: string;
    guestDemo: string;
    resendVerification: string;
    resending: string;
    verificationSentSuccess: string;
    emailNotVerifiedTitle: string;
    emailNotVerifiedDesc: string;
    registrationSuccessTitle: string;
    registrationSuccessDesc: string;
    checkInboxInstruction: string;
    emailVerifiedSuccess: string;
    guestSigningIn: string;
  };
  dashboard: {
    title: string;
    description: string;
    addNewMedicine: string;
    statActiveMedicines: string;
    statActiveMedicinesSub: string;
    statTodayReminders: string;
    statTodayRemindersSub: string;
    statTaken: string;
    statTakenSub: string;
    statPending: string;
    statPendingSub: string;
    todayScheduleTitle: string;
    viewAllSchedule: string;
    noTodayReminders: string;
    noTodayRemindersDesc: string;
    weeklySummaryTitle: string;
    intakeRatio: string;
    trackingRulesTitle: string;
    trackingRulesDesc: string;
    viewDetailedReport: string;
    itemsCountSuffix: string;
  };
  medicines: {
    title: string;
    description: string;
    addNew: string;
    noMedicines: string;
    noMedicinesDesc: string;
    startDate: string;
    endDate: string;
    optional: string;
    required: string;
    nameLabel: string;
    namePlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    prescriptionReminder: string;
    confirmDelete: string;
    editTitle: string;
    editDescription: string;
    addTitle: string;
    addDescription: string;
    saveMedicine: string;
    updateMedicine: string;
    backToList: string;
    schedulesForMedicine: string;
    noSchedulesForMedicine: string;
    addNewSchedule: string;
  };
  schedule: {
    title: string;
    description: string;
    allSchedules: string;
    noSchedules: string;
    noSchedulesDesc: string;
    addNewSchedule: string;
    addScheduleButton: string;
    addingScheduleButton: string;
    mustAddMedicineFirst: string;
    selectMedicine: string;
    reminderTime: string;
    repeatDays: string;
    everyday: string;
    successMessage: string;
    timePrefix: string;
  };
  calendar: {
    title: string;
    description: string;
    prevMonth: string;
    nextMonth: string;
    selectDatePrompt: string;
    noRecordsForDate: string;
    detailsForDate: string;
    recordedAtPrefix: string;
  };
  history: {
    title: string;
    description: string;
    exportCSV: string;
    downloadPDF: string;
    generatingPDF: string;
    noRecordsForPDF: string;
    filterMedicine: string;
    allMedicines: string;
    filterStatus: string;
    allStatuses: string;
    filterDate: string;
    noHistory: string;
    noHistoryDesc: string;
    tableMedicine: string;
    tableSchedule: string;
    tableStatus: string;
    tableRecordedAt: string;
    tableNotes: string;
  };
  reports: {
    title: string;
    description: string;
    adherenceRate: string;
    adherenceRateSub: string;
    totalTaken: string;
    totalTakenSub: string;
    totalSkipped: string;
    totalSkippedSub: string;
    totalPending: string;
    totalPendingSub: string;
    weeklySummaryTitle: string;
    weeklySummaryDesc: string;
    ratioTitle: string;
    ratioDesc: string;
    noData: string;
    timesSuffix: string;
  };
  settings: {
    title: string;
    description: string;
    profileTitle: string;
    profileDesc: string;
    notificationsTitle: string;
    notificationsDesc: string;
    browserPermission: string;
    currentStatus: string;
    grantPermission: string;
    notificationSuccess: string;
    backupTitle: string;
    backupDesc: string;
    backupExpl: string;
    exportHistoryButton: string;
    unspecified: string;
  };
  profile: {
    title: string;
    description: string;
    personalInfo: string;
    personalInfoDesc: string;
    editProfile: string;
    saveChanges: string;
    saving: string;
    cancel: string;
    fullName: string;
    fullNamePlaceholder: string;
    emailAddress: string;
    phoneNumber: string;
    phoneNumberPlaceholder: string;
    notProvided: string;
    accountRole: string;
    userRole: string;
    adminRole: string;
    createdAt: string;
    avatarTitle: string;
    avatarDesc: string;
    uploadPhoto: string;
    changePhoto: string;
    removePhoto: string;
    photoUploadSuccess: string;
    photoUploadError: string;
    photoRemoveSuccess: string;
    guestProfileWarning: string;
    backToDashboard: string;
    logout: string;
    updateSuccess: string;
    updateError: string;
    unspecified: string;
  };
  notifications: {
    title: string;
    newBadge: string;
    noNotifications: string;
    markAsRead: string;
    enableBrowser: string;
  };
  admin: {
    title: string;
    description: string;
    badge: string;
    restricted: string;
    restrictedDesc: string;
    totalUsers: string;
    totalUsersSub: string;
    totalMedicines: string;
    totalMedicinesSub: string;
    totalSchedules: string;
    totalSchedulesSub: string;
    totalResponses: string;
    totalResponsesSub: string;
    privacyNotice: string;
    recentUsersTitle: string;
    userId: string;
    name: string;
    email: string;
    regDate: string;
  };
}

export const translations: Record<Language, Translations> = {
  bn: {
    common: {
      appName: "আমার ঔষধ (Amar Owshodh)",
      appNameEn: "Amar Owshodh",
      appNameBn: "আমার ঔষধ",
      appSubtitle: "ব্যক্তিগত ঔষধ রিমাইন্ডার ও ট্র্যাকিং",
      appTagline: "সঠিক সময়ে ঔষধ গ্রহণের নির্ভরযোগ্য সহকারী",
      loading: "লোড হচ্ছে...",
      save: "সংরক্ষণ করুন",
      cancel: "বাতিল",
      update: "আপডেট করুন",
      delete: "মুছে ফেলুন",
      edit: "সম্পাদনা",
      archive: "আর্কাইভ করুন",
      activate: "সক্রিয় করুন",
      or: "অথবা",
      active: "সক্রিয়",
      archived: "আর্কাইভড",
      pending: "অপেক্ষমান",
      taken: "গৃহীত",
      skipped: "বাদ দেওয়া হয়েছে",
      all: "সকল",
      date: "তারিখ",
      time: "সময়",
      status: "স্ট্যাটাস",
      notes: "মন্তব্য / নোট",
      actions: "অ্যাকশন",
      back: "ফিরে যান",
      logout: "লগআউট",
      login: "লগইন",
      register: "নিবন্ধন করুন",
      user: "ব্যবহারকারী",
      admin: "অ্যাডমিন",
      disclaimerTitle: "জরুরি সতর্কতা ও দায়মুক্তি:",
      disclaimerText: "আমার ঔষধ (Amar Owshodh) শুধুমাত্র একটি রিমাইন্ডার ও ব্যক্তিগত রেকর্ড ব্যবস্থাপনা সহায়িকা। এটি কোনো প্রকার রোগ নির্ণয়, প্রেসক্রিপশন প্রদান, ডোজ নির্ধারণ বা চিকিৎসা সংক্রান্ত পরামর্শ দেয় না। সর্বদা নিবন্ধিত চিকিৎসকের নির্দেশ অনুযায়ী ঔষধ গ্রহণ করুন।",
      footerCopyright: "© 2026 আমার ঔষধ (Amar Owshodh). সর্বস্বত্ব সংরক্ষিত।",
      guestBannerNotice: "আপনি গেস্ট মোডে আছেন। এটি শুধুমাত্র ডেমো ইন্টারফেস দেখার জন্য। ঔষধ বা শিডিউল সংরক্ষণ করতে অনুগ্রহ করে লগইন করুন।",
      exitGuestMode: "গেস্ট মোড থেকে প্রস্থান",
      guestActionRestricted: "এই সুবিধাটি ব্যবহার করতে অনুগ্রহ করে লগইন বা রেজিস্ট্রেশন করুন।",
      loginToContinue: "লগইন / রেজিস্টার করুন",
      daysOfWeek: ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"],
      daysOfWeekShort: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি"],
      months: ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"]
    },
    navigation: {
      dashboard: "ড্যাশবোর্ড",
      medicines: "ঔষধসমূহ",
      schedule: "রুটিন ও শিডিউল",
      calendar: "ক্যালেন্ডার",
      history: "ঔষধের ইতিহাস",
      reports: "রিপোর্ট ও ট্র্যাকিং",
      settings: "সেটিংস",
      profile: "প্রোফাইল",
      adminPanel: "অ্যাডমিন প্যানেল"
    },
    home: {
      badge: "ব্যক্তিগত ও নিরাপদ ঔষধ ট্র্যাকিং",
      heroTitle1: "সঠিক সময়ে ঔষধ গ্রহণের",
      heroTitle2: "নির্ভরযোগ্য সহকারী",
      heroSubtitle: "আমার ঔষধ আপনাকে দেয় ঔষধের রুটিন পরিচালনা, তাৎক্ষণিক নোটিফিকেশন রিমাইন্ডার এবং নিয়মিত ঔষধ গ্রহণের নির্ভুল ইতিহাস সংরক্ষণের সুবিধা।",
      getStarted: "বিনামূল্যে শুরু করুন",
      viewDemo: "ড্যাশবোর্ড ডেমো দেখুন",
      feature1Title: "নির্দিষ্ট সময়ে রিমাইন্ডার",
      feature1Desc: "সঠিক সময়ে ইন-অ্যাপ নোটিফিকেশন ও অ্যালার্টের মাধ্যমে কোনো ঔষধের ডোজ মিস হবে না।",
      feature2Title: "ইনটেক স্ট্যাটাস ট্র্যাকিং",
      feature2Desc: "প্রতিটি ঔষধ গ্রহণের পর সরাসরি ‘Taken’ বা ‘Skipped’ চিহ্নিত করে নির্ভুল রেকর্ড বজায় রাখুন।",
      feature3Title: "দৈনিক ও সাপ্তাহিক ক্যালেন্ডার",
      feature3Desc: "ক্যালেন্ডার ও হিস্ট্রি ভিউয়ের মাধ্যমে আপনার বিগত এবং সামনের ঔষধের রুটিন একনজরে দেখুন।"
    },
    auth: {
      loginTitle: "আপনার একাউন্টে প্রবেশ করুন",
      loginSubtitle: "নতুন ব্যবহারকারী?",
      newUser: "নতুন ব্যবহারকারী?",
      createAccount: "নতুন একাউন্ট খুলুন",
      alreadyHaveAccount: "ইতিমধ্যে একাউন্ট আছে?",
      signIn: "লগইন করুন",
      registerTitle: "নতুন একাউন্ট তৈরি করুন",
      registerSubtitle: "ইতিমধ্যে একাউন্ট আছে?",
      fullName: "পুরো নাম",
      fullNamePlaceholder: "আপনার নাম",
      email: "ইমেইল এড্রেস",
      emailPlaceholder: "name@example.com",
      password: "পাসওয়ার্ড",
      passwordPlaceholder: "কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড",
      rememberMe: "মনে রাখুন",
      forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
      submitting: "যাচাই করা হচ্ছে...",
      registerAgreement: "নিবন্ধন করার মাধ্যমে আপনি আমাদের শর্তাবলী ও চিকিৎসা বিষয়ক সতর্কবার্তা মেনে নিচ্ছেন।",
      guestDemo: "গেস্ট হিসেবে ড্যাশবোর্ড দেখুন",
      resendVerification: "ভেরিফিকেশন ইমেইল পুনরায় পাঠান",
      resending: "ইমেইল পাঠানো হচ্ছে...",
      verificationSentSuccess: "ভেরিফিকেশন ইমেইল পাঠানো হয়েছে! অনুগ্রহ করে আপনার ইনবক্স অথবা স্প্যাম ফোল্ডার চেক করুন।",
      emailNotVerifiedTitle: "ইমেইল ভেরিফিকেশন বাকি রয়েছে",
      emailNotVerifiedDesc: "আপনার অ্যাকাউন্ট সক্রিয় করার জন্য ইমেইল ভেরিফাই করা প্রয়োজন। অনুগ্রহ করে আপনার ইনবক্স চেক করুন অথবা পুনরায় লিংক পাঠান।",
      registrationSuccessTitle: "নিবন্ধন সফল হয়েছে!",
      registrationSuccessDesc: "আপনার একাউন্ট তৈরি সম্পন্ন হয়েছে।",
      checkInboxInstruction: "আপনার ইমেইল অ্যাড্রেসে একটি অ্যাক্টিভেশন লিংক পাঠানো হয়েছে। অনুগ্রহ করে ইনবক্স অথবা স্প্যাম ফোল্ডার চেক করে লিংকে ক্লিক করুন।",
      emailVerifiedSuccess: "আপনার ইমেইল সফলভাবে ভেরিফাই করা হয়েছে! অনুগ্রহ করে লগইন করুন।",
      guestSigningIn: "গেস্ট হিসেবে প্রবেশ করা হচ্ছে...",
    },
    dashboard: {
      title: "ড্যাশবোর্ড (ওভারভিউ)",
      description: "আপনার আজকের ঔষধের সময়সূচী এবং বর্তমান ট্র্যাকিং স্ট্যাটাস দেখুন।",
      addNewMedicine: "নতুন ঔষধ যোগ করুন",
      statActiveMedicines: "মোট সক্রিয় ঔষধ",
      statActiveMedicinesSub: "চলতি প্রেসক্রিপশন অনুযায়ী",
      statTodayReminders: "আজকের রিমাইন্ডার",
      statTodayRemindersSub: "নির্ধারিত মোট ডোজ",
      statTaken: "গৃহীত ঔষধ (Taken)",
      statTakenSub: "আজ সফলভাবে সম্পন্ন",
      statPending: "অপেক্ষমান (Pending)",
      statPendingSub: "পরবর্তী নির্ধারিত সময়সূচী",
      todayScheduleTitle: "আজকের শিডিউল ও রিমাইন্ডার",
      viewAllSchedule: "সম্পূর্ণ শিডিউল দেখুন",
      noTodayReminders: "আজকের কোনো রিমাইন্ডার নির্ধারিত নেই",
      noTodayRemindersDesc: "আপনার কোনো সক্রিয় শিডিউল থাকলে তা স্বয়ংক্রিয়ভাবে এখানে প্রদর্শিত হবে।",
      weeklySummaryTitle: "আজকের ট্র্যাকিং সারাংশ",
      intakeRatio: "ঔষধ গ্রহণের অনুপাত",
      trackingRulesTitle: "💡 ট্র্যাকিং নিয়মাবলী",
      trackingRulesDesc: "ঔষধ নিজে নিজে স্বয়ংক্রিয়ভাবে Taken চিহ্নিত হবে না। ঔষধ গ্রহণের পর আপনি নিজেই 'Taken' বোতাম চাপুন অথবা বাদ পড়লে 'Skip' চাপুন।",
      viewDetailedReport: "বিস্তারিত রিপোর্ট দেখুন →",
      itemsCountSuffix: "টি"
    },
    medicines: {
      title: "ঔষধ তালিকা (Medicines)",
      description: "আপনার সকল নিবন্ধিত সক্রিয় এবং আর্কাইভ করা ঔষধ পরিচালনা করুন।",
      addNew: "নতুন ঔষধ যোগ করুন",
      noMedicines: "কোনো ঔষধ পাওয়া যায়নি",
      noMedicinesDesc: "আপনি এখনও কোনো ঔষধ যোগ করেননি। চিকিৎসকের প্রেসক্রিপশন অনুযায়ী আপনার প্রথম ঔষধ যোগ করুন।",
      startDate: "শুরুর তারিখ",
      endDate: "শেষের তারিখ",
      optional: "(ঐচ্ছিক)",
      required: "*",
      nameLabel: "ঔষধের নাম ও পাওয়ার",
      namePlaceholder: "যেমন: Napa Extra 500mg, Seclo 20mg",
      notesLabel: "নির্দেশনা ও নোট",
      notesPlaceholder: "যেমন: খাবার ৩০ মিনিট পর ভরা পেটে সেবন করতে হবে।",
      prescriptionReminder: "শুধুমাত্র আপনার চিকিৎসকের দেওয়া সঠিক ব্যবস্থাপত্র অনুযায়ী তথ্য ও সময়সূচী লিখুন।",
      confirmDelete: "আপনি কি নিশ্চিতভাবে এই ঔষধটি মুছে ফেলতে চান?",
      editTitle: "ঔষধের তথ্য সম্পাদনা",
      editDescription: "ঔষধের বিবরণ ও দৈনিক রিমাইন্ডার শিডিউল পরিচালনা করুন।",
      addTitle: "নতুন ঔষধ যুক্ত করুন",
      addDescription: "আপনার চিকিৎসকের পরামর্শ অনুযায়ী সঠিক ঔষধের নাম ও প্রয়োজনীয় তথ্য পূরণ করুন।",
      saveMedicine: "ঔষধ সংরক্ষণ করুন",
      updateMedicine: "আপডেট করুন",
      backToList: "ঔষধ তালিকায় ফিরে যান",
      schedulesForMedicine: "নির্ধারিত রিমাইন্ডার শিডিউল",
      noSchedulesForMedicine: "এই ঔষধের জন্য এখনও কোনো সময়সূচী তৈরি করা হয়নি।",
      addNewSchedule: "নতুন সময়সূচী যোগ করুন"
    },
    schedule: {
      title: "ঔষধের রুটিন ও শিডিউল (Schedules)",
      description: "দৈনিক এবং সাপ্তাহিক ঔষধ গ্রহণের অ্যালার্ট ও সময়সূচী ব্যবস্থাপনা করুন।",
      allSchedules: "সকল নির্ধারিত শিডিউল",
      noSchedules: "কোনো শিডিউল তৈরি করা হয়নি",
      noSchedulesDesc: "ঔষধ গ্রহণের নির্দিষ্ট সময় সেট করতে ডানপাশের ফরম ব্যবহার করুন।",
      addNewSchedule: "নতুন শিডিউল যুক্ত করুন",
      addScheduleButton: "শিডিউল যুক্ত করুন",
      addingScheduleButton: "যুক্ত করা হচ্ছে...",
      mustAddMedicineFirst: "শিডিউল তৈরি করার জন্য প্রথমে কমপক্ষে একটি ঔষধ যোগ করতে হবে।",
      selectMedicine: "ঔষধ নির্বাচন করুন",
      reminderTime: "রিমাইন্ডারের সময়",
      repeatDays: "পুনরাবৃত্তি দিনসমূহ (Repeat Days)",
      everyday: "প্রতিদিন",
      successMessage: "নতুন শিডিউল সফলভাবে যুক্ত করা হয়েছে!",
      timePrefix: "সময়:"
    },
    calendar: {
      title: "ক্যালেন্ডার ভিউ (Medicine Calendar)",
      description: "মাসিক ক্যালেন্ডারের মাধ্যমে আপনার ঔষধের শিডিউল এবং অতীত ইতিহাস পর্যবেক্ষণ করুন।",
      prevMonth: "পূর্ববর্তী মাস",
      nextMonth: "পরবর্তী মাস",
      selectDatePrompt: "ক্যালেন্ডার থেকে যেকোনো তারিখে ক্লিক করে ওই দিনের বিস্তারিত রেকর্ড দেখুন।",
      noRecordsForDate: "এই তারিখে কোনো ঔষধের রেকর্ড পাওয়া যায়নি।",
      detailsForDate: "তারিখের শিডিউল",
      recordedAtPrefix: "রেকর্ডকৃত সময়:"
    },
    history: {
      title: "ঔষধের ইতিহাস (Medicine History)",
      description: "আপনার বিগত দিনের সকল ঔষধ গ্রহণ এবং বাদ পড়ার নির্ভুল ইতিহাস ও সঠিক টাইমস্ট্যাম্প দেখুন।",
      exportCSV: "PDF ডাউনলোড করুন",
      downloadPDF: "PDF ডাউনলোড করুন",
      generatingPDF: "PDF তৈরি হচ্ছে...",
      noRecordsForPDF: "ডাউনলোড করার মতো কোনো রেকর্ড পাওয়া যায়নি।",
      filterMedicine: "ঔষধ অনুযায়ী ফিল্টার",
      allMedicines: "সকল ঔষধ",
      filterStatus: "স্ট্যাটাস অনুযায়ী ফিল্টার",
      allStatuses: "সকল স্ট্যাটাস",
      filterDate: "তারিখ অনুযায়ী ফিল্টার",
      noHistory: "কোনো হিস্ট্রি রেকর্ড পাওয়া যায়নি",
      noHistoryDesc: "নির্বাচিত ফিল্টারের সাথে মিলে এমন কোনো ঔষধের রেকর্ড ডাটাবেজে নেই।",
      tableMedicine: "ঔষধের নাম",
      tableSchedule: "নির্ধারিত সময়সূচী",
      tableStatus: "স্ট্যাটাস",
      tableRecordedAt: "রেকর্ডের সময়",
      tableNotes: "মন্তব্য / নোট"
    },
    reports: {
      title: "রিপোর্ট ও ট্র্যাকিং পরিসংখ্যান (Reports)",
      description: "আপনার ঔষধ গ্রহণের সাপ্তাহিক ও সামগ্রিক তথ্য পর্যবেক্ষণ করুন।",
      adherenceRate: "ঔষধ গ্রহণের হার",
      adherenceRateSub: "গৃহীত বনাম বাদ দেওয়া অনুপাত",
      totalTaken: "মোট গৃহীত (Taken)",
      totalTakenSub: "সফলভাবে সম্পন্ন ডোজ",
      totalSkipped: "মোট বাদ পড়া (Skipped)",
      totalSkippedSub: "মিস করা ডোজ",
      totalPending: "মোট অপেক্ষমান (Pending)",
      totalPendingSub: "প্রক্রিয়াধীন শিডিউল",
      weeklySummaryTitle: "বিগত ৭ দিনের ট্র্যাকিং সামারি",
      weeklySummaryDesc: "দৈনিক গৃহীত এবং বাদ দেওয়া ঔষধের সংখ্যা",
      ratioTitle: "সামগ্রিক অনুপাত",
      ratioDesc: "সকল স্ট্যাটাসের অনুপাত",
      noData: "কোনো ডাটা পাওয়া যায়নি",
      timesSuffix: "বার"
    },
    settings: {
      title: "সেটিংস ও প্রোফাইল (Settings)",
      description: "আপনার অ্যাকাউন্ট তথ্য, নোটিফিকেশন অনুমতি এবং সিস্টেম কনফিগারেশন পরিচালনা করুন।",
      profileTitle: "ব্যক্তিগত প্রোফাইল",
      profileDesc: "আপনার প্রাথমিক অ্যাকাউন্ট বিবরণী",
      notificationsTitle: "ব্রাউজার ও ইন-অ্যাপ নোটিফিকেশন",
      notificationsDesc: "ডেস্কটপ এবং ওয়েব রিমাইন্ডার সতর্কতা নিয়ন্ত্রণ করুন",
      browserPermission: "ব্রাউজার নোটিফিকেশন পারমিশন",
      currentStatus: "বর্তমান অবস্থা:",
      grantPermission: "অনুমতি দিন",
      notificationSuccess: "ব্রাউজার নোটিফিকেশন সফলভাবে সক্রিয় করা হয়েছে!",
      backupTitle: "মেডিকেল রিপোর্ট ও ইতিহাস এক্সপোর্ট",
      backupDesc: "আপনার সকল রেকর্ড সুসংগঠিত PDF আকারে ডাউনলোড করুন",
      backupExpl: "আপনি যেকোনো সময় 'ঔষধের ইতিহাস' পেজ থেকে এক ক্লিকে সম্পূর্ণ ঔষধ গ্রহণের ইতিহাস অফিসিয়াল PDF ফাইল হিসেবে ডাউনলোড করতে পারেন।",
      exportHistoryButton: "হিস্ট্রি পেজে গিয়ে PDF ডাউনলোড করুন",
      unspecified: "উল্লেখ নেই"
    },
    profile: {
      title: "ইউজার প্রোফাইল (User Profile)",
      description: "আপনার ব্যক্তিগত অ্যাকাউন্ট বিবরণী, নাম ও যোগাযোগের তথ্য পর্যবেক্ষণ ও আপডেট করুন।",
      personalInfo: "ব্যক্তিগত তথ্য",
      personalInfoDesc: "আপনার অ্যাকাউন্ট ও প্রোফাইলের প্রাথমিক বিবরণী",
      editProfile: "প্রোফাইল সম্পাদনা করুন",
      saveChanges: "পরিবর্তন সংরক্ষণ করুন",
      saving: "সংরক্ষণ করা হচ্ছে...",
      cancel: "বাতিল",
      fullName: "পুরো নাম",
      fullNamePlaceholder: "আপনার পুরো নাম লিখুন",
      emailAddress: "ইমেইল এড্রেস",
      phoneNumber: "ফোন নম্বর",
      phoneNumberPlaceholder: "আপনার যোগাযোগের ফোন নম্বর লিখুন (যেমন: 017XXXXXXXX)",
      notProvided: "প্রদান করা হয়নি",
      accountRole: "অ্যাকাউন্ট রোল",
      userRole: "সাধারণ ব্যবহারকারী (User)",
      adminRole: "সিস্টেম অ্যাডমিনিস্ট্রেটর (Admin)",
      createdAt: "অ্যাকাউন্ট তৈরির তারিখ",
      avatarTitle: "প্রোফাইল পিকচার",
      avatarDesc: "আপনার অ্যাকাউন্টের পরিচয়বাহী ছবি",
      uploadPhoto: "ছবি আপলোড করুন",
      changePhoto: "ছবি পরিবর্তন করুন",
      removePhoto: "ছবি মুছে ফেলুন",
      photoUploadSuccess: "প্রোফাইল ছবি সফলভাবে আপলোড করা হয়েছে!",
      photoUploadError: "ছবি আপলোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন (সর্বোচ্চ ২MB)।",
      photoRemoveSuccess: "প্রোফাইল ছবি সফলভাবে মুছে ফেলা হয়েছে!",
      guestProfileWarning: "আপনি বর্তমানে গেস্ট হিসেবে ব্রাউজ করছেন। ব্যক্তিগত প্রোফাইল তৈরি ও সংরক্ষণ করতে অনুগ্রহ করে একটি অ্যাকাউন্টে লগইন বা সাইন-আপ করুন।",
      backToDashboard: "ড্যাশবোর্ডে ফিরে যান",
      logout: "লগআউট করুন",
      updateSuccess: "আপনার প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে!",
      updateError: "প্রোফাইল আপডেট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      unspecified: "উল্লেখ নেই"
    },
    notifications: {
      title: "রিমাইন্ডার ও নোটিফিকেশন",
      newBadge: "নতুন",
      noNotifications: "কোনো নতুন বিজ্ঞপ্তি নেই।",
      markAsRead: "পঠিত হিসেবে চিহ্নিত করুন",
      enableBrowser: "নোটিফিকেশন চালু করুন"
    },
    admin: {
      title: "অ্যাডমিন ড্যাশবোর্ড (System Administration)",
      description: "সিস্টেমের সামগ্রিক ব্যবহারকারী এবং কার্যক্রমের সমষ্টিগত পরিসংখ্যান।",
      badge: "সুরক্ষিত অ্যাডমিন মোড",
      restricted: "অ্যাক্সেস সংরক্ষিত",
      restrictedDesc: "এই পেজটি শুধুমাত্র সিস্টেম অ্যাডমিনিস্ট্রেটরদের জন্য নির্ধারিত।",
      totalUsers: "মোট নিবন্ধিত ব্যবহারকারী",
      totalUsersSub: "সিস্টেম প্রোফাইল",
      totalMedicines: "মোট নিবন্ধিত ঔষধ",
      totalMedicinesSub: "সকল ইউজারের সমষ্টি",
      totalSchedules: "কনফিগার করা শিডিউল",
      totalSchedulesSub: "দৈনিক ও সাপ্তাহিক অ্যালার্ট",
      totalResponses: "রেকর্ডকৃত রেসপন্স",
      totalResponsesSub: "Taken / Skipped লগসমূহ",
      privacyNotice: "মেডিকেল গোপনীয়তা ও সুরক্ষা নিশ্চিত করতে অ্যাডমিন প্যানেলে ব্যবহারকারীদের ব্যক্তিগত প্রেসক্রিপশন, ঔষধের নাম বা ব্যক্তিগত কোনো স্বাস্থ্য নোট প্রদর্শিত হয় না। এখানে শুধুমাত্র সমষ্টিগত পরিসংখ্যান (Aggregate statistics) প্রদর্শিত হচ্ছে।",
      recentUsersTitle: "সাম্প্রতিক নিবন্ধিত অ্যাকাউন্টসমূহ",
      userId: "ইউজার আইডি",
      name: "নাম",
      email: "ইমেইল",
      regDate: "নিবন্ধনের তারিখ"
    }
  },
  en: {
    common: {
      appName: "Amar Owshodh (আমার ঔষধ)",
      appNameEn: "Amar Owshodh",
      appNameBn: "আমার ঔষধ",
      appSubtitle: "Personal Medicine Reminder & Tracking",
      appTagline: "Your reliable assistant for timely medicine intake",
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      update: "Update",
      delete: "Delete",
      edit: "Edit",
      archive: "Archive",
      activate: "Activate",
      or: "OR",
      active: "Active",
      archived: "Archived",
      pending: "Pending",
      taken: "Taken",
      skipped: "Skipped",
      all: "All",
      date: "Date",
      time: "Time",
      status: "Status",
      notes: "Notes / Instructions",
      actions: "Actions",
      back: "Back",
      logout: "Log Out",
      login: "Log In",
      register: "Sign Up",
      user: "User",
      admin: "Admin",
      disclaimerTitle: "Important Disclaimer & Medical Notice:",
      disclaimerText: "Amar Owshodh is a reminder and personal record management tool only. It does not diagnose conditions, recommend medicines, determine dosages, or provide medical treatment advice. Always take medicines strictly according to instructions from a registered healthcare professional.",
      footerCopyright: "© 2026 Amar Owshodh (আমার ঔষধ). All rights reserved.",
      guestBannerNotice: "You are currently in Guest Mode. This is for previewing demo interfaces only. Please login to save medicines or schedules.",
      exitGuestMode: "Exit Guest Mode",
      guestActionRestricted: "Please login or create an account to use this feature.",
      loginToContinue: "Login / Register",
      daysOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      daysOfWeekShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    },
    navigation: {
      dashboard: "Dashboard",
      medicines: "Medicines",
      schedule: "Routines & Schedules",
      calendar: "Calendar",
      history: "Medicine History",
      reports: "Reports & Tracking",
      settings: "Settings",
      profile: "Profile",
      adminPanel: "Admin Panel"
    },
    home: {
      badge: "Personal & Secure Medicine Tracking",
      heroTitle1: "Your Trusted Assistant for",
      heroTitle2: "Timely Medicine Intake",
      heroSubtitle: "Amar Owshodh helps you manage medication schedules, receive instant notifications, and keep an accurate record of your intake history.",
      getStarted: "Get Started Free",
      viewDemo: "View Dashboard Demo",
      feature1Title: "Timely Reminders",
      feature1Desc: "Never miss a dose with scheduled in-app notifications and timely desktop alerts.",
      feature2Title: "Intake Tracking",
      feature2Desc: "Easily mark each dose as 'Taken' or 'Skipped' to maintain precise health records.",
      feature3Title: "Daily & Weekly Calendar",
      feature3Desc: "Effortlessly review past medication adherence and upcoming schedules at a glance."
    },
    auth: {
      loginTitle: "Sign in to your account",
      loginSubtitle: "New user?",
      newUser: "New user?",
      createAccount: "Create a new account",
      alreadyHaveAccount: "Already have an account?",
      signIn: "Log In",
      registerTitle: "Create your account",
      registerSubtitle: "Already have an account?",
      fullName: "Full Name",
      fullNamePlaceholder: "Your full name",
      email: "Email Address",
      emailPlaceholder: "name@example.com",
      password: "Password",
      passwordPlaceholder: "At least 6 characters",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      submitting: "Verifying...",
      registerAgreement: "By registering, you agree to our terms of service and healthcare disclaimer.",
      guestDemo: "Explore Dashboard as Guest",
      resendVerification: "Resend Verification Email",
      resending: "Sending verification link...",
      verificationSentSuccess: "Verification email sent! Please check your inbox or spam folder.",
      emailNotVerifiedTitle: "Email Verification Required",
      emailNotVerifiedDesc: "Your email address has not been verified yet. Please check your inbox or request a new verification link.",
      registrationSuccessTitle: "Registration Successful!",
      registrationSuccessDesc: "Your account has been created successfully.",
      checkInboxInstruction: "A verification link has been sent to your email. Please check your inbox or spam folder and click the link to activate your account.",
      emailVerifiedSuccess: "Your email has been verified successfully! Please sign in.",
      guestSigningIn: "Entering as guest...",
    },
    dashboard: {
      title: "Dashboard (Overview)",
      description: "View today's medication routine and live intake tracking status.",
      addNewMedicine: "Add New Medicine",
      statActiveMedicines: "Active Medicines",
      statActiveMedicinesSub: "Current active prescriptions",
      statTodayReminders: "Today's Reminders",
      statTodayRemindersSub: "Total scheduled doses",
      statTaken: "Medicines Taken",
      statTakenSub: "Completed successfully today",
      statPending: "Pending Reminders",
      statPendingSub: "Upcoming scheduled doses",
      todayScheduleTitle: "Today's Schedule & Reminders",
      viewAllSchedule: "View Complete Schedule",
      noTodayReminders: "No reminders scheduled for today",
      noTodayRemindersDesc: "Any active schedules for today will appear here automatically.",
      weeklySummaryTitle: "Today's Tracking Summary",
      intakeRatio: "Adherence Ratio",
      trackingRulesTitle: "💡 Tracking Guidelines",
      trackingRulesDesc: "Medicines are never marked as Taken automatically. Please tap 'Taken' once you take your dose, or tap 'Skip' if missed.",
      viewDetailedReport: "View Detailed Reports →",
      itemsCountSuffix: ""
    },
    medicines: {
      title: "Medicine Registry (Medicines)",
      description: "Manage all your registered active and archived medicines.",
      addNew: "Add New Medicine",
      noMedicines: "No medicines found",
      noMedicinesDesc: "You haven't added any medicines yet. Add your first medicine according to your doctor's prescription.",
      startDate: "Start Date",
      endDate: "End Date",
      optional: "(Optional)",
      required: "*",
      nameLabel: "Medicine Name & Dosage",
      namePlaceholder: "e.g., Napa Extra 500mg, Seclo 20mg",
      notesLabel: "Instructions & Notes",
      notesPlaceholder: "e.g., Take 30 minutes after meal on a full stomach.",
      prescriptionReminder: "Please enter information and timings strictly according to your healthcare provider's prescription.",
      confirmDelete: "Are you sure you want to permanently delete this medicine?",
      editTitle: "Edit Medicine",
      editDescription: "Update medicine details and manage associated reminder schedules.",
      addTitle: "Add New Medicine",
      addDescription: "Fill in medicine details and instructions prescribed by your doctor.",
      saveMedicine: "Save Medicine",
      updateMedicine: "Update Medicine",
      backToList: "Back to Medicines",
      schedulesForMedicine: "Scheduled Reminder Times",
      noSchedulesForMedicine: "No schedules configured for this medicine yet.",
      addNewSchedule: "Add New Schedule"
    },
    schedule: {
      title: "Medicine Routines & Schedules",
      description: "Manage daily and weekly reminder times and dosage alerts.",
      allSchedules: "All Configured Schedules",
      noSchedules: "No schedules created yet",
      noSchedulesDesc: "Use the form on the right to set up reminders for your medicines.",
      addNewSchedule: "Add New Schedule",
      addScheduleButton: "Add Schedule",
      addingScheduleButton: "Adding...",
      mustAddMedicineFirst: "You must add at least one medicine before creating a schedule.",
      selectMedicine: "Select Medicine",
      reminderTime: "Reminder Time",
      repeatDays: "Repeat Days",
      everyday: "Everyday",
      successMessage: "New schedule has been added successfully!",
      timePrefix: "Time:"
    },
    calendar: {
      title: "Medicine Calendar",
      description: "Review past medication logs and upcoming schedules in a monthly calendar.",
      prevMonth: "Previous Month",
      nextMonth: "Next Month",
      selectDatePrompt: "Click any date on the calendar to view its detailed intake records.",
      noRecordsForDate: "No medicine records found for this date.",
      detailsForDate: "Schedule for",
      recordedAtPrefix: "Recorded at:"
    },
    history: {
      title: "Medicine History",
      description: "Inspect previous medication logs, exact timestamps, and adherence records.",
      exportCSV: "Download PDF",
      downloadPDF: "Download PDF",
      generatingPDF: "Generating PDF...",
      noRecordsForPDF: "No medication records available to download.",
      filterMedicine: "Filter by Medicine",
      allMedicines: "All Medicines",
      filterStatus: "Filter by Status",
      allStatuses: "All Statuses",
      filterDate: "Filter by Date",
      noHistory: "No history records found",
      noHistoryDesc: "No medication records match your selected filter criteria.",
      tableMedicine: "Medicine Name",
      tableSchedule: "Scheduled Routine",
      tableStatus: "Status",
      tableRecordedAt: "Recorded Time",
      tableNotes: "Notes / Comments"
    },
    reports: {
      title: "Reports & Adherence Analytics",
      description: "Monitor weekly trends, taken vs. skipped ratios, and overall statistics.",
      adherenceRate: "Adherence Rate",
      adherenceRateSub: "Ratio of taken vs. skipped doses",
      totalTaken: "Total Taken",
      totalTakenSub: "Successfully completed doses",
      totalSkipped: "Total Skipped",
      totalSkippedSub: "Missed or skipped doses",
      totalPending: "Total Pending",
      totalPendingSub: "Awaiting user response",
      weeklySummaryTitle: "Past 7 Days Tracking Summary",
      weeklySummaryDesc: "Daily count of taken and skipped medications",
      ratioTitle: "Overall Distribution",
      ratioDesc: "Proportion of all recorded statuses",
      noData: "No data available",
      timesSuffix: "times"
    },
    settings: {
      title: "Settings & Profile",
      description: "Manage your personal profile, notification preferences, and data exports.",
      profileTitle: "Personal Profile",
      profileDesc: "Your primary account details",
      notificationsTitle: "Browser & In-App Notifications",
      notificationsDesc: "Configure desktop sound and visual reminder alerts",
      browserPermission: "Browser Notification Permission",
      currentStatus: "Current status:",
      grantPermission: "Enable Permission",
      notificationSuccess: "Browser notifications have been enabled successfully!",
      backupTitle: "Medical Report & History Export",
      backupDesc: "Download your entire medication history in a structured PDF report",
      backupExpl: "You can download your entire medication intake history at any time from the Medicine History page as a professional PDF report.",
      exportHistoryButton: "Go to History & Download PDF",
      unspecified: "Not specified"
    },
    profile: {
      title: "User Profile",
      description: "Manage your personal account information, full name, and security preferences.",
      personalInfo: "Personal Details",
      personalInfoDesc: "Primary credentials and account metadata",
      editProfile: "Edit Profile",
      saveChanges: "Save Changes",
      saving: "Saving...",
      cancel: "Cancel",
      fullName: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      emailAddress: "Email Address",
      phoneNumber: "Phone Number",
      phoneNumberPlaceholder: "Enter your contact phone number (e.g. 017XXXXXXXX)",
      notProvided: "Not provided",
      accountRole: "Account Role",
      userRole: "Standard User",
      adminRole: "System Administrator (Admin)",
      createdAt: "Account Created On",
      avatarTitle: "Profile Picture",
      avatarDesc: "Your account avatar and visual badge",
      uploadPhoto: "Upload Photo",
      changePhoto: "Change Photo",
      removePhoto: "Remove Photo",
      photoUploadSuccess: "Profile photo uploaded successfully!",
      photoUploadError: "Failed to upload photo. Please try again (Max size 2MB).",
      photoRemoveSuccess: "Profile photo removed successfully!",
      guestProfileWarning: "You are browsing as a guest. Please login or register to customize and persist your personal profile.",
      backToDashboard: "Back to Dashboard",
      logout: "Log Out",
      updateSuccess: "Your profile information has been successfully updated!",
      updateError: "Failed to update profile. Please try again.",
      unspecified: "Not specified"
    },
    notifications: {
      title: "Reminders & Notifications",
      newBadge: "New",
      noNotifications: "No notifications at this time.",
      markAsRead: "Mark as read",
      enableBrowser: "Enable Notifications"
    },
    admin: {
      title: "Admin Dashboard (System Administration)",
      description: "System-level aggregate statistics and user management overview.",
      badge: "Secure Admin Mode",
      restricted: "Access Restricted",
      restrictedDesc: "This section is restricted to system administrators only.",
      totalUsers: "Registered Users",
      totalUsersSub: "Active system profiles",
      totalMedicines: "Registered Medicines",
      totalMedicinesSub: "Aggregate across all users",
      totalSchedules: "Configured Schedules",
      totalSchedulesSub: "Daily and weekly routines",
      totalResponses: "Recorded Responses",
      totalResponsesSub: "Logged Taken / Skipped doses",
      privacyNotice: "To ensure patient privacy, the administrator dashboard does not display personal prescriptions, medicine names, or private medical notes. Only aggregate system metrics are displayed.",
      recentUsersTitle: "Recently Registered Accounts",
      userId: "User ID",
      name: "Name",
      email: "Email",
      regDate: "Registration Date"
    }
  }
};
