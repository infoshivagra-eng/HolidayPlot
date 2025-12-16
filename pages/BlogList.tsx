
import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobal } from '../GlobalContext';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

const BlogList: React.FC = () => {
  const { blogPosts } = useGlobal();
  const publishedPosts = blogPosts.filter(post => post.status === 'Published');

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
           <div className="inline-flex items-center gap-2 bg-blue-50 text-brand-blue px-4 py-1.5 rounded-full font-bold text-sm mb-4">
              <BookOpen size={16}/> Travel Stories
           </div>
           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Inspiration for your next journey</h1>
           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tips, guides, and hidden gems curated by our travel experts.
           </p>
        </div>

        {/* Featured / Hero Post (First one) */}
        {publishedPosts.length > 0 && (
           <div className="mb-16">
              <Link to={`/blog/${publishedPosts[0].slug}`} className="group relative block rounded-3xl overflow-hidden shadow-xl h-[500px]">
                 <img src={publishedPosts[0].image} alt={publishedPosts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                 <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white max-w-3xl">
                    <div className="flex gap-2 mb-4">
                       {publishedPosts[0].tags.map(tag => (
                          <span key={tag} className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase">{tag}</span>
                       ))}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight group-hover:text-brand-orange transition-colors">{publishedPosts[0].title}</h2>
                    <p className="text-gray-300 text-lg mb-6 line-clamp-2">{publishedPosts[0].excerpt}</p>
                    <div className="flex items-center gap-4 text-sm font-medium">
                       <span className="flex items-center gap-2"><User size={16}/> {publishedPosts[0].author}</span>
                       <span className="flex items-center gap-2"><Calendar size={16}/> {publishedPosts[0].date}</span>
                    </div>
                 </div>
              </Link>
           </div>
        )}

        {/* Grid of Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {publishedPosts.slice(1).map(post => (
              <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100 flex flex-col">
                 <div className="h-56 overflow-hidden relative">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                    <div className="absolute top-4 left-4 flex gap-2">
                        {post.tags.slice(0, 2).map(tag => (
                           <span key={tag} className="bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-800">{tag}</span>
                        ))}
                    </div>
                 </div>
                 <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                       <span className="flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
                       <span>•</span>
                       <span className="flex items-center gap-1"><User size={12}/> {post.author}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-blue transition-colors line-clamp-2">
                       <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">{post.excerpt}</p>
                    <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-brand-blue font-bold text-sm hover:gap-3 transition-all">
                       Read Article <ArrowRight size={16}/>
                    </Link>
                 </div>
              </div>
           ))}
        </div>

        {publishedPosts.length === 0 && (
           <div className="text-center py-20 text-gray-500">
              <p>No stories published yet. Check back soon!</p>
           </div>
        )}

      </div>
    </div>
  );
};

export default BlogList;
