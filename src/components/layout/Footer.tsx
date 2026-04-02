import Link from 'next/link';
import { Github, Linkedin, Twitter, Globe, Trophy } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-900 border border-zinc-800 shadow-sm">
              <Trophy className="h-4 w-4 text-zinc-400" />
            </div>
            <span className="font-display text-sm font-bold tracking-widest text-zinc-100">O11CE</span>
          </div>
          
          <div className="flex items-center gap-5">
            <Link 
              href="https://github.com/romulopalacios" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link 
              href="https://x.com/romulovskii" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-500 hover:text-blue-400 transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link 
              href="https://www.linkedin.com/in/romulo-palacios-dev/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-500 hover:text-blue-500 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link 
              href="https://romuloportfolio.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-500 hover:text-emerald-400 transition-colors"
            >
              <Globe className="h-5 w-5" />
              <span className="sr-only">Sitio Web Personal</span>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-zinc-900 pt-8 sm:flex-row text-[11px] sm:text-xs text-zinc-500">
          <p>
            Desarrollado arte dev para hacer seguimiento al Mundial.
          </p>
          <p>
            &copy; {new Date().getFullYear()} Creado por Rómulo Palacios.
          </p>
        </div>
      </div>
    </footer>
  );
}