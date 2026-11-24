# আমার ঔষধ (Amar Owshodh) — ব্যক্তিগত ঔষধ রিমাইন্ডার ও ট্র্যাকিং সিস্টেম

**Amar Owshodh (আমার ঔষধ)** হলো একটি আধুনিক, নির্ভরযোগ্য এবং নিরাপদ দ্বিভাষিক (Bilingual - Bengali & English) ওয়েব অ্যাপ্লিকেশন যা ব্যবহারকারীদের ঔষধের সঠিক সময়সূচী পরিচালনা, রিমাইন্ডার গ্রহণ, ইনটেক স্ট্যাটাস ট্র্যাকিং এবং ইতিহাস পর্যালোচনায় সহায়তা করে।

> [!IMPORTANT]
> **সতর্কতা ও দায়মুক্তি (Medical Disclaimer):** এই অ্যাপ্লিকেশনটি শুধুমাত্র রিমাইন্ডার ও ব্যক্তিগত রেকর্ড ব্যবস্থাপনা সহায়িকা। এটি কোনো রোগ নির্ণয়, প্রেসক্রিপশন প্রদান, ডোজ নির্ধারণ বা চিকিৎসাগত পরামর্শ দেয় না। ব্যবহারকারীদের সর্বদা উপযুক্ত স্বাস্থ্যসেবা পেশাদার বা চিকিৎসকের নির্দেশ অনুযায়ী সময়সূচী প্রবেশ করাতে হবে।

---

## 🚀 টেকনোলজি স্ট্যাক (Technology Stack)

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide React
- **Data Visualizations:** Recharts
- **Backend:** Next.js Server Actions, Zod Schema Validation, React Hook Form
- **Database & Auth:** Supabase PostgreSQL, Supabase Authentication, Row Level Security (RLS)
- **Notifications:** In-App Notification System & Browser Notification API
- **Deployment Support:** Vercel, Supabase Cloud, GitHub

---

## 🎨 ডিজাইন সিস্টেম ও কালার প্যালেট

- **Primary Blue:** `#2563EB`
- **Teal / Accent:** `#0D9488`
- **Background:** `#F8FAFC`
- **Card Background:** `#FFFFFF`
- **Text:** `#1E293B`
- **Secondary Text:** `#64748B`
- **Border:** `#E2E8F0`
- **Warning:** `#F97316`
- **Critical / Destructive:** `#DC2626`
- **Success:** `#16A34A`
- **ভাষা ও ফন্ট:** সম্পূর্ণ ইউজার ইন্টারফেস বাংলায়। ফন্ট: Hind Siliguri এবং Inter।

---

## 🛠️ প্রধান ফিচারসমূহ (Features)

1. **নিরাপদ অথেনটিকেশন ও প্রোফাইল:**
   - Supabase Auth দ্বারা পরিচালিত রেজিস্ট্রেশন ও লগইন।
   - পাসওয়ার্ড এনক্রিপশন ও সেশন কুকি সিকিউরিটি।
   - রোল ভিত্তিক অ্যাক্সেস কন্ট্রোল (User ও Admin)।
2. **ঔষধ ব্যবস্থাপনা (Medicine Management):**
   - ঔষধের নাম ও ডোজ তথ্য সংযোজন।
   - শুরুর তারিখ ও সমাপ্তির তারিখ নির্ধারণ।
   - প্রেসক্রিপশন অনুযায়ী নির্দেশনা ও নোট সংরক্ষণ।
   - ঔষধ সম্পাদনা, আর্কাইভ এবং মুছে ফেলার সুবিধা।
3. **শিডিউল ও রিমাইন্ডার (Scheduling & Notifications):**
   - একাধিক সময় নির্ধারণের সুবিধা (যেমন: সকাল ০৮:০০, রাত ১০:০০)।
   - সপ্তাহের নির্দিষ্ট দিনে পুনরাবৃত্তি (Repeat Days: রবি - শনি)।
   - ব্রাউজার নোটিফিকেশন অ্যালার্ট।
   - ইন-অ্যাপ নোটিফিকেশন ড্রপডাউন এবং হিস্ট্রি।
   - কোনো ডুপ্লিকেট নোটিফিকেশন প্রতিরোধ ব্যবস্থা।
