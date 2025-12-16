
import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  Users, Eye, MousePointer, ShoppingCart, TrendingUp, TrendingDown, 
  Globe, Smartphone, AlertTriangle, Clock, Calendar, Filter, Activity,
  Search, Cpu, Server, Shield, Zap, Award, Layers, Network, Sparkles, CheckCircle
} from 'lucide-react';
import { useGlobal } from '../../GlobalContext';

// Helper to generate chart data based on date range
const generateMockData = (days: number) => {
  const data = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    data.push({
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sessions: Math.floor(Math.random() * 500) + 100,
      previousSessions: Math.floor(Math.random() * 500) + 100,
      pageviews: Math.floor(Math.random() * 1000) + 200,
    });
  }
  return data;
};

const AdminAnalytics: React.FC = () => {
  const { bookings, companyProfile, seoSettings } = useGlobal();
  const [dateRange, setDateRange] = useState('30d');
  const [compareMode, setCompareMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'traffic' | 'seo'>('traffic');

  // Traffic Mock Data
  const chartData = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    return generateMockData(days);
  }, [dateRange]);

  const trafficSources = [
    { name: 'Organic Search', value: 45, sessions: 1250, conversion: '3.2%' },
    { name: 'Direct', value: 25, sessions: 800, conversion: '4.5%' },
    { name: 'Social Media', value: 20, sessions: 650, conversion: '1.8%' },
    { name: 'Paid Ads', value: 10, sessions: 320, conversion: '2.1%' },
  ];

  const deviceData = [
    { name: 'Mobile', value: 65, color: '#0EA5E9' },
    { name: 'Desktop', value: 30, color: '#10B981' },
    { name: 'Tablet', value: 5, color: '#F97316' },
  ];

  const topPages = [
    { url: '/packages/rajasthan-royal', views: 1205, time: '2m 45s', bounce: '42%' },
    { url: '/packages/kerala-backwaters', views: 980, time: '3m 10s', bounce: '35%' },
    { url: '/ai-planner', views: 850, time: '5m 20s', bounce: '25%' },
    { url: '/taxi', views: 600, time: '1m 30s', bounce: '55%' },
    { url: '/', views: 2500, time: '1m 10s', bounce: '40%' },
  ];

  const kpis = [
    { label: 'Total Sessions', value: '12,450', change: '+12.5%', isUp: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pageviews', value: '45,200', change: '+8.2%', isUp: true, icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Conversion Rate', value: '3.2%', change: '-0.5%', isUp: false, icon: MousePointer, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Avg. Engagement', value: '2m 15s', change: '+10s', isUp: true, icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const alerts = [
    { type: 'warning', message: 'Traffic drop > 20% on "Goa Package" page', time: '2 hours ago' },
    { type: 'info', message: 'Spike in mobile traffic from Mumbai', time: '5 hours ago' },
  ];

  // --- SEO & AEO Mock Data ---
  
  const seoRadarData = [
    { subject: 'Technical SEO', A: 90, fullMark: 100 },
    { subject: 'Content Depth', A: 85, fullMark: 100 },
    { subject: 'Schema (AEO)', A: 95, fullMark: 100 },
    { subject: 'Backlinks', A: 65, fullMark: 100 },
    { subject: 'Mobile UX', A: 92, fullMark: 100 },
    { subject: 'Local Authority', A: 88, fullMark: 100 },
  ];

  const keywordRankings = [
    { keyword: 'Luxury India Travel', google: 4, ai: 2, vol: '12K', sentiment: 'Positive' },
    { keyword: 'Kerala Houseboat Booking', google: 2, ai: 1, vol: '8.5K', sentiment: 'Positive' },
    { keyword: 'Rajasthan Tour Packages', google: 7, ai: 5, vol: '22K', sentiment: 'Neutral' },
    { keyword: 'Taxi Service Mumbai', google: 12, ai: 8, vol: '5K', sentiment: 'Neutral' },
    { keyword: 'Best time to visit Goa', google: 1, ai: 1, vol: '45K', sentiment: 'Positive' },
  ];

  const domainStats = [
    { label: 'Domain Authority', value: '48', max: '/100', icon: Globe, color: 'text-blue-600' },
    { label: 'PageRank', value: '4.2', max: '/10', icon: Layers, color: 'text-green-600' },
    { label: 'AEO Confidence', value: 'High', max: '', icon: Sparkles, color: 'text-purple-600' },
    { label: 'Spam Score', value: '1%', max: '', icon: Shield, color: 'text-green-500' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Activity size={24} className="text-brand-blue"/> Analytics
        </h1>
        
        <div className="flex items-center gap-4">
          {/* Tab Switcher */}
          <div className="bg-gray-100 p-1 rounded-lg flex items-center">
             <button 
                onClick={() => setActiveTab('traffic')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'traffic' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                Traffic & Users
             </button>
             <button 
                onClick={() => setActiveTab('seo')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${activeTab === 'seo' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                <Search size={12}/> SEO & Intelligence
             </button>
          </div>

          <div className="h-6 w-px bg-gray-300 mx-2 hidden md:block"></div>

          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg hidden md:flex">
             <button 
                onClick={() => setDateRange('7d')} 
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${dateRange === '7d' ? 'bg-white shadow-sm text-brand-blue' : 'text-gray-500 hover:text-gray-900'}`}
             >7 Days</button>
             <button 
                onClick={() => setDateRange('30d')} 
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${dateRange === '30d' ? 'bg-white shadow-sm text-brand-blue' : 'text-gray-500 hover:text-gray-900'}`}
             >30 Days</button>
          </div>
        </div>
      </div>

      {/* --- TRAFFIC ANALYTICS VIEW --- */}
      {activeTab === 'traffic' && (
        <div className="space-y-8 animate-fade-in">
            {/* KPI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
                        <kpi.icon size={20}/>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${kpi.isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {kpi.isUp ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                        {kpi.change}
                    </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{kpi.label}</div>
                </div>
                ))}
            </div>

            {/* Traffic Overview */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Traffic Overview (Sessions)</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} minTickGap={30}/>
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}}/>
                        <Tooltip 
                            contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                            cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}}
                        />
                        <Legend verticalAlign="top" height={36}/>
                        <Area type="monotone" dataKey="sessions" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#colorSessions)" name="Current Period" activeDot={{r: 6}}/>
                        {compareMode && (
                            <Area type="monotone" dataKey="previousSessions" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPrev)" name="Previous Period"/>
                        )}
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Acquisition */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Acquisition Channels</h3>
                    <div className="space-y-6">
                    {trafficSources.map((source, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-bold text-gray-800">{source.name}</span>
                                <div className="text-right">
                                <span className="block text-sm font-bold text-gray-900">{source.sessions} sessions</span>
                                <span className="text-xs text-gray-500">Conv: {source.conversion}</span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div className="bg-brand-blue h-2.5 rounded-full" style={{ width: `${source.value}%` }}></div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>

                {/* Audience Insights */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Audience Breakdown</h3>
                    <div className="h-64 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={deviceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {deviceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold text-gray-900">65%</span>
                        <span className="text-xs text-gray-500 uppercase">Mobile</span>
                    </div>
                    </div>
                </div>
            </div>

            {/* User Behavior Table */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Top Pages & Behavior</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Page URL</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Pageviews</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Avg Time</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Bounce Rate</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {topPages.map((page, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-brand-blue">{page.url}</td>
                                <td className="p-4 text-right font-bold text-gray-900">{page.views}</td>
                                <td className="p-4 text-right text-gray-600">{page.time}</td>
                                <td className="p-4 text-right">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${parseInt(page.bounce) > 50 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    {page.bounce}
                                </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>

            {/* Performance & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Performance & Tech</h3>
                    <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                        <div className="text-xs text-gray-500 mb-1">Avg Load Time</div>
                        <div className="text-xl font-bold text-green-600">1.2s</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                        <div className="text-xs text-gray-500 mb-1">Server Uptime</div>
                        <div className="text-xl font-bold text-green-600">99.9%</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                        <div className="text-xs text-gray-500 mb-1">Core Web Vitals</div>
                        <div className="text-xl font-bold text-blue-600">Good</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                        <div className="text-xs text-gray-500 mb-1">Error Rate (5xx)</div>
                        <div className="text-xl font-bold text-gray-900">0.01%</div>
                    </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-orange-500"/> Alerts & Anomalies
                    </h3>
                    <div className="space-y-4">
                    {alerts.map((alert, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border-l-4 ${alert.type === 'warning' ? 'bg-orange-50 border-orange-500' : 'bg-blue-50 border-blue-500'}`}>
                            <div className="flex justify-between items-start">
                                <p className="font-medium text-gray-900 text-sm">{alert.message}</p>
                                <span className="text-xs text-gray-500 whitespace-nowrap">{alert.time}</span>
                            </div>
                        </div>
                    ))}
                    {alerts.length === 0 && <p className="text-gray-500 text-sm">No active alerts. System healthy.</p>}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- SEO & INTELLIGENCE VIEW --- */}
      {activeTab === 'seo' && (
        <div className="space-y-8 animate-fade-in">
            {/* Domain Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {domainStats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                                <stat.icon size={18}/>
                            </div>
                            <span className="text-sm font-bold text-gray-600">{stat.label}</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                            {stat.value}<span className="text-sm text-gray-400 font-normal">{stat.max}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Radar Chart: Optimization Score */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Zap size={20} className="text-yellow-500"/> Optimization Balance
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={seoRadarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar name="Score" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-4 text-xs text-gray-500">
                        Optimization areas compared to industry benchmarks
                    </div>
                </div>

                {/* Rankings Table */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Award size={20} className="text-blue-500"/> Keyword & AEO Authority
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Topic / Keyword</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Google Rank</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">AI Confidence (AEO)</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Volume</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {keywordRankings.map((kw, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900 text-sm">{kw.keyword}</div>
                                            <div className={`text-[10px] uppercase font-bold ${kw.sentiment === 'Positive' ? 'text-green-500' : 'text-gray-400'}`}>{kw.sentiment} Sentiment</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${kw.google <= 3 ? 'bg-green-100 text-green-700' : kw.google <= 10 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                                #{kw.google}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {/* Simulated AI Ranking (lower is better or confidence score) */}
                                            <div className="flex justify-center items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${kw.ai <= 3 ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                                                <span className="text-sm font-medium text-gray-700">{kw.ai <= 3 ? 'High' : kw.ai <= 8 ? 'Medium' : 'Low'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-mono text-xs text-gray-500">{kw.vol}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Technical Infrastructure */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Server size={20} className="text-gray-600"/> Infrastructure & Hosting Logic
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase">
                            <Network size={14}/> Hosting Provider
                        </div>
                        <div className="font-bold text-gray-900">Vercel / AWS Edge</div>
                        <div className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle size={10}/> Operational</div>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase">
                            <Globe size={14}/> Server Region
                        </div>
                        <div className="font-bold text-gray-900">{seoSettings.geoRegion || 'Global (CDN)'}</div>
                        <div className="text-xs text-gray-500 mt-1">Latency: 45ms</div>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase">
                            <Shield size={14}/> SSL Status
                        </div>
                        <div className="font-bold text-gray-900">TLS 1.3 Active</div>
                        <div className="text-xs text-gray-500 mt-1">Expires: Dec 2025</div>
                    </div>
                </div>
                
                {/* Generative Visibility Badge */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-purple-900 text-sm">Generative Engine Optimization (GEO) Status</h4>
                        <p className="text-xs text-purple-700 mt-1">Your content is highly structured for LLMs (Schema + FAQs active).</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-purple-700 font-bold text-sm">
                        Top 5%
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
