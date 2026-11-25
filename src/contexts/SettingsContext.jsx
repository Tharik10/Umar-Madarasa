import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DEFAULT_SETTINGS = {
  institution_name_en: 'Umar Makthab and Hifl Madarasa',
  institution_name_ta: 'உமர் மக்தப் மற்றும் ஹிஃப்ழ் மதரஸா',
  tagline_en: 'Nurturing Quranic Excellence & Prophetic Character',
  tagline_ta: 'குர்ஆனிய அறிவும் நற்குணமும் வளர்க்கும் இஸ்லாமிய கல்விக்கூடம்',
  logo_url: '/logo.png',
  about_summary_en:
    'Umar Makthab and Hifl Madarasa is dedicated to imparting authentic Quranic memorization (Hifz), Tajweed, foundational Makthab studies, and moral upbringing in a disciplined, nurturing environment.',
  about_summary_ta:
    'உமர் மக்தப் மற்றும் ஹிஃப்ழ் மதரஸா மாணவர்களுக்குத் தூய குர்ஆன் மனனம் (ஹிஃப்ழ்), தஜ்வீத், அடிப்படை மக்தப் கல்வி மற்றும் நற்பண்புகளை ஒழுக்கமான சூழலில் கற்பித்து வருகிறது.',
  history_en:
    'Founded with the sincere vision of preserving the Holy Quran in young hearts while equipping students with strong Islamic etiquette, Umar Makthab and Hifl Madarasa serves families across three branches.',
  history_ta:
    'இளம் உள்ளங்களில் திருக்குர்ஆனைப் பாதுகாப்பதோடு சிறந்த இஸ்லாமிய ஒழுக்கங்களையும் வளர்க்கும் உயரிய நோக்கத்துடன் தொடங்கப்பட்ட உமர் மக்தப் மற்றும் ஹிஃப்ழ் மதரஸா, மூன்று கிளைகளுடன் சிறப்பாகச் செயல்பட்டு வருகிறது.',
  vision_en:
    'To cultivate a generation of Huffaz and principled learners who embody the teachings of the Quran and Sunnah with wisdom, humility, and service to humanity.',
  vision_ta:
    'திருக்குர்ஆன் மற்றும் நபிவழி போதனைகளைப் பின்பற்றி, பணிவுடனும் ஞானத்துடனும் சமூகத்திற்குச் சேவையாற்றும் தலைமுறையை உருவாக்குதல்.',
  mission_en:
    'Deliver structured Hifz and Makthab curricula under qualified Ulama and Huffaz, ensuring individual attention, Tajweed mastery, and holistic character development.',
  mission_ta:
    'தகுதிவாய்ந்த உலமாக்கள் மற்றும் ஹாஃபிழ்களின் வழிகாட்டுதலில் தனிப்பட்ட கவனம், தஜ்வீத் தேர்ச்சி மற்றும் முழுமையான நற்பண்பு வளர்ச்சியுடன் தரமான கல்வியை வழங்குதல்.',
  objectives_en:
    '1. Accurate Quran recitation with Tajweed rules.
2. Complete Hifz-ul-Quran with regular revision.
3. Essential Fiqh, Aqeedah, Seerah, and daily Duas.
4. Respect for parents, elders, and community service.',
  objectives_ta:
    '1. தஜ்வீத் விதிகளுடன் திருக்குர்ஆனைத் துல்லியமாக ஓதுதல்.
2. முறையான திருப்புதலுடன் முழு குர்ஆன் மனனம்.
3. அத்தியாவசிய ஃபிக்ஹ், அகீதா, சீறா மற்றும் அன்றாட துஆக்கள்.
4. பெற்றோர், பெரியோர்களை மதித்தல் மற்றும் சமூக நல்லிணக்கம்.',
  management_info_en:
    'Managed by the Umar Educational & Charitable Trust Board of Trustees, Senior Principal, and Academic Council of Huffaz & Ulama.',
  management_info_ta:
    'உமர் கல்வி மற்றும் அறக்கட்டளை நிர்வாகக் குழு, தலைமை ஆசிரியர் மற்றும் உலமாக்கள் சபையால் நிர்வகிக்கப்படுகிறது.',
  address_en: 'Umar Makthab and Hifl Madarasa, Main Campus, Tamil Nadu, India',
  address_ta: 'உமர் மக்தப் மற்றும் ஹிஃப்ழ் மதரஸா, தலைமை வளாகம், தமிழ்நாடு, இந்தியா',
  phone_number: '+91 98400 00000',
  whatsapp_number: '+91 98400 00000',
  email: 'info@umarmadarasa.org',
  google_maps_url: 'https://maps.google.com',
  youtube_channel_url: 'https://www.youtube.com',
  max_slider_slides: 6,
};

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('website_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (!error && data) {
      setSettings((prev) => ({
        ...prev,
        ...data,
        logo_url: data.logo_url || '/logo.png',
      }));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