4. **ইনটেক ট্র্যাকিং (Intake Tracking):**
   - প্রতিটি শিডিউলের জন্য "গৃহীত (Taken)" বা "বাদ দেওয়া (Skipped)" চিহ্নিত করার সুবিধা।
   - ব্যবহারকারীর অ্যাকশন নেওয়ার পূর্ব পর্যন্ত "অপেক্ষমান (Pending)" স্ট্যাটাস রাখা (কখনোই স্বয়ংক্রিয়ভাবে Taken মার্ক হয় না)।
   - রেসপন্সের নির্ভুল টাইমস্ট্যাম্প ডাটাবেজে সংরক্ষণ।
5. **ড্যাশবোর্ড (Live Dashboard):**
   - মোট সক্রিয় ঔষধের সংখ্যা।
   - আজকের মোট রিমাইন্ডার, গৃহীত এবং অপেক্ষমান ডোজের সংখ্যা।
   - দৈনিক ও সাপ্তাহিক ট্র্যাকিং পার্সেন্টেজ প্রগ্রেস বার।
6. **ক্যালেন্ডার ভিউ (Monthly Calendar):**
   - পুরো মাসের শিডিউল ও অতীতের রেকর্ড এক নজরে দেখার ব্যবস্থা।
   - যেকোনো তারিখে ক্লিক করে ওই দিনের বিশদ স্ট্যাটাস পর্যালোচনা।
7. **ঔষধের ইতিহাস (History & Search Filters):**
   - ঔষধের নাম, স্ট্যাটাস এবং নির্দিষ্ট তারিখ অনুযায়ী ফিল্টারিং।
   - এক ক্লিকে **CSV এক্সপোর্ট** করার সুবিধা।
8. **রিপোর্ট ও পরিসংখ্যান (Reports):**
   - Recharts সমৃদ্ধ বার চার্ট ও পাই চার্ট।
   - বিগত ৭ দিনের ট্র্যাকিং ট্রেন্ড এবং সামগ্রিক অনুপাত।
9. **অ্যাডমিন প্যানেল (/admin):**
   - সিস্টেমের মোট ইউজার এবং সামগ্রিক কার্যকলাপের সমষ্টিগত রিপোর্ট।
   - ব্যবহারকারীদের ব্যক্তিগত গোপনীয়তা রক্ষা (অ্যাডমিন ব্যক্তিগত ঔষধ দেখতে পারে না)।

---

## 🗄️ ডাটাবেজ আর্কিটেকচার ও RLS

মাইগ্রেশন ফাইলটি `supabase/migrations/20261123_init_schema.sql` লোকেশনে সংরক্ষিত রয়েছে।
এতে অন্তর্ভুক্ত টেবিলসমূহ:
1. `profiles`
2. `medicines`
3. `medicine_schedules`
4. `intake_logs` (ইউনিক কনস্ট্রেইন্ট সহ: `uq_schedule_occurrence`)
5. `notifications`

প্রতিটি টেবিলে সক্রিয় **Row Level Security (RLS)** যাতে এক ব্যবহারকারী অন্য ব্যবহারকারীর ডেটাতে প্রবেশ করতে না পারে।

---

## 💻 লোকাল ডেভেলপমেন্ট সেটআপ (Local Setup)

১. ডিপেন্ডেন্সি ইন্সটল করুন:
```bash
npm install
```

২. `.env.local` ফাইলে আপনার Supabase ক্রেডেনশিয়াল দিন:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

৩. Supabase SQL Editor এ `supabase/migrations/20261123_init_schema.sql` স্ক্রিপ্টটি রান করুন।

৪. ডেভেলপমেন্ট সার্ভার চালু করুন:
```bash
npm run dev
```

৫. প্রোডাকশন বিল্ড যাচাই করুন:
```bash
npm run build -- --webpack
```

---

## 🌐 ভার্সেল ডেপ্লয়মেন্ট (Vercel Deployment)

১. গিটহাবে রিপোজিটরি পুশ করুন:
```bash
git add .
git commit -m "Complete Amar Owshodh full stack application"
git push origin main
```
২. Vercel ড্যাশবোর্ডে গিয়ে প্রজেক্টটি ইমপোর্ট করুন।
৩. Environment Variables এ `NEXT_PUBLIC_SUPABASE_URL` এবং `NEXT_PUBLIC_SUPABASE_ANON_KEY` যুক্ত করুন।
৪. Deploy চাপুন!
