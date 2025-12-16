
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Package, Driver, Booking, CompanyProfile, SeoSettings, AiSettings, PageSettings, EmailSettings, Manager, ActivityLog, Permission, BlogPost, SitePage, Tenant } from './types';
import { POPULAR_PACKAGES, MOCK_DRIVERS, MOCK_RIDES, MOCK_MANAGERS, MOCK_POSTS } from './constants';
import { supabase } from './lib/supabaseClient';

interface GlobalContextType {
  packages: Package[];
  drivers: Driver[];
  bookings: Booking[];
  blogPosts: BlogPost[];
  companyProfile: CompanyProfile;
  seoSettings: SeoSettings;
  aiSettings: AiSettings;
  emailSettings: EmailSettings;
  pageSettings: PageSettings;
  sitePages: SitePage[]; 
  lastBackupDate: string | null;
  
  // Auth & Team
  currentUser: Manager | null;
  managers: Manager[];
  activityLogs: ActivityLog[];
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<Manager>) => void;
  
  // Team Actions
  addManager: (manager: Manager) => void;
  updateManager: (manager: Manager) => void;
  deleteManager: (id: string) => void;

  // Logs
  logAction: (action: string, targetType: ActivityLog['targetType'], targetId?: string, details?: string, previousData?: any) => void;
  revertAction: (logId: string) => void;

  addPackage: (pkg: Package) => void;
  updatePackage: (pkg: Package) => void;
  deletePackage: (id: string) => void;
  addDriver: (driver: Driver) => void;
  updateDriverStatus: (id: string, status: Driver['status']) => void;
  deleteDriver: (id: string) => void;
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  
  // Blog Actions
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: string) => void;

  updateCompanyProfile: (profile: CompanyProfile) => void;
  updateSeoSettings: (seo: SeoSettings) => void;
  updateAiSettings: (settings: AiSettings) => void;
  updateEmailSettings: (settings: EmailSettings) => void;
  updatePageSettings: (settings: PageSettings) => void;
  updateSitePage: (page: SitePage) => void;
  importData: (data: any) => void;
  loading: boolean;

  // SaaS Tenant Management
  currentTenant: Tenant | null;
  featureFlags: string[];
  initializeTenantSession: (tenant: Tenant, manager: Manager) => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  
  // App Data
  const [packages, setPackages] = useState<Package[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  
  // Auth & Admin Data
  const [currentUser, setCurrentUser] = useState<Manager | null>(null);
  const [managers, setManagers] = useState<Manager[]>(MOCK_MANAGERS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // SaaS Data
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [featureFlags, setFeatureFlags] = useState<string[]>([]);

  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);

  // Content Pages State
  const [sitePages, setSitePages] = useState<SitePage[]>([
    { id: 'home', title: 'Home Page', content: '<h1>Welcome to HolidayPot</h1>', lastUpdated: new Date().toISOString() },
    { id: 'about', title: 'About Us', content: '<p>Welcome to <strong>HolidayPot</strong>. We started with a simple belief: travel should be about connection.</p>', lastUpdated: new Date().toISOString() },
    { id: 'terms', title: 'Terms & Conditions', content: '<p>Welcome to HolidayPot. By using our website, you agree to these terms.</p>', lastUpdated: new Date().toISOString() },
    { id: 'privacy', title: 'Privacy Policy', content: '<p>At HolidayPot, we value your trust and are committed to protecting your personal information.</p>', lastUpdated: new Date().toISOString() }
  ]);

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
    analyticsId: 'UA-XXXXX-Y',
    geoRegion: 'IN',
    enableFaqSchema: true,
    entityType: 'TravelAgency',
    authoritativeTopic: 'India Travel & Tourism',
    knowledgeGraphDesc: 'HolidayPot is a premier travel agency based in India, specializing in curated tour packages, luxury taxi services, and AI-powered travel planning.'
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
               itemId: 'd2',
               itemName: 'Toyota Innova Crysta (Mumbai)',
               customerName: 'Amit Patel',
               customerEmail: 'amit@example.com',
               customerPhone: '9822012345',
               type: 'Taxi',
               date: new Date(Date.now() - 86400000).toISOString(),
               travelDate: '2024-12-01',
               status: 'Pending',
               totalAmount: 45,
               paid: false,
               travelers: 4
            },
            {
               id: 'BK-1003',
               userId: 'u3',
               itemId: 'ai-plan',
               itemName: 'Custom AI Trip to Goa',
               customerName: 'Rahul Verma',
               customerEmail: 'rahul@example.com',
               customerPhone: '9988776655',
               type: 'AI Plan',
               date: new Date(Date.now() - 172800000).toISOString(),
               travelDate: '2024-12-10',
               status: 'Pending',
               totalAmount: 0,
               paid: false,
               travelers: 2,
               message: 'Need a beachfront villa'
            },
            {
               id: 'BK-1004',
               userId: 'u4',
               itemId: 'contact-form',
               itemName: 'Partnership Inquiry',
               customerName: 'John Doe',
               customerEmail: 'john@agency.com',
               customerPhone: 'N/A',
               type: 'General',
               date: new Date(Date.now() - 250000000).toISOString(),
               status: 'Resolved',
               totalAmount: 0,
               paid: false,
               travelers: 1,
               message: 'Interested in becoming a local partner.'
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
        
        // Restore Session
        const storedSession = localStorage.getItem('holidaypot_admin_session');
        if (storedSession) {
            setCurrentUser(JSON.parse(storedSession));
        }

        // Restore Logs, Managers, Posts from local for demo
        const storedManagers = localStorage.getItem('holidaypot_managers');
        if (storedManagers) setManagers(JSON.parse(storedManagers));
        
        const storedLogs = localStorage.getItem('holidaypot_logs');
        if (storedLogs) setActivityLogs(JSON.parse(storedLogs));

        const storedPosts = localStorage.getItem('holidaypot_blog_posts');
        if (storedPosts) setBlogPosts(JSON.parse(storedPosts));
        else setBlogPosts(MOCK_POSTS);

        const storedPages = localStorage.getItem('holidaypot_site_pages');
        if (storedPages) setSitePages(JSON.parse(storedPages));

        // Restore Tenant Session
        const storedTenant = localStorage.getItem('holidaypot_tenant_session');
        if (storedTenant) {
            const t = JSON.parse(storedTenant);
            // Re-calc flags
            const flags: string[] = [];
            if (t.plan_id === 'basic') flags.push('packages', 'bookings');
            else if (t.plan_id === 'pro') flags.push('packages', 'bookings', 'drivers', 'blog', 'analytics');
            else if (t.plan_id === 'enterprise') flags.push('packages', 'bookings', 'drivers', 'blog', 'analytics', 'ai_planner', 'white_label');
            
            setCurrentTenant(t);
            setFeatureFlags(flags);
        }

      } catch (err) {
        console.error("Supabase connection error, falling back to mocks", err);
        setPackages(POPULAR_PACKAGES);
        setBlogPosts(MOCK_POSTS);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Auth & Logging ---

  const login = async (username: string, pass: string): Promise<boolean> => {
     // Default password logic for ALL users if specific password isn't matched
     const DEFAULT_PASS = 'admin123';
     
     // Check hardcoded super admin override via localstorage first
     const storedPwd = localStorage.getItem('holidayPot_admin_pwd') || DEFAULT_PASS;
     
     if (username === 'admin' && (pass === storedPwd || pass === DEFAULT_PASS)) {
        const adminUser = managers.find(m => m.username === 'admin') || MOCK_MANAGERS[0];
        setCurrentUser(adminUser);
        localStorage.setItem('holidaypot_admin_session', JSON.stringify(adminUser));
        logAction('Logged In', 'Manager', adminUser.id, 'Session Started');
        return true;
     }

     // Check other managers
     const foundManager = managers.find(m => m.username === username);
     if (foundManager) {
        // Allow if password matches OR if it matches default
        if (foundManager.password === pass || pass === DEFAULT_PASS) {
            setCurrentUser(foundManager);
            localStorage.setItem('holidaypot_admin_session', JSON.stringify(foundManager));
            logAction('Logged In', 'Manager', foundManager.id, 'Session Started');
            return true;
        }
     }
     
     return false;
  };

  const logout = () => {
    if (currentUser) logAction('Logged Out', 'Manager', currentUser.id, 'Session Ended');
    setCurrentUser(null);
    localStorage.removeItem('holidaypot_admin_session');
  };

  const updateProfile = (data: Partial<Manager>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setManagers(prev => prev.map(m => m.id === updated.id ? updated : m));
    localStorage.setItem('holidaypot_admin_session', JSON.stringify(updated));
  };

  const logAction = (
     action: string, 
     targetType: ActivityLog['targetType'], 
     targetId: string = '', 
     details: string = '',
     previousData?: any
  ) => {
     const newLog: ActivityLog = {
         id: `log_${Date.now()}`,
         actorId: currentUser?.id || 'system',
         actorName: currentUser?.name || 'System',
         action,
         targetType,
         targetId,
         details,
         timestamp: new Date().toISOString(),
         previousData
     };
     const updatedLogs = [newLog, ...activityLogs];
     setActivityLogs(updatedLogs);
     localStorage.setItem('holidaypot_logs', JSON.stringify(updatedLogs));
  };

  const revertAction = (logId: string) => {
     const logIndex = activityLogs.findIndex(l => l.id === logId);
     if (logIndex === -1) return;
     const log = activityLogs[logIndex];
     
     if (log.isReverted) return;

     // Specific Logic for Enquiries/Bookings Status
     if (log.targetType === 'Booking' && log.action.includes('Status') && log.previousData) {
         setBookings(prev => prev.map(b => b.id === log.targetId ? { ...b, status: log.previousData } : b));
         // Mark as reverted
         const newLogs = [...activityLogs];
         newLogs[logIndex] = { ...log, isReverted: true };
         setActivityLogs(newLogs);
         localStorage.setItem('holidaypot_logs', JSON.stringify(newLogs));
         
         // Add a new log for the revert itself
         logAction('Reverted Action', 'Booking', log.targetId, `Reverted status change based on log ${logId}`);
         alert(`Successfully reverted booking ${log.targetId} to ${log.previousData}`);
     } else {
         alert("This action cannot be automatically reverted.");
     }
  };

  // --- Manager CRUD ---

  const addManager = (manager: Manager) => {
     const updated = [...managers, manager];
     setManagers(updated);
     localStorage.setItem('holidaypot_managers', JSON.stringify(updated));
     logAction('Created Manager', 'Manager', manager.id, `Created ${manager.username}`);
  };

  const updateManager = (manager: Manager) => {
     const updated = managers.map(m => m.id === manager.id ? manager : m);
     setManagers(updated);
     localStorage.setItem('holidaypot_managers', JSON.stringify(updated));
     logAction('Updated Manager', 'Manager', manager.id, `Updated profile/permissions for ${manager.username}`);
  };

  const deleteManager = (id: string) => {
     const updated = managers.filter(m => m.id !== id);
     setManagers(updated);
     localStorage.setItem('holidaypot_managers', JSON.stringify(updated));
     logAction('Deleted Manager', 'Manager', id, 'Removed user access');
  };

  // --- Blog CRUD ---
  
  const addBlogPost = (post: BlogPost) => {
    const updated = [post, ...blogPosts];
    setBlogPosts(updated);
    localStorage.setItem('holidaypot_blog_posts', JSON.stringify(updated));
    logAction('Created Post', 'Blog', post.id, post.title);
  };

  const updateBlogPost = (post: BlogPost) => {
    const updated = blogPosts.map(p => p.id === post.id ? post : p);
    setBlogPosts(updated);
    localStorage.setItem('holidaypot_blog_posts', JSON.stringify(updated));
    logAction('Updated Post', 'Blog', post.id, post.title);
  };

  const deleteBlogPost = (id: string) => {
    const updated = blogPosts.filter(p => p.id !== id);
    setBlogPosts(updated);
    localStorage.setItem('holidaypot_blog_posts', JSON.stringify(updated));
    logAction('Deleted Post', 'Blog', id);
  };

  // --- Actions ---

  const addPackage = async (pkg: Package) => {
    setPackages(prev => [pkg, ...prev]);
    await supabase.from('packages').insert(pkg);
    logAction('Created Package', 'Package', pkg.id, pkg.name);
  };

  const updatePackage = async (updatedPkg: Package) => {
    setPackages(prev => prev.map(p => p.id === updatedPkg.id ? updatedPkg : p));
    await supabase.from('packages').update(updatedPkg).eq('id', updatedPkg.id);
    logAction('Updated Package', 'Package', updatedPkg.id, updatedPkg.name);
  };

  const deletePackage = async (id: string) => {
    const hasBookings = bookings.some(b => b.itemId === id);
    if (hasBookings) {
        alert("Cannot delete this package because there are bookings associated with it.");
        return;
    }
    setPackages(prev => prev.filter(p => p.id !== id));
    logAction('Deleted Package', 'Package', id);
    try {
        await supabase.from('packages').delete().eq('id', id);
    } catch (e) { console.error(e); }
  };

  const addDriver = async (driver: Driver) => {
    setDrivers(prev => [driver, ...prev]);
    await supabase.from('drivers').insert(driver);
    logAction('Registered Driver', 'Driver', driver.id, driver.name);
  };

  const updateDriverStatus = async (id: string, status: Driver['status']) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    await supabase.from('drivers').update({ status }).eq('id', id);
    logAction('Updated Driver Status', 'Driver', id, `Status: ${status}`);
  };

  const deleteDriver = async (id: string) => {
    setDrivers(prev => prev.filter(d => d.id !== id));
    await supabase.from('drivers').delete().eq('id', id);
    logAction('Deleted Driver', 'Driver', id);
  };

  const addBooking = async (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
    await supabase.from('bookings').insert(booking);
    // No log action needed for public booking, or log as system
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    // Capture previous for revert
    const prevBooking = bookings.find(b => b.id === id);
    const prevStatus = prevBooking?.status;

    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    await supabase.from('bookings').update({ status }).eq('id', id);
    
    logAction('Updated Booking Status', 'Booking', id, `Changed from ${prevStatus} to ${status}`, prevStatus);
  };

  const updateCompanyProfile = async (profile: CompanyProfile) => {
    setCompanyProfile(profile);
    const { data } = await supabase.from('company_profile').select('id').single();
    if (data) {
       await supabase.from('company_profile').update(profile).eq('id', data.id);
    } else {
       await supabase.from('company_profile').insert(profile);
    }
    logAction('Updated Profile', 'Settings', '', 'Company details updated');
  };

  const updateSeoSettings = async (seo: SeoSettings) => {
    setSeoSettings(seo);
    const { data } = await supabase.from('seo_settings').select('id').single();
    if (data) {
       await supabase.from('seo_settings').update(seo).eq('id', data.id);
    } else {
       await supabase.from('seo_settings').insert(seo);
    }
    logAction('Updated SEO', 'Settings', '', 'SEO meta tags updated');
  };

  const updateAiSettings = (settings: AiSettings) => {
    setAiSettings(settings);
    localStorage.setItem('holidaypot_ai_settings', JSON.stringify(settings));
    logAction('Updated AI Config', 'Settings', '', 'AI Provider/Key updated');
  };

  const updateEmailSettings = (settings: EmailSettings) => {
    setEmailSettings(settings);
    localStorage.setItem('holidaypot_email_settings', JSON.stringify(settings));
    logAction('Updated Email Config', 'Settings', '', 'Notification preferences updated');
  };

  const updatePageSettings = (settings: PageSettings) => {
    setPageSettings(settings);
    localStorage.setItem('holidaypot_page_settings', JSON.stringify(settings));
    logAction('Updated Page Settings', 'Settings', '', 'Maintenance/404 settings updated');
  };

  const updateSitePage = (page: SitePage) => {
    const updatedPages = sitePages.map(p => p.id === page.id ? page : p);
    setSitePages(updatedPages);
    localStorage.setItem('holidaypot_site_pages', JSON.stringify(updatedPages));
    logAction('Updated Content', 'Content', page.id, `Updated ${page.title} page content`);
  };

  const importData = (data: any) => {
    if(data.packages) setPackages(data.packages);
    if(data.drivers) setDrivers(data.drivers);
    if(data.bookings) setBookings(data.bookings);
    if(data.companyProfile) setCompanyProfile(data.companyProfile);
    if(data.aiSettings) updateAiSettings(data.aiSettings);
    if(data.emailSettings) updateEmailSettings(data.emailSettings);
    if(data.seoSettings) setSeoSettings(data.seoSettings);
    if(data.blogPosts) setBlogPosts(data.blogPosts);
    if(data.sitePages) setSitePages(data.sitePages);
    
    // Set restore time as new backup time
    const now = new Date().toISOString();
    setLastBackupDate(now);
    localStorage.setItem('holidaypot_last_backup', now);
    
    logAction('System Restore', 'Settings', '', 'Data imported from backup');

    alert("Data imported to local state. Note: This does not automatically sync deeply to the database in this demo to prevent corruption.");
  };

  // SaaS Methods
  const initializeTenantSession = async (tenant: Tenant, manager: Manager) => {
    setCurrentTenant(tenant);
    setCurrentUser(manager);
    
    localStorage.setItem('holidaypot_tenant_session', JSON.stringify(tenant));
    localStorage.setItem('holidaypot_admin_session', JSON.stringify(manager));

    // Calculate Flags
    const flags: string[] = [];
    if (tenant.plan_id === 'basic') flags.push('packages', 'bookings');
    else if (tenant.plan_id === 'pro') flags.push('packages', 'bookings', 'drivers', 'blog', 'analytics');
    else if (tenant.plan_id === 'enterprise') flags.push('packages', 'bookings', 'drivers', 'blog', 'analytics', 'ai_planner', 'white_label');
    setFeatureFlags(flags);
  };

  return (
    <GlobalContext.Provider value={{
      packages,
      drivers,
      bookings,
      blogPosts,
      companyProfile,
      seoSettings,
      aiSettings,
      emailSettings,
      pageSettings,
      sitePages,
      lastBackupDate,
      currentUser,
      managers,
      activityLogs,
      login,
      logout,
      updateProfile,
      addManager,
      updateManager,
      deleteManager,
      logAction,
      revertAction,
      addPackage,
      updatePackage,
      deletePackage,
      addDriver,
      updateDriverStatus,
      deleteDriver,
      addBooking,
      updateBookingStatus,
      addBlogPost,
      updateBlogPost,
      deleteBlogPost,
      updateCompanyProfile,
      updateSeoSettings,
      updateAiSettings,
      updateEmailSettings,
      updatePageSettings,
      updateSitePage,
      importData,
      loading,
      currentTenant,
      featureFlags,
      initializeTenantSession
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
