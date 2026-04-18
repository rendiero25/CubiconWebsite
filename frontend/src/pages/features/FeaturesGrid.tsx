import { Wand2, Box, ImageDown, Eraser, Zap, FileImage, History, CreditCard } from 'lucide-react'

const FEATURES = [
  { icon: Wand2,      title: 'AI Generation',     description: 'Generate icons from text in seconds. Powered by Google Gemini.',          color: '#FFF5CC' },
  { icon: Box,        title: '3D Isometric Style', description: 'Consistent, clean 3D isometric look. Production-ready, every time.',      color: '#FFF3E0' },
  { icon: ImageDown,  title: 'Multi Resolution',   description: 'Export at 1K, 2K, or 4K. Perfect for any screen density.',                color: '#F3E8FF' },
  { icon: Eraser,     title: 'Remove Background',  description: 'Auto-transparent PNG background. Drop straight into your design.',        color: '#E8F5E9' },
  { icon: Zap,        title: 'Fast Render',         description: 'Results in seconds, not minutes. Iterate without waiting.',              color: '#FDE8E8' },
  { icon: FileImage,  title: 'PNG Export',          description: 'Universal PNG format. Works in Figma, Sketch, web, and print.',          color: '#E8F0FF' },
  { icon: History,    title: 'Generation History',  description: 'Every icon you generate is saved in your dashboard forever.',            color: '#FFF8E1' },
  { icon: CreditCard, title: 'Credit System',       description: 'Pay only for what you use. No subscriptions, no expiry traps.',         color: '#F0FFF4' },
]

export default function FeaturesGrid() {
  return (
    <section className="h-full bg-near-black overflow-y-auto flex items-center py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 w-full">
        <div className="text-center mb-10">
          <h2 className="font-display font-semibold text-2xl md:text-3xl text-off-white">
            Packed with everything you need
          </h2>
          <p className="font-body text-base text-off-white/50 mt-2">
            No plugins, no extra tools. It's all here.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="border-2 border-white/10 rounded-md p-5 bg-off-white/5 hover:bg-off-white/10 hover:border-white/20 transition-all flex flex-col gap-3"
            >
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: color }}
              >
                <Icon size={18} className="text-near-black" />
              </div>
              <div>
                <p className="font-display font-semibold text-sm text-off-white">{title}</p>
                <p className="font-body text-xs text-off-white/50 mt-1 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
