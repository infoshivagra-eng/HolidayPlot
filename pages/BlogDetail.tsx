
import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGlobal } from '../GlobalContext';
import { Calendar, Tag, Share2, Facebook, Twitter, Link as LinkIcon, HelpCircle, ImageIcon, ChevronDown, MapPin, ArrowRight, Lightbulb, List, CheckCircle2, Thermometer, CloudRain, Star, Sparkles, Tent, Music, Clock, Users } from 'lucide-react';
import { useCurrency } from '../CurrencyContext';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts, seoSettings, companyProfile, packages } = useGlobal();
  const { formatPrice } = useCurrency();
  const post = blogPosts.find(p => p.slug === slug);
  
  // Find linked package
  const linkedPackage = post?.relatedPackageId ? packages.find(p => p.id === post.relatedPackageId) : null;

  // Extract headings for Table of Contents
  const toc = useMemo(() => {
    if (!post?.content) return [];
    const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/g;
    const items = [];
    let match;
    while ((match = regex.exec(post.content)) !== null) {
      items.push({
        level: match[1],
        text: match[2].replace(/<[^>]+>/g, ''), // Strip tags inside headers if any
        id: match[2].toLowerCase().replace(/[^a-z0-9]+/g, '-')
      });
    }
    // Add dynamic sections to TOC if they exist
    if (post.topActivities?.length) items.push({ level: '2', text: 'Top Things to Do', id: 'top-activities' });
    if (post.weatherData?.length) items.push({ level: '2', text: 'Weather Guide', id: 'weather-guide' });
    if (post.festivals?.length) items.push({ level: '2', text: 'Festivals', id: 'festivals' });
    if (linkedPackage) items.push({ level: '2', text: 'Recommended Tour', id: 'tour-package' });
    
    return items;
  }, [post, linkedPackage]);

  // Inject IDs into content for scrolling
  const processedContent = useMemo(() => {
    if (!post?.content) return '';
    return post.content.replace(/<h([23])>(.*?)<\/h[23]>/g, (match, level, text) => {
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return `<h${level} id="${id}" class="scroll-mt-24 font-bold text-gray-900 ${level === '2' ? 'text-2xl mt-8 mb-4' : 'text-xl mt-6 mb-3'}">${text}</h${level}>`;
    });
  }, [post?.content]);

  // SEO & Schema Injection
  useEffect(() => {
    if (post) {
       document.title = post.seoTitle || post.title + " | " + companyProfile.name;
       const metaDesc = document.querySelector('meta[name="description"]');
       if (metaDesc) metaDesc.setAttribute('content', post.seoDescription || post.excerpt);
       
       // BlogPosting Schema
       const schema = {
         "@context": "https://schema.org",
         "@type": "BlogPosting",
         "headline": post.title,
         "image": post.image,
         "author": {
           "@type": "Person",
           "name": post.author
         },
         "publisher": {
            "@type": "Organization",
            "name": companyProfile.name,
            "logo": {
                "@type": "ImageObject",
                "url": companyProfile.logo
            }
         },
         "datePublished": post.date,
         "description": post.seoDescription || post.excerpt
       };

       // Inject Scripts
       const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.text = JSON.stringify(schema); document.head.appendChild(s1);

       return () => {
          document.title = seoSettings.title;
          if(document.head.contains(s1)) document.head.removeChild(s1);
       };
    }
  }, [post, seoSettings, companyProfile]);

  if (!post) return <div className="min-h-screen flex items-center justify-center text-gray-500">Post not found.</div>;

  const shareUrl = window.location.href;

  return (
    <div className="bg-white min-h-screen font-sans">
       
       {/* Full-width Immersive Hero */}
       <div className="relative h-[80vh] min-h-[600px] w-full">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          <div className="absolute inset-0 flex flex-col justify-end pb-20 px-6 sm:px-12 max-w-7xl mx-auto w-full">
             <div className="animate-fade-in">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-white/80 text-sm mb-6 font-medium">
                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                    <ChevronDown className="rotate-[-90deg] opacity-50" size={14} />
                    <Link to="/blog" className="hover:text-white transition-colors">Travel Journal</Link>
                    <ChevronDown className="rotate-[-90deg] opacity-50" size={14} />
                    <span className="text-white truncate max-w-[200px]">{post.title}</span>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                    {post.tags.slice(0,3).map(tag => (
                        <span key={tag} className="bg-brand-orange text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider shadow-sm">{tag}</span>
                    ))}
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight max-w-4xl drop-shadow-lg font-serif">
                    {post.title}
                </h1>
                
                <div className="flex items-center gap-6 text-white/90 text-sm md:text-base font-medium">
                    <span className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white text-brand-blue flex items-center justify-center font-bold text-sm">
                            {post.author.charAt(0)}
                        </div>
                        By {post.author}
                    </span>
                    <span className="flex items-center gap-2"><Calendar size={18}/> {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    {post.geoFocus && <span className="flex items-center gap-2"><MapPin size={18}/> {post.geoFocus}</span>}
                </div>
             </div>
          </div>
       </div>

       {/* Main Layout */}
       <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 order-2 lg:order-1">
             
             {/* Key Takeaways */}
             <div className="bg-blue-50 border-l-4 border-brand-blue p-6 mb-10 rounded-r-xl max-w-3xl">
                <h3 className="text-lg font-bold text-brand-blue mb-3 flex items-center gap-2">
                    <Lightbulb size={20}/> Quick Summary
                </h3>
                <p className="text-gray-700 italic leading-relaxed">{post.excerpt}</p>
             </div>

             {/* Dynamic Rich Content - Top Activities */}
             {post.topActivities && post.topActivities.length > 0 && (
                <div id="top-activities" className="mb-12 scroll-mt-24 max-w-3xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Star className="text-yellow-500 fill-current"/> Top Things to Do</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {post.topActivities.map((act: any, i) => {
                            // Safe render: If object, convert to string description
                            const activityLabel = typeof act === 'string' ? act : (act.activity || act.name || JSON.stringify(act));
                            return (
                                <li key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                    <span className="bg-brand-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                                    <span className="font-medium text-gray-800">{activityLabel}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
             )}

             {/* Main HTML Content - Constrained width */}
             <div 
                className="prose prose-lg prose-blue max-w-3xl text-gray-700 leading-8 prose-headings:font-serif prose-headings:text-gray-900 prose-img:rounded-xl prose-img:shadow-lg prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: processedContent }}
             />

             {/* Best Time & Weather Table */}
             {(post.bestTimeDescription || (post.weatherData && post.weatherData.length > 0)) && (
                <div id="weather-guide" className="mt-16 mb-12 scroll-mt-24 max-w-3xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><CloudRain className="text-blue-500"/> When is the Best Time to Visit?</h2>
                    {post.bestTimeDescription && <p className="text-gray-700 mb-6 leading-relaxed">{post.bestTimeDescription}</p>}
                    
                    {post.weatherData && post.weatherData.length > 0 && (
                        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3">Month</th>
                                        <th className="px-6 py-3 text-center"><Thermometer size={14} className="inline mr-1"/> High</th>
                                        <th className="px-6 py-3 text-center"><Thermometer size={14} className="inline mr-1"/> Low</th>
                                        <th className="px-6 py-3 text-center"><CloudRain size={14} className="inline mr-1"/> Rain</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {post.weatherData.map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-3 font-medium text-gray-900">{row.month}</td>
                                            <td className="px-6 py-3 text-center text-orange-600 font-bold">{row.tempHigh}</td>
                                            <td className="px-6 py-3 text-center text-blue-600 font-bold">{row.tempLow}</td>
                                            <td className="px-6 py-3 text-center">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${row.rain.toLowerCase().includes('high') ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {row.rain}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
             )}

             {/* Festivals Section */}
             {post.festivals && post.festivals.length > 0 && (
                <div id="festivals" className="mt-12 mb-12 scroll-mt-24 max-w-3xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Music className="text-purple-500"/> Major Festivals</h2>
                    <div className="grid gap-6">
                        {post.festivals.map((fest, i) => (
                            <div key={i} className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-purple-900">{fest.name}</h3>
                                    <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase">{fest.month}</span>
                                </div>
                                <p className="text-purple-800 text-sm leading-relaxed">{fest.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
             )}

             {/* Adventure Pairs */}
             {post.adventurePairs && post.adventurePairs.length > 0 && (
                <div className="mt-12 mb-12 bg-green-50 p-8 rounded-2xl border border-green-100 max-w-3xl">
                    <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2"><Tent className="text-green-600"/> Adventures Pairing</h2>
                    <p className="text-green-900 mb-4">Extend your trip! These nearby adventures pair perfectly with a visit to {post.geoFocus}.</p>
                    <div className="flex flex-wrap gap-3">
                        {post.adventurePairs.map((pair: any, i: number) => {
                            // Fix: Handle cases where pair is an object (AEO generated) or string
                            let label = '';
                            if (typeof pair === 'string') {
                                label = pair;
                            } else if (typeof pair === 'object' && pair !== null) {
                                // Try to extract meaningful text from object keys typical in AI responses
                                label = pair.place || pair.activity || pair.name || JSON.stringify(pair);
                                if (pair.place && pair.activity) label = `${pair.place} (${pair.activity})`;
                            }
                            
                            return (
                                <span key={i} className="bg-white text-green-700 px-4 py-2 rounded-lg font-bold shadow-sm border border-green-200 flex items-center gap-2">
                                    <MapPin size={14}/> {label}
                                </span>
                            );
                        })}
                    </div>
                </div>
             )}

             {/* Gallery Grid */}
             {post.gallery && post.gallery.length > 0 && (
                <div className="mt-16 mb-16 max-w-4xl">
                   <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
                       <ImageIcon size={24} className="text-brand-blue"/> Visual Journey
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {post.gallery.map((img, idx) => (
                         <div key={idx} className="rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-64 group">
                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {/* FAQ */}
             {post.faq && post.faq.length > 0 && (
                <div className="mt-12 bg-gray-50 p-8 rounded-2xl border border-gray-100 max-w-3xl">
                   <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                       <HelpCircle size={24} className="text-brand-orange"/> Common Questions
                   </h3>
                   <div className="space-y-4">
                      {post.faq.map((item, idx) => (
                         <details key={idx} className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <summary className="flex justify-between items-center p-5 cursor-pointer font-bold text-gray-800 list-none hover:bg-gray-50 transition-colors">
                               {item.question}
                               <span className="transition-transform group-open:rotate-180 bg-gray-100 rounded-full p-1">
                                  <ChevronDown size={16} className="text-gray-500"/>
                               </span>
                            </summary>
                            <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-100">
                               {item.answer}
                            </div>
                         </details>
                      ))}
                   </div>
                </div>
             )}

             {/* Package Card (Horizontal Booking CTA) */}
             {linkedPackage && (
                <div id="tour-package" className="mt-20 scroll-mt-24 max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="text-brand-orange" size={24}/>
                        <h2 className="text-2xl font-bold text-gray-900">Ready to Experience This?</h2>
                    </div>
                    
                    {/* Compact Horizontal Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row transform hover:-translate-y-1 transition-all duration-300">
                       <div className="md:w-2/5 relative h-64 md:h-auto">
                          <img src={linkedPackage.images[0]} alt={linkedPackage.name} className="w-full h-full object-cover"/>
                          <div className="absolute top-4 left-4 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                             Recommended Tour
                          </div>
                       </div>
                       <div className="p-6 md:w-3/5 flex flex-col justify-center bg-gradient-to-r from-white to-blue-50/50">
                          <div className="flex justify-between items-start mb-2">
                             <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{linkedPackage.name}</h3>
                             <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold">
                                <Star size={12} className="fill-current"/> {linkedPackage.rating}
                             </div>
                          </div>
                          
                          <p className="text-gray-500 text-sm mb-6 line-clamp-2">{linkedPackage.shortDesc}</p>
                          
                          <div className="flex gap-4 text-xs font-semibold text-gray-600 mb-6">
                             <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200"><Clock size={12} className="text-brand-green"/> {linkedPackage.duration}</span>
                             <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200"><Users size={12} className="text-brand-blue"/> {linkedPackage.groupSize}</span>
                          </div>

                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
                             <div>
                                <span className="text-xs text-gray-400 block uppercase tracking-wide">Starting From</span>
                                <span className="text-2xl font-bold text-brand-blue">{formatPrice(linkedPackage.price)}</span>
                             </div>
                             <Link to={`/package/${linkedPackage.id}`} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-orange transition-colors flex items-center gap-2 shadow-lg">
                                View Deal <ArrowRight size={16}/>
                             </Link>
                          </div>
                       </div>
                    </div>
                </div>
             )}

             {/* Author Bio */}
             <div className="mt-16 pt-10 border-t border-gray-200 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left max-w-3xl">
                 <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                     <img src={`https://ui-avatars.com/api/?name=${post.author}&background=0EA5E9&color=fff&size=128`} alt={post.author} className="w-full h-full object-cover"/>
                 </div>
                 <div>
                     <h4 className="text-lg font-bold text-gray-900 mb-2">About {post.author}</h4>
                     <p className="text-gray-600 mb-4">
                         Senior Travel Editor at {companyProfile.name}. Passionate about uncovering hidden gems and helping travelers experience the authentic soul of India.
                     </p>
                     <Link to="/blog" className="text-brand-blue font-bold hover:underline flex items-center justify-center md:justify-start gap-1">
                         Read more articles <ArrowRight size={16}/>
                     </Link>
                 </div>
             </div>

          </div>

          {/* Sidebar Area (Sticky) */}
          <div className="lg:col-span-4 order-1 lg:order-2 space-y-8">
             
             {/* Sticky Wrapper */}
             <div className="sticky top-24 space-y-8">
                 
                 {/* Desktop TOC */}
                 <div className="hidden lg:block bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider flex items-center gap-2">
                        <List size={14}/> In this article
                    </h3>
                    <nav className="flex flex-col gap-3 text-sm text-gray-600 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                        {toc.map(item => (
                            <a 
                                key={item.id} 
                                href={`#${item.id}`} 
                                className={`hover:text-brand-blue transition-colors line-clamp-1 ${item.level === '3' ? 'pl-4 border-l border-gray-200' : 'font-medium'}`}
                            >
                                {item.text}
                            </a>
                        ))}
                    </nav>
                 </div>

                 {/* CTA Box */}
                 <div className="bg-brand-dark text-white p-8 rounded-xl shadow-xl relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue opacity-20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-orange opacity-20 rounded-full blur-3xl -ml-10 -mb-10"></div>
                    
                    <h3 className="text-2xl font-serif font-bold mb-3 relative z-10">Inspired to Travel?</h3>
                    <p className="text-blue-100 mb-6 relative z-10 text-sm">
                        Let our experts craft the perfect itinerary based on this guide.
                    </p>
                    <Link to="/ai-planner" className="inline-block w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow-lg transition-transform hover:-translate-y-1 relative z-10">
                        Plan My Trip
                    </Link>
                    <div className="mt-4 flex justify-center items-center gap-2 text-xs text-blue-200 relative z-10">
                        <CheckCircle2 size={12}/> Free Customization
                    </div>
                 </div>

                 {/* Share Widget */}
                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase flex items-center gap-2">
                        <Share2 size={14}/> Share this guide
                    </h3>
                    <div className="flex gap-2">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex justify-center"><Facebook size={18}/></a>
                        <a href={`https://twitter.com/intent/tweet?text=${post.title}&url=${shareUrl}`} target="_blank" rel="noreferrer" className="flex-1 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors flex justify-center"><Twitter size={18}/></a>
                        <button onClick={() => {navigator.clipboard.writeText(shareUrl); alert('Link copied!');}} className="flex-1 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors flex justify-center"><LinkIcon size={18}/></button>
                    </div>
                 </div>

             </div>
          </div>

       </div>
    </div>
  );
};

export default BlogDetail;
