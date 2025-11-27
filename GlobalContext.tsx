import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Package, Driver, Booking } from './types';
import { POPULAR_PACKAGES, MOCK_DRIVERS, MOCK_RIDES } from './constants';

interface GlobalContextType {
  packages: Package[];
  drivers: Driver[];
  bookings: Booking[];
  addPackage: (pkg: Package) => void;
  updatePackage: (pkg: Package) => void;
  deletePackage: (id: string) => void;
  addDriver: (driver: Driver) => void;
  updateDriverStatus: (id: string, status: Driver['status']) => void;
  deleteDriver: (id: string) => void;
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<Package[]>(POPULAR_PACKAGES);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [bookings, setBookings] = useState<Booking[]>([
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
       status: 'Pending',
       totalAmount: 45,
       paid: false,
       travelers: 1
    }
  ]);

  const addPackage = (pkg: Package) => {
    setPackages(prev => [pkg, ...prev]);
  };

  const updatePackage = (updatedPkg: Package) => {
    setPackages(prev => prev.map(p => p.id === updatedPkg.id ? updatedPkg : p));
  };

  const deletePackage = (id: string) => {
    setPackages(prev => prev.filter(p => p.id !== id));
  };

  const addDriver = (driver: Driver) => {
    setDrivers(prev => [driver, ...prev]);
  };

  const updateDriverStatus = (id: string, status: Driver['status']) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const deleteDriver = (id: string) => {
    setDrivers(prev => prev.filter(d => d.id !== id));
  };

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  return (
    <GlobalContext.Provider value={{
      packages,
      drivers,
      bookings,
      addPackage,
      updatePackage,
      deletePackage,
      addDriver,
      updateDriverStatus,
      deleteDriver,
      addBooking,
      updateBookingStatus
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
