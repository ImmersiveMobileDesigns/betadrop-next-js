import { AlertCircle, Clock, Ban, FileWarning, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface LinkExpiredViewProps {
  type: 'not_found' | 'disabled' | 'expired' | 'link_invalid' | 'link_expired' | 'link_limit' | 'link_deactivated';
  appName?: string;
}

export default function LinkExpiredView({ type, appName }: LinkExpiredViewProps) {
  const getContent = () => {
    switch (type) {
      case 'not_found':
        return {
          icon: FileWarning,
          title: 'Build Not Found',
          description: 'This build seems to have been deleted or does not exist.',
          color: 'text-red-400',
          bg: 'bg-red-500/10'
        };
      case 'disabled':
        return {
          icon: Ban,
          title: 'Build Disabled',
          description: appName 
            ? `The download for ${appName} has been disabled by the owner.`
            : 'This build has been disabled by the owner.',
          color: 'text-orange-400',
          bg: 'bg-orange-500/10'
        };
      case 'expired':
        return {
          icon: Clock,
          title: 'Build Expired',
          description: appName
            ? `The download for ${appName} has expired. Please contact the app owner for a new link.`
            : 'This build has expired. Please contact the app owner for a new link.',
          color: 'text-orange-400',
          bg: 'bg-orange-500/10'
        };
      case 'link_invalid':
        return {
          icon: AlertCircle,
          title: 'Invalid Link',
          description: 'This access link is invalid or incomplete.',
          color: 'text-red-400',
          bg: 'bg-red-500/10'
        };
      case 'link_expired':
        return {
          icon: Clock,
          title: 'Link Expired',
          description: 'This share link has expired and can no longer be used.',
          color: 'text-orange-400',
          bg: 'bg-orange-500/10'
        };
      case 'link_limit':
        return {
          icon: Ban,
          title: 'Limit Reached',
          description: 'This share link has reached its maximum number of uses.',
          color: 'text-orange-400',
          bg: 'bg-orange-500/10'
        };
      case 'link_deactivated':
        return {
          icon: Ban,
          title: 'Link Deactivated',
          description: 'This share link has been deactivated by the owner.',
          color: 'text-red-400',
          bg: 'bg-red-500/10'
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
          <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center ${content.bg}`}>
            <Icon className={`w-10 h-10 ${content.color}`} />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-3">
            {content.title}
          </h1>
          
          <p className="text-white/60 mb-8 leading-relaxed">
            {content.description}
          </p>

          <div className="space-y-4">
            <Link 
              href="/"
              className="flex items-center justify-center w-full px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium transition-all duration-200 group"
            >
              Go to Homepage
              <ArrowRight className="w-4 h-4 ml-2 opacity-60 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/20 text-sm font-medium">
            Powered by BetaDrop
          </p>
        </div>
      </div>
    </div>
  );
}
