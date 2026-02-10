import Link from 'next/link';
import Image from 'next/image';
import { Download } from 'lucide-react';
import { BlogPost } from '@/lib/blog';

interface RelatedAppsProps {
  apps: NonNullable<BlogPost['relatedApps']>;
}

export default function RelatedApps({ apps }: RelatedAppsProps) {
  if (!apps || apps.length === 0) return null;

  return (
    <section className="py-8 px-4 border-t border-white/10 bg-white/[0.02]">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary-500 rounded-full" />
          Related Apps
        </h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {apps.map((app) => (
            <Link 
              key={`${app.name}-${app.platform}`}
              href={app.url}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/30 hover:bg-white/[0.08] transition-all duration-300 group"
            >
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-black/20 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={app.icon}
                  alt={app.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate group-hover:text-primary-300 transition-colors">
                  {app.name}
                </h4>
                <p className="text-xs text-white/50 capitalize">
                  {app.platform} App
                </p>
              </div>
              
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-500/10 text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                <Download className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
