import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, ShoppingCart, Shirt, Layers, Wind, Sparkles, Scissors, Box, MapPin } from 'lucide-react';

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback shops list (Dono keys rakh di hain taaki dummy data bhi na phate)
  const dummyShops = [
    { _id: '1', shopName: 'Hexa Premium Cleaners', name: 'Hexa Premium Cleaners', address: 'Sector 4, Near Metro Station', services: ['Wash', 'Iron', 'Dry Clean'] },
    { _id: '2', shopName: 'Hari Krishna Laundry Hub', name: 'Hari Krishna Laundry Hub', address: 'Gomti Nagar, Block C', services: ['Wash', 'Fold & Pack'] },
    { _id: '3', shopName: 'Express Steam Iron', name: 'Express Steam Iron', address: 'Aliganj Main Road', services: ['Iron', 'Bedding'] }
  ];

  const API_URL = 'http://localhost:5000/api/shops'; 

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          setShops(data);
        } else {
          setShops(dummyShops);
        }
      } catch (err) {
        console.warn("Backend API se connect nahi hua, showing mockup data instead.");
        setShops(dummyShops);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  // FIX 1: shop.name ki jagah shop.shopName use kiya search ke liye
  const filteredShops = shops.filter(shop =>
    (shop.shopName || shop.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (shop.address || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = {
    wrapper: {
      minHeight: '100vh',
      backgroundColor: '#0a0f1d',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '40px 60px 40px 60px',
      boxSizing: 'border-box'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '30px'
    },
    brandText: {
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '1.5px',
      color: '#637393',
      textTransform: 'uppercase',
      marginBottom: '6px'
    },
    welcomeText: {
      fontSize: '32px',
      fontWeight: '700',
      margin: 0
    },
    actionControls: {
      display: 'flex',
      gap: '12px'
    },
    iconCircle: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      backgroundColor: '#131926',
      border: '1px solid #1e2638',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      color: '#94a3b8'
    },
    searchContainer: {
      position: 'relative',
      maxWidth: '500px',
      marginBottom: '40px'
    },
    searchInput: {
      width: '100%',
      padding: '16px 16px 16px 48px',
      borderRadius: '30px',
      backgroundColor: '#131a2a',
      border: '1px solid #1e293b',
      color: '#ffffff',
      fontSize: '15px',
      outline: 'none',
      boxSizing: 'border-box'
    },
    searchIcon: {
      position: 'absolute',
      left: '18px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#475569'
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      gap: '30px',
      alignItems: 'start',
      marginBottom: '40px'
    },
    promoCard: {
      background: 'linear-gradient(135deg, #5b86e5 0%, #36d1dc 100%)',
      borderRadius: '24px',
      padding: '40px',
      minHeight: '340px',
      position: 'relative',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxSizing: 'border-box'
    },
    badge: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      color: '#ffffff',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'inline-block',
      backdropFilter: 'blur(6px)'
    },
    promoHeading: {
      fontSize: '38px',
      fontWeight: '800',
      lineHeight: '1.2',
      margin: '24px 0 12px 0',
      color: '#ffffff',
      maxWidth: '420px'
    },
    promoSub: {
      fontSize: '15px',
      color: 'rgba(255, 255, 255, 0.9)',
      margin: 0
    },
    dotsContainer: {
      display: 'flex',
      gap: '6px',
      marginTop: '20px'
    },
    dot: (active) => ({
      width: active ? '18px' : '8px',
      height: '8px',
      borderRadius: '4px',
      backgroundColor: active ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
      transition: 'all 0.3s'
    }),
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      margin: 0
    },
    seeAll: {
      fontSize: '13px',
      color: '#3b82f6',
      fontWeight: '600',
      cursor: 'pointer',
      background: 'none',
      border: 'none'
    },
    servicesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px'
    },
    // Fix layout compression by adding minWidth to keep standard style
    serviceCard: {
      backgroundColor: '#121824',
      border: '1px solid #1c2436',
      borderRadius: '20px',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '12px',
      cursor: 'pointer'
    },
    serviceIconBox: {
      color: '#3b82f6',
      marginBottom: '4px'
    },
    serviceName: {
      fontSize: '15px',
      fontWeight: '700',
      margin: 0
    },
    serviceDesc: {
      fontSize: '11px',
      color: '#64748b',
      margin: 0,
      lineHeight: '1.3'
    },
    shopsContainer: {
      marginTop: '20px'
    },
    shopsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '20px',
      marginTop: '16px'
    },
    shopCard: {
      backgroundColor: '#121824',
      border: '1px solid #1c2436',
      borderRadius: '20px',
      padding: '20px',
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      cursor: 'pointer'
    },
    shopAvatar: {
      width: '56px',
      height: '56px',
      borderRadius: '12px',
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      color: '#3b82f6',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '20px',
      fontWeight: '700',
      flexShrink: 0
    },
    tagContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      marginTop: '8px'
    },
    tag: {
      fontSize: '10px',
      backgroundColor: '#1e293b',
      color: '#94a3b8',
      padding: '2px 8px',
      borderRadius: '6px'
    }
  };

  const serviceList = [
    { name: 'Wash', desc: 'Everyday clothes', icon: <Shirt size={22} /> },
    { name: 'Dry Clean', desc: 'Suits & formal wear', icon: <Layers size={22} /> },
    { name: 'Iron', desc: 'Steam & press', icon: <Wind size={22} /> },
    { name: 'Shoe Clean', desc: 'Sneakers & leather', icon: <Sparkles size={22} /> },
    { name: 'Bedding', desc: 'Bedsheets & towels', icon: <Scissors size={22} /> },
    { name: 'Fold & Pack', desc: 'Crisp & ready', icon: <Box size={22} /> }
  ];

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <div>
          <div style={styles.brandText}>Hexa Laundry</div>
          <h1 style={styles.welcomeText}>Hi, Hari Krishna</h1>
        </div>
        <div style={styles.actionControls}>
          <div style={styles.iconCircle} onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </div>
          <div style={styles.iconCircle}>
            <ShoppingCart size={20} />
          </div>
        </div>
      </header>

      <div style={styles.searchContainer}>
        <Search size={20} style={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Search for wash, iron..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.mainGrid}>
        <div style={styles.promoCard}>
          <div>
            <div style={styles.badge}>New User Offer</div>
            <h2 style={styles.promoHeading}>Get 20% OFF on your first wash</h2>
            <p style={styles.promoSub}>Fresh clothes, doorstep pickup, and fast delivery.</p>
          </div>
          
          <div style={styles.dotsContainer}>
            <div style={styles.dot(true)}></div>
            <div style={styles.dot(false)}></div>
            <div style={styles.dot(false)}></div>
          </div>
        </div>

        <div>
          {/* Yahan pehle styles.servicesHeader tha jo object me missing tha, isliye inline flex de diya taaki crash na ho */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Services</h3>
            <button style={styles.seeAll}>See all</button>
          </div>

          <div style={styles.servicesGrid}>
            {serviceList.map((srv, index) => (
              <div key={index} style={styles.serviceCard}>
                <div style={styles.serviceIconBox}>{srv.icon}</div>
                <h4 style={styles.serviceName}>{srv.name}</h4>
                <p style={styles.serviceDesc}>{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.shopsContainer}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Select Nearby Laundry Shop</h3>
          <span style={{ fontSize: '13px', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} /> Live Location
          </span>
        </div>

        {loading ? (
          <p style={{ color: '#64748b', fontSize: '14px' }}>Shops ki live details aa rahi hain...</p>
        ) : (
          <div style={styles.shopsGrid}>
            {filteredShops.map((shop) => (
              <div key={shop._id || shop.id} style={styles.shopCard}>
                {/* FIX 2: Avatar me shop.shopName pass kiya */}
                <div style={styles.shopAvatar}>{(shop.shopName || shop.name || 'L').charAt(0)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* FIX 3: shop.name ki jagah shop.shopName render kiya */}
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {shop.shopName || shop.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '12px' }}>
                    <MapPin size={12} style={{ flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shop.address || 'N/A'}</span>
                  </div>
                  <div style={styles.tagContainer}>
                    {(shop.services || []).map((srv, idx) => (
                      <span key={idx} style={styles.tag}>
                        {typeof srv === 'object' ? srv.name : srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}