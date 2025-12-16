
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Package, Driver, Booking, CompanyProfile, SeoSettings, AiSettings, PageSettings, EmailSettings } from './types';
import { POPULAR_PACKAGES, MOCK_DRIVERS, MOCK_RIDES } from './constants';
import { supabase } from './lib/supabaseClient';

interface GlobalContextType {
  packages: Package[];
  drivers: Driver[];
  bookings: Booking[];
  companyProfile: CompanyProfile;
  seoSettings: SeoSettings;
  aiSettings: AiSettings;
  emailSettings: EmailSettings;
  pageSettings: PageSettings;
  lastBackupDate: string | null;
  addPackage: (pkg: Package) => void;
  updatePackage: (pkg: Package) => void;
  deletePackage: (id: string) => void;
  addDriver: (driver: Driver) => void;
  updateDriverStatus: (id: string, status: Driver['status']) => void;
  deleteDriver: (id: string) => void;
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  updateCompanyProfile: (profile: CompanyProfile) => void;
  updateSeoSettings: (seo: SeoSettings) => void;
  updateAiSettings: (settings: AiSettings) => void;
  updateEmailSettings: (settings: EmailSettings) => void;
  updatePageSettings: (settings: PageSettings) => void;
  importData: (data: any) => void;
  loading: boolean;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<Package[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: 'HolidayPot',
    address: 'MG Road, Bengaluru, Karnataka, India',
    phone: '+91 98765 43210',
    email: 'hello@holidaypot.in',
    website: 'https://holidaypot.com',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    gstNumber: '29ABCDE1234F1Z5',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com'
  });

  const [seoSettings, setSeoSettings] = useState<SeoSettings>({
    title: 'HolidayPot - Explore the World',
    description: 'A modern, vibrant, mobile-responsive international travel agency.',
    keywords: 'travel, india, tours, taxi, booking, holiday',
    ogImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    sitemapEnabled: true,
    robotsTxtEnabled: true,
    robotsTxtContent: 'User-agent: *\nAllow: /',
    schemaMarkupEnabled: true,
    analyticsId: 'UA-XXXXX-Y'
  });

  const [aiSettings, setAiSettings] = useState<AiSettings>({
    provider: 'gemini',
    primaryApiKey: '', 
    fallbackApiKeys: [],
    model: 'gemini-2.5-flash',
    maxRetries: 3
  });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    enableNotifications: true,
    recipients: [
        { address: 'admin@holidaypot.in', notifyOn: ['Package', 'Taxi', 'AI Plan'] },
        { address: '', notifyOn: ['Package'] },
        { address: '', notifyOn: ['Taxi'] },
        { address: '', notifyOn: ['AI Plan'] }
    ]
  });

  const [pageSettings, setPageSettings] = useState<PageSettings>(() => {
    try {
      if (typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem('holidaypot_page_settings');
          if (stored) return JSON.parse(stored);
      }
    } catch (e) { console.error("Failed to load page settings", e); }
    return {
        error404: {
        title: 'Page Not Found',
        message: 'The adventure you are looking for seems to have gone off-map.',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        },
        maintenanceMode: false
    };
  });

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Packages
        const { data: pkgData, error: pkgError } = await supabase
          .from('packages')
          .select('*')
          .order('created_at', { ascending: false });

        if (!pkgError && pkgData && pkgData.length > 0) {
          setPackages(pkgData);
        } else {
           setPackages(POPULAR_PACKAGES);
        }

        // Fetch Drivers
        const { data: driverData, error: driverError } = await supabase.from('drivers').select('*');
        if (!driverError && driverData && driverData.length > 0) {
          setDrivers(driverData);
        } else {
          setDrivers(MOCK_DRIVERS);
        }

        // Fetch Bookings
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (!bookingError && bookingData && bookingData.length > 0) {
          setBookings(bookingData);
        } else {
          // Default bookings...
          const defaultBookings: Booking[] = [
             {
               id: 'BK-1001',
               userId: 'u1',
               itemId: 'p1',
               itemName: 'Majestic Rajasthan Royal Tour',
               customerName: 'Ravi Kumar',
               customerEmail: 'ravi@example.com',
               customerPhone: '9876543210',
               type: 'Package',
               date: new Date().toISOString(),
               travelDate: '2024-11-15',
               status: 'Confirmed',
               totalAmount: 650,
               paid: true,
               travelers: 2
            },
            {
               id: 'BK-1002',
               userId: 'u2',
               itemId: 'd1',
               itemName: 'Taxi Ride: Mumbai Airport',
               customerName: 'Sarah Jenkins',
               customerEmail: 'sarah@example.com',
               customerPhone: '5551234567',
               type: 'Taxi',
               date: new Date().toISOString(),
               travelDate: '2024-10-25',
               status: 'Pending',
               totalAmount: 45,
               paid: false,
               travelers: 1
            }
          ];
          setBookings(defaultBookings);
        }

        // Fetch Profile
        const { data: profileData, error: profileError } = await supabase.from('company_profile').select('*').single();
        if (!profileError && profileData) {
          setCompanyProfile(profileData);
        }

        // Fetch SEO
        const { data: seoData, error: seoError } = await supabase.from('seo_settings').select('*').single();
        if (!seoError && seoData) {
          setSeoSettings(prev => ({...prev, ...seoData}));
        }

        // Load Settings from LocalStorage (Sync)
        const storedAi = localStorage.getItem('holidaypot_ai_settings');
        if (storedAi) setAiSettings(JSON.parse(storedAi));

        const storedEmail = localStorage.getItem('holidaypot_email_settings');
        if (storedEmail) setEmailSettings(JSON.parse(storedEmail));

        
        const storedBackup = localStorage.getItem('holidaypot_last_backup');
        if (storedBackup) setLastBackupDate(storedBackup);

      } catch (err) {
        console.error("Supabase connection error, falling back to mocks", err);
        setPackages(POPULAR_PACKAGES);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Actions ---

  const addPackage = async (pkg: Package) => {
    setPackages(prev => [pkg, ...prev]);
    await supabase.from('packages').insert(pkg);
  };

  const updatePackage = async (updatedPkg: Package) => {
    setPackages(prev => prev.map(p => p.id === updatedPkg.id ? updatedPkg : p));
    await supabase.from('packages').update(updatedPkg).eq('id', updatedPkg.id);
  };

  const deletePackage = async (id: string) => {
    const hasBookings = bookings.some(b => b.itemId === id);
    if (hasBookings) {
        alert("Cannot delete this package because there are bookings associated with it.");
        return;
    }
    setPackages(prev => prev.filter(p => p.id !== id));
    try {
        await supabase.from('packages').delete().eq('id', id);
    } catch (e) { console.error(e); }
  };

  const addDriver = async (driver: Driver) => {
    setDrivers(prev => [driver, ...prev]);
    await supabase.from('drivers').insert(driver);
  };

  const updateDriverStatus = async (id: string, status: Driver['status']) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    await supabase.from('drivers').update({ status }).eq('id', id);
  };

  const deleteDriver = async (id: string) => {
    setDrivers(prev => prev.filter(d => d.id !== id));
    await supabase.from('drivers').delete().eq('id', id);
  };

  const addBooking = async (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
    await supabase.from('bookings').insert(booking);
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    await supabase.from('bookings').update({ status }).eq('id', id);
  };

  const updateCompanyProfile = async (profile: CompanyProfile) => {
    setCompanyProfile(profile);
    const { data } = await supabase.from('company_profile').select('id').single();
    if (data) {
       await supabase.from('company_profile').update(profile).eq('id', data.id);
    } else {
       await supabase.from('company_profile').insert(profile);
    }
  };

  const updateSeoSettings = async (seo: SeoSettings) => {
    setSeoSettings(seo);
    const { data } = await supabase.from('seo_settings').select('id').single();
    if (data) {
       await supabase.from('seo_settings').update(seo).eq('id', data.id);
    } else {
       await supabase.from('seo_settings').insert(seo);
    }
  };

  const updateAiSettings = (settings: AiSettings) => {
    setAiSettings(settings);
    localStorage.setItem('holidaypot_ai_settings', JSON.stringify(settings));
  };

  const updateEmailSettings = (settings: EmailSettings) => {
    setEmailSettings(settings);
    localStorage.setItem('holidaypot_email_settings', JSON.stringify(settings));
  };

  const updatePageSettings = (settings: PageSettings) => {
    setPageSettings(settings);
    localStorage.setItem('holidaypot_page_settings', JSON.stringify(settings));
  };

  const importData = (data: any) => {
    if(data.packages) setPackages(data.packages);
    if(data.drivers) setDrivers(data.drivers);
    if(data.bookings) setBookings(data.bookings);
    if(data.companyProfile) setCompanyProfile(data.companyProfile);
    if(data.aiSettings) updateAiSettings(data.aiSettings);
    if(data.emailSettings) updateEmailSettings(data.emailSettings);
    if(data.seoSettings) setSeoSettings(data.seoSettings);
    
    // Set restore time as new backup time
    const now = new Date().toISOString();
    setLastBackupDate(now);
    localStorage.setItem('holidaypot_last_backup', now);

    alert("Data imported to local state. Note: This does not automatically sync deeply to the database in this demo to prevent corruption.");
  };

  return (
    <GlobalContext.Provider value={{
      packages,
      drivers,
      bookings,
      companyProfile,
      seoSettings,
      aiSettings,
      emailSettings,
      pageSettings,
      lastBackupDate,
      addPackage,
      updatePackage,
      deletePackage,
      addDriver,
      updateDriverStatus,
      deleteDriver,
      addBooking,
      updateBookingStatus,
      updateCompanyProfile,
      updateSeoSettings,
      updateAiSettings,
      updateEmailSettings,
      updatePageSettings,
      importData,
      loading
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
