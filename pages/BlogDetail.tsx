
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGlobal } from '../GlobalContext';
import { Calendar, User, Tag, ChevronLeft, Share2, Facebook, Twitter, Link as LinkIcon, HelpCircle, ImageIcon, ChevronDown } from 'lucide-react';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts, seoSettings } = useGlobal();
  const post = blogPosts.find(p => p.slug === slug);

  // SEO & Schema Injection
  useEffect(() => {
    if (post) {
       document.title = post.seoTitle || post.title + " | HolidayPot Blog";
       const metaDesc = document.querySelector('meta[name="description"]');
       if (metaDesc) metaDesc.setAttribute('content', post.seoDescription || post.excerpt);
       
       // Construct Schema
       const schema = {
         "@context": "https://schema.org",
         "@type": "BlogPosting",
         "headline": post.title,
         "image": post.image,
         "author": {
           "@type": "Person",
           "name": post.author
         },
         "datePublished": post.date,
         "description": post.seoDescription || post.excerpt
       };

       // FAQ Schema
       let faqSchema = null;
       if (post.faq && post.faq.length > 0) {
          faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": post.faq.map(f => ({
              "@type": "Question",
              "name": f.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": f.answer
              }
            }))
          };
       }

       // Inject Scripts
       const script1 = document.createElement('script');
       script1.type = 'application/ld+json';
       script1.text = JSON.stringify(schema);
       document.head.appendChild(script1);

       let script2: HTMLScriptElement | null = null;
       if (faqSchema) {
         script2 = document.createElement('script');
         script2.type = 'application/ld+json';
         script2.text = JSON.stringify(faqSchema);
         document.head.appendChild(script2);
       }

       return () => {
          document.title = seoSettings.title;
          if(document.head.contains(script1)) document.head.removeChild(script1);
          if (script2 && document.head.contains(script2)) document.head.removeChild(script2);
       };
    }
  }, [post, seoSettings]);

  if (!post) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Post not found.</div>;
  }

  const shareUrl = window.location.href;

  return (
    <div className="bg-white min-h-screen pb-20">
       
       {/* Hero */}
       <div className="relative h-[60vh] min-h-[400px]">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 text-white max-w-4xl mx-auto">
             <div className="flex gap-2 mb-6">
                {post.tags.map(tag => (
                   <span key={tag} className="bg-brand-orange text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{tag}</span>
                ))}
             </div>
             <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">{post.title}</h1>
             <div className="flex items-center gap-6 text-sm md:text-base font-medium">
                <span className="flex items-center gap-2"><User size={18}/> {post.author}</span>
                <span className="w-1 h-1 bg-white rounded-full"></span>
                <span className="flex items-center gap-2"><Calendar size={18}/> {post.date}</span>
             </div>
          </div>
          <Link to="/blog" className="absolute top-6 left-6 bg-white/20 backdrop-blur p-2 rounded-full text-white hover:bg-white/30 transition-colors">
             <ChevronLeft size={24}/>
          </Link>
       </div>

       <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
             
             {/* Content */}
             <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed mb-12">
                <p className="lead text-xl text-gray-500 italic mb-8 border-l-4 border-brand-blue pl-4">
                   {post.excerpt}
                </p>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
             </div>

             {/* Image Gallery */}
             {post.gallery && post.gallery.length > 0 && (
                <div className="mb-12">
                   <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><ImageIcon size={24} className="text-brand-blue"/> Photo Gallery</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {post.gallery.map((img, idx) => (
                         <div key={idx} className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"/>
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {/* FAQ Section */}
             {post.faq && post.faq.length > 0 && (
                <div className="mb-12 bg-gray-50 p-8 rounded-2xl border border-gray-100">
                   <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><HelpCircle size={24} className="text-brand-orange"/> Frequently Asked Questions</h3>
                   <div className="space-y-4">
                      {post.faq.map((item, idx) => (
                         <details key={idx} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <summary className="flex justify-between items-center p-4 cursor-pointer font-bold text-gray-800 list-none">
                               {item.question}
                               <span className="transition-transform group-open:rotate-180">
                                  <ChevronDown size={20} className="text-gray-400"/>
                               </span>
                            </summary>
                            <div className="p-4 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                               {item.answer}
                            </div>
                         </details>
                      ))}
                   </div>
                </div>
             )}

             {/* Tags & Share */}
             <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2 flex-wrap">
                   <Tag size={18} className="text-gray-400"/>
                   {post.tags.map(tag => (
                      <span key={tag} className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">#{tag}</span>
                   ))}
                </div>
                <div className="flex items-center gap-4">
                   <span className="text-sm font-bold text-gray-400 uppercase">Share Article</span>
                   <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"><Facebook size={18}/></a>
                   <a href={`https://twitter.com/intent/tweet?text=${post.title}&url=${shareUrl}`} target="_blank" rel="noreferrer" className="p-2 bg-sky-50 text-sky-500 rounded-full hover:bg-sky-100 transition-colors"><Twitter size={18}/></a>
                   <button onClick={() => navigator.clipboard.writeText(shareUrl)} className="p-2 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors"><LinkIcon size={18}/></button>
                </div>
             </div>

          </div>
          
          {/* Author Box */}
          <div className="mt-8 bg-gray-50 rounded-2xl p-8 flex items-center gap-6 border border-gray-200">
             <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {post.author.charAt(0)}
             </div>
             <div>
                <h3 className="font-bold text-gray-900 text-lg">Written by {post.author}</h3>
                <p className="text-gray-500 text-sm mt-1">Travel enthusiast and expert guide at HolidayPot. Bringing you the best stories from around the globe.</p>
             </div>
          </div>

       </div>
    </div>
  );
};

export default BlogDetail;
