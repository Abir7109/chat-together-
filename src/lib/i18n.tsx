"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type Locale = 'en' | 'bn';

type Dictionary = {
  common: {
    loading: string;
    error: string;
    save: string;
    cancel: string;
  };
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    username: string;
  };
  chat: {
    typeMessage: string;
    search: string;
    online: string;
    offline: string;
  };
};

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      save: 'Save',
      cancel: 'Cancel',
    },
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      username: 'Username',
    },
    chat: {
      typeMessage: 'Type a message...',
      search: 'Search...',
      online: 'Online',
      offline: 'Offline',
    },
  },
  bn: {
    common: {
      loading: 'লোড হচ্ছে...',
      error: 'একটি ত্রুটি ঘটেছে',
      save: 'সংরক্ষণ করুন',
      cancel: 'বাতিল করুন',
    },
    auth: {
      login: 'লগইন',
      register: 'নিবন্ধন করুন',
      email: 'ইমেল',
      password: 'পাসওয়ার্ড',
      username: 'ব্যবহারকারীর নাম',
    },
    chat: {
      typeMessage: 'একটি বার্তা লিখুন...',
      search: 'অনুসন্ধান করুন...',
      online: 'অনলাইন',
      offline: 'অফলাইন',
    },
  },
};

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = dictionaries[locale];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    // @ts-ignore
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
