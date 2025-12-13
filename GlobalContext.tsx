
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Package, Driver, Booking, CompanyProfile, SeoSettings } from './types';
import { POPULAR_PACKAGES, MOCK_DRIVERS, MOCK_RIDES } from './constants';
import { supabase } from './lib/supabaseClient';

interface GlobalContextType {
  packages: Package[];
  drivers: Driver[];
  bookings: Booking[];
  companyProfile: CompanyProfile;
  seoSettings: SeoSettings;
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
  loading: boolean;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<Package[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: 'HolidayPot',
    address: 'MG Road, Bengaluru, Karnataka, India',
    phone: '+91 98765 43210',
    email: 'hello@holidaypot.in',
    logo: '',
    heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    facebook: '#',
    twitter: '#',
    instagram: '#'
  });

  const [seoSettings, setSeoSettings] = useState<SeoSettings>({
    title: 'HolidayPot - Explore the World',
    description: 'A modern, vibrant, mobile-responsive international travel agency.',
    keywords: 'travel, india, tours, taxi, booking, holiday',
    ogImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    sitemapEnabled: true,
    robotsTxtEnabled: true,
    schemaMarkupEnabled: true,
    analyticsId: 'UA-XXXXX-Y'
  });

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Packages - ORDERED BY CREATED_AT DESC (Newest First)
        const { data: pkgData, error: pkgError } = await supabase
          .from('packages')
          .select('*')
          .order('created_at', { ascending: false });

        if (!pkgError && pkgData && pkgData.length > 0) {
          setPackages(pkgData);
        } else {
           // Fallback if DB is empty or connection fails
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
          // Use default mock bookings if DB is empty
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
          setSeoSettings(seoData);
        }

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
    // Optimistic Update: Add to beginning of array
    setPackages(prev => [pkg, ...prev]);
    await supabase.from('packages').insert(pkg);
  };

  const updatePackage = async (updatedPkg: Package) => {
    setPackages(prev => prev.map(p => p.id === updatedPkg.id ? updatedPkg : p));
    await supabase.from('packages').update(updatedPkg).eq('id', updatedPkg.id);
  };

  const deletePackage = async (id: string) => {
    // Optimistic Update
    setPackages(prev => prev.filter(p => p.id !== id));
    
    try {
        const { error } = await supabase.from('packages').delete().eq('id', id);
        if (error) {
            console.error("Error deleting package from DB:", error);
            // We could roll back state here if necessary, but optimistic is preferred for UI speed
        }
    } catch (e) {
        console.error("Exception in deletePackage:", e);
    }
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
    
    // Check if row exists, if not insert, else update
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

  return (
    <GlobalContext.Provider value={{
      packages,
      drivers,
      bookings,
      companyProfile,
      seoSettings,
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
