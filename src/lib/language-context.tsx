'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'fr' | 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation data
const translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.about': 'À Propos',
    'nav.contact': 'Contact',
    'nav.login': 'Connexion',
    
    // Hero section
    'hero.title': 'Ligue Régionale de Casablanca-Settat de Ju-Jitsu',
    'hero.subtitle': 'Excellence, Discipline et Tradition Martiale',
    'hero.description': 'Rejoignez la communauté officielle de Ju-Jitsu de la région Casablanca-Settat sous l\'égide de la Fédération Royale Marocaine de Ju-Jitsu.',
    'hero.cta.championships': 'Voir les Championnats',
    'hero.cta.about': 'À Propos',
    
    // Stats
    'stats.championships': 'Championnats Gagnés',
    'stats.athletes': 'Athlètes Actifs',
    'stats.clubs': 'Clubs Affiliés',
    'stats.years': 'Années d\'Excellence',
    
    // Achievements
    'achievements.title': 'Nos Réalisations',
    'achievements.subtitle': 'Représentant le Maroc avec fierté sur la scène internationale',
    'achievements.national.title': 'Champions Nationaux',
    'achievements.national.description': 'Multiples titres de champion national dans diverses catégories de poids et groupes d\'âge.',
    'achievements.international.title': 'Reconnaissance Internationale',
    'achievements.international.description': 'Représentant le Maroc dans les compétitions africaines et internationales de Ju-Jitsu.',
    'achievements.youth.title': 'Développement Jeunesse',
    'achievements.youth.description': 'Former la prochaine génération d\'athlètes marocains de Ju-Jitsu grâce à des programmes d\'entraînement dédiés.',
    
    // Dashboard
    'dashboard.title': 'Tableau de Bord Administrateur',
    'dashboard.loading': 'Chargement du tableau de bord...',
    'dashboard.overview': 'Vue d\'ensemble',
    'dashboard.management': 'Gestion',
    'dashboard.insurance': 'Assurance',
    'dashboard.competitions': 'Compétitions',
    
    // Clubs Management
    'clubs.title': 'Gestion des Clubs',
    'clubs.description': 'Gérer tous les clubs affiliés à la ligue',
    'clubs.add': 'Ajouter un Club',
    'clubs.edit': 'Modifier le Club',
    'clubs.delete': 'Supprimer le Club',
    'clubs.name': 'Nom du Club',
    'clubs.address': 'Adresse',
    'clubs.phone': 'Téléphone',
    'clubs.email': 'Email',
    'clubs.president': 'Président',
    'clubs.coach': 'Entraîneur',
    'clubs.athletes': 'Athlètes',
    'clubs.created': 'Date de Création',
    'clubs.updated': 'Dernière Modification',
    'clubs.total': 'Total des Clubs',
    
    // Athletes Management
    'athletes.title': 'Gestion des Athlètes',
    'athletes.description': 'Gérer tous les athlètes de la ligue',
    'athletes.add': 'Ajouter un Athlète',
    'athletes.edit': 'Modifier l\'Athlète',
    'athletes.delete': 'Supprimer l\'Athlète',
    'athletes.firstName': 'Prénom',
    'athletes.lastName': 'Nom',
    'athletes.birthDate': 'Date de Naissance',
    'athletes.gender': 'Sexe',
    'athletes.belt': 'Ceinture',
    'athletes.weight': 'Poids',
    'athletes.club': 'Club',
    'athletes.phone': 'Téléphone',
    'athletes.email': 'Email',
    'athletes.total': 'Total des Athlètes',
    
    // Seasons Management
    'seasons.title': 'Gestion des Saisons',
    'seasons.description': 'Gérer les saisons sportives',
    'seasons.add': 'Ajouter une Saison',
    'seasons.edit': 'Modifier la Saison',
    'seasons.delete': 'Supprimer la Saison',
    'seasons.name': 'Nom de la Saison',
    'seasons.startDate': 'Date de Début',
    'seasons.endDate': 'Date de Fin',
    'seasons.status': 'Statut',
    'seasons.active': 'Active',
    'seasons.inactive': 'Inactive',
    'seasons.total': 'Total des Saisons',
    
    // Sidebar navigation
    'sidebar.dashboard': 'Tableau de Bord',
    'sidebar.clubs': 'Gestion des Clubs',
    'sidebar.clubs.all': 'Tous les Clubs',
    'sidebar.clubs.new': 'Ajouter un Club',
    'sidebar.athletes': 'Gestion des Athlètes',
    'sidebar.athletes.all': 'Tous les Athlètes',
    'sidebar.athletes.new': 'Ajouter un Athlète',
    'sidebar.insurance': 'Assurance',
    'sidebar.insurance.manage': 'Gestion Assurance',
    'sidebar.insurance.stats': 'Statistiques',
    'sidebar.seasons': 'Saisons',
    'sidebar.seasons.all': 'Toutes les Saisons',
    'sidebar.seasons.new': 'Nouvelle Saison',
    'sidebar.championships': 'Championnats',
    'sidebar.championships.all': 'Tous les Championnats',
    'sidebar.championships.new': 'Nouveau Championnat',
    'sidebar.teams': 'Équipes de Ligue',
    'sidebar.teams.all': 'Toutes les Équipes',
    'sidebar.teams.new': 'Nouvelle Équipe',
    'sidebar.logout': 'Déconnexion',
    
    // Contact page
    'contact.title': 'Contactez-Nous',
    'contact.subtitle': 'Nous sommes là pour répondre à vos questions et vous accompagner dans votre parcours en Ju-Jitsu',
    'contact.info.title': 'Informations de Contact',
    'contact.info.description': 'N\'hésitez pas à nous contacter pour toute question concernant nos activités, nos clubs affiliés ou pour rejoindre notre communauté.',
    'contact.address': 'Adresse',
    'contact.phone': 'Téléphone',
    'contact.email': 'Email',
    'contact.hours': 'Horaires',
    'contact.hours.weekdays': 'Lundi - Vendredi: 9h00 - 18h00',
    'contact.hours.saturday': 'Samedi: 9h00 - 14h00',
    'contact.hours.sunday': 'Dimanche: Fermé',
    'contact.form.title': 'Envoyez-nous un Message',
    'contact.form.description': 'Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais',
    'contact.form.name': 'Nom complet',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Sujet',
    'contact.form.message': 'Message',
    'contact.form.send': 'Envoyer le Message',
    'contact.form.sending': 'Envoi en cours...',
    'contact.form.success': '✓ Votre message a été envoyé avec succès! Nous vous répondrons bientôt.',
    
    // Footer
    'footer.rights': 'Tous droits réservés',
    'footer.federation': 'Sous l\'égide de',
    
    // Common
    'common.loading': 'Chargement...',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.create': 'Créer',
    'common.actions': 'Actions'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    
    // Hero section
    'hero.title': 'Casablanca-Settat Regional Ju-Jitsu League',
    'hero.subtitle': 'Excellence, Discipline and Martial Tradition',
    'hero.description': 'Join the official Ju-Jitsu community of the Casablanca-Settat region under the auspices of the Royal Moroccan Federation of Judo and Related Arts.',
    'hero.cta.championships': 'View Championships',
    'hero.cta.about': 'About Us',
    
    // Stats
    'stats.championships': 'Championships Won',
    'stats.athletes': 'Active Athletes',
    'stats.clubs': 'Affiliated Clubs',
    'stats.years': 'Years of Excellence',
    
    // Achievements
    'achievements.title': 'Our Achievements',
    'achievements.subtitle': 'Representing Morocco with pride on the international stage',
    'achievements.national.title': 'National Champions',
    'achievements.national.description': 'Multiple national championship titles across various weight categories and age groups.',
    'achievements.international.title': 'International Recognition',
    'achievements.international.description': 'Representing Morocco in African and international Ju-Jitsu competitions.',
    'achievements.youth.title': 'Youth Development',
    'achievements.youth.description': 'Building the next generation of Moroccan Ju-Jitsu athletes through dedicated training programs.',
    
    // Dashboard
    'dashboard.title': 'Administrator Dashboard',
    'dashboard.loading': 'Loading dashboard...',
    'dashboard.overview': 'Overview',
    'dashboard.management': 'Management',
    'dashboard.insurance': 'Insurance',
    'dashboard.competitions': 'Competitions',
    
    // Clubs Management
    'clubs.title': 'Clubs Management',
    'clubs.description': 'Manage all clubs affiliated with the league',
    'clubs.add': 'Add Club',
    'clubs.edit': 'Edit Club',
    'clubs.delete': 'Delete Club',
    'clubs.name': 'Club Name',
    'clubs.address': 'Address',
    'clubs.phone': 'Phone',
    'clubs.email': 'Email',
    'clubs.president': 'President',
    'clubs.coach': 'Coach',
    'clubs.athletes': 'Athletes',
    'clubs.created': 'Created Date',
    'clubs.updated': 'Last Modified',
    'clubs.total': 'Total Clubs',
    
    // Athletes Management
    'athletes.title': 'Athletes Management',
    'athletes.description': 'Manage all league athletes',
    'athletes.add': 'Add Athlete',
    'athletes.edit': 'Edit Athlete',
    'athletes.delete': 'Delete Athlete',
    'athletes.firstName': 'First Name',
    'athletes.lastName': 'Last Name',
    'athletes.birthDate': 'Birth Date',
    'athletes.gender': 'Gender',
    'athletes.belt': 'Belt',
    'athletes.weight': 'Weight',
    'athletes.club': 'Club',
    'athletes.phone': 'Phone',
    'athletes.email': 'Email',
    'athletes.total': 'Total Athletes',
    
    // Seasons Management
    'seasons.title': 'Seasons Management',
    'seasons.description': 'Manage sports seasons',
    'seasons.add': 'Add Season',
    'seasons.edit': 'Edit Season',
    'seasons.delete': 'Delete Season',
    'seasons.name': 'Season Name',
    'seasons.startDate': 'Start Date',
    'seasons.endDate': 'End Date',
    'seasons.status': 'Status',
    'seasons.active': 'Active',
    'seasons.inactive': 'Inactive',
    'seasons.total': 'Total Seasons',
    
    // Sidebar navigation
    'sidebar.dashboard': 'Dashboard',
    'sidebar.clubs': 'Clubs Management',
    'sidebar.clubs.all': 'All Clubs',
    'sidebar.clubs.new': 'Add Club',
    'sidebar.athletes': 'Athletes Management',
    'sidebar.athletes.all': 'All Athletes',
    'sidebar.athletes.new': 'Add Athlete',
    'sidebar.insurance': 'Insurance',
    'sidebar.insurance.manage': 'Manage Insurance',
    'sidebar.insurance.stats': 'Statistics',
    'sidebar.seasons': 'Seasons',
    'sidebar.seasons.all': 'All Seasons',
    'sidebar.seasons.new': 'New Season',
    'sidebar.championships': 'Championships',
    'sidebar.championships.all': 'All Championships',
    'sidebar.championships.new': 'New Championship',
    'sidebar.teams': 'League Teams',
    'sidebar.teams.all': 'All Teams',
    'sidebar.teams.new': 'New Team',
    'sidebar.logout': 'Logout',
    
    // Contact page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'We are here to answer your questions and support you in your Ju-Jitsu journey',
    'contact.info.title': 'Contact Information',
    'contact.info.description': 'Feel free to contact us for any questions about our activities, our affiliated clubs or to join our community.',
    'contact.address': 'Address',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.hours': 'Hours',
    'contact.hours.weekdays': 'Monday - Friday: 9:00 AM - 6:00 PM',
    'contact.hours.saturday': 'Saturday: 9:00 AM - 2:00 PM',
    'contact.hours.sunday': 'Sunday: Closed',
    'contact.form.title': 'Send us a Message',
    'contact.form.description': 'Fill out the form below and we will get back to you as soon as possible',
    'contact.form.name': 'Full name',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.form.success': '✓ Your message has been sent successfully! We will reply soon.',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.federation': 'Under the auspices of',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.create': 'Create',
    'common.actions': 'Actions'
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'nav.login': 'تسجيل الدخول',
    
    // Hero section
    'hero.title': 'الدوري الجهوي للدار البيضاء-سطات للجيو جيتسو',
    'hero.subtitle': 'التميز والانضباط والتقاليد القتالية',
    'hero.description': 'انضم إلى مجتمع الجيو جيتسو الرسمي بجهة الدار البيضاء-سطات تحت إشراف الجامعة الملكية المغربية للجودو والفنون المشابهة.',
    'hero.cta.championships': 'عرض البطولات',
    'hero.cta.about': 'من نحن',
    
    // Stats
    'stats.championships': 'البطولات المحققة',
    'stats.athletes': 'الرياضيون النشطون',
    'stats.clubs': 'النوادي المنتسبة',
    'stats.years': 'سنوات التميز',
    
    // Achievements
    'achievements.title': 'إنجازاتنا',
    'achievements.subtitle': 'نمثل المغرب بفخر على الساحة الدولية',
    'achievements.national.title': 'الأبطال الوطنيون',
    'achievements.national.description': 'عدة ألقاب بطولة وطنية في مختلف فئات الوزن والعمر.',
    'achievements.international.title': 'الاعتراف الدولي',
    'achievements.international.description': 'تمثيل المغرب في مسابقات الجيو جيتسو الأفريقية والدولية.',
    'achievements.youth.title': 'تطوير الشباب',
    'achievements.youth.description': 'بناء الجيل القادم من رياضيي الجيو جيتسو المغاربة من خلال برامج التدريب المخصصة.',
    
    // Dashboard
    'dashboard.title': 'لوحة تحكم المدير',
    'dashboard.loading': 'جاري تحميل لوحة التحكم...',
    'dashboard.overview': 'نظرة عامة',
    'dashboard.management': 'الإدارة',
    'dashboard.insurance': 'التأمين',
    'dashboard.competitions': 'المسابقات',
    
    // Clubs Management
    'clubs.title': 'إدارة النوادي',
    'clubs.description': 'إدارة جميع النوادي المنتسبة للدوري',
    'clubs.add': 'إضافة نادي',
    'clubs.edit': 'تعديل النادي',
    'clubs.delete': 'حذف النادي',
    'clubs.name': 'اسم النادي',
    'clubs.address': 'العنوان',
    'clubs.phone': 'الهاتف',
    'clubs.email': 'البريد الإلكتروني',
    'clubs.president': 'الرئيس',
    'clubs.coach': 'المدرب',
    'clubs.athletes': 'الرياضيون',
    'clubs.created': 'تاريخ الإنشاء',
    'clubs.updated': 'آخر تعديل',
    'clubs.total': 'إجمالي النوادي',
    
    // Athletes Management
    'athletes.title': 'إدارة الرياضيين',
    'athletes.description': 'إدارة جميع رياضيي الدوري',
    'athletes.add': 'إضافة رياضي',
    'athletes.edit': 'تعديل الرياضي',
    'athletes.delete': 'حذف الرياضي',
    'athletes.firstName': 'الاسم الأول',
    'athletes.lastName': 'اسم العائلة',
    'athletes.birthDate': 'تاريخ الميلاد',
    'athletes.gender': 'الجنس',
    'athletes.belt': 'الحزام',
    'athletes.weight': 'الوزن',
    'athletes.club': 'النادي',
    'athletes.phone': 'الهاتف',
    'athletes.email': 'البريد الإلكتروني',
    'athletes.total': 'إجمالي الرياضيين',
    
    // Seasons Management
    'seasons.title': 'إدارة المواسم',
    'seasons.description': 'إدارة المواسم الرياضية',
    'seasons.add': 'إضافة موسم',
    'seasons.edit': 'تعديل الموسم',
    'seasons.delete': 'حذف الموسم',
    'seasons.name': 'اسم الموسم',
    'seasons.startDate': 'تاريخ البداية',
    'seasons.endDate': 'تاريخ النهاية',
    'seasons.status': 'الحالة',
    'seasons.active': 'نشط',
    'seasons.inactive': 'غير نشط',
    'seasons.total': 'إجمالي المواسم',
    
    // Sidebar navigation
    'sidebar.dashboard': 'لوحة التحكم',
    'sidebar.clubs': 'إدارة النوادي',
    'sidebar.clubs.all': 'جميع النوادي',
    'sidebar.clubs.new': 'إضافة نادي',
    'sidebar.athletes': 'إدارة الرياضيين',
    'sidebar.athletes.all': 'جميع الرياضيين',
    'sidebar.athletes.new': 'إضافة رياضي',
    'sidebar.insurance': 'التأمين',
    'sidebar.insurance.manage': 'إدارة التأمين',
    'sidebar.insurance.stats': 'الإحصائيات',
    'sidebar.seasons': 'المواسم',
    'sidebar.seasons.all': 'جميع المواسم',
    'sidebar.seasons.new': 'موسم جديد',
    'sidebar.championships': 'البطولات',
    'sidebar.championships.all': 'جميع البطولات',
    'sidebar.championships.new': 'بطولة جديدة',
    'sidebar.teams': 'فرق الدوري',
    'sidebar.teams.all': 'جميع الفرق',
    'sidebar.teams.new': 'فريق جديد',
    'sidebar.logout': 'تسجيل الخروج',
    
    // Contact page
    'contact.title': 'اتصل بنا',
    'contact.subtitle': 'نحن هنا للإجابة على أسئلتكم ومساعدتكم في رحلتكم في الجيو جيتسو',
    'contact.info.title': 'معلومات الاتصال',
    'contact.info.description': 'لا تترددوا في الاتصال بنا لأي سؤال حول أنشطتنا أو نوادينا المنتسبة أو للانضمام إلى مجتمعنا.',
    'contact.address': 'العنوان',
    'contact.phone': 'الهاتف',
    'contact.email': 'البريد الإلكتروني',
    'contact.hours': 'ساعات العمل',
    'contact.hours.weekdays': 'الاثنين - الجمعة: 9:00 - 18:00',
    'contact.hours.saturday': 'السبت: 9:00 - 14:00',
    'contact.hours.sunday': 'الأحد: مغلق',
    'contact.form.title': 'أرسل لنا رسالة',
    'contact.form.description': 'املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن',
    'contact.form.name': 'الاسم الكامل',
    'contact.form.email': 'البريد الإلكتروني',
    'contact.form.subject': 'الموضوع',
    'contact.form.message': 'الرسالة',
    'contact.form.send': 'إرسال الرسالة',
    'contact.form.sending': 'جاري الإرسال...',
    'contact.form.success': '✓ تم إرسال رسالتك بنجاح! سنرد عليك قريباً.',
    
    // Footer
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.federation': 'تحت إشراف',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.create': 'إنشاء',
    'common.actions': 'الإجراءات'
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr')

  // Load language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && ['fr', 'en', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language to localStorage
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
    
    // Apply RTL for Arabic
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl'
      document.documentElement.lang = 'ar'
    } else {
      document.documentElement.dir = 'ltr'
      document.documentElement.lang = lang
    }
  }

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: unknown = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        // Fallback to French if key not found
        value = translations.fr
        for (const k of keys) {
          if (value && typeof value === 'object' && value !== null && k in value) {
            value = (value as Record<string, unknown>)[k]
          } else {
            return key // Return key if translation not found
          }
        }
        break
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  // Apply direction on mount
  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.dir = 'rtl'
      document.documentElement.lang = 'ar'
    } else {
      document.documentElement.dir = 'ltr'
      document.documentElement.lang = language
    }
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
