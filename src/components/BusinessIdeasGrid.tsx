import { motion } from 'framer-motion';
import { Idea } from '@/types/app';

type Props = {
  ideas: Idea[];
  onIdeaClick: (idea: Idea) => void;
  selectedId: string | null;
};

export default function BusinessIdeasGrid({ ideas, onIdeaClick, selectedId }: Props) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 
                 p-2 sm:p-4 max-w-5xl mx-auto scale-95 sm:scale-100"
    >
      {ideas.map((idea) => (
        <motion.div
          key={idea.id}
          variants={item}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onIdeaClick(idea)}
          className={`
            relative overflow-hidden rounded-xl p-4 sm:p-6 cursor-pointer
            ${selectedId === idea.id 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl' 
              : 'bg-white dark:bg-gray-800 hover:shadow-xl'}
            transition-all duration-300 ease-out
          `}
        >
          <motion.h3 
            className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 ${
              selectedId === idea.id 
                ? 'text-white' 
                : 'text-gray-900 dark:text-white'
            }`}
            layoutId={`title-${idea.id}`}
          >
            {idea.title}
          </motion.h3>
          <motion.div 
            className={`text-sm ${
              selectedId === idea.id 
                ? 'text-white/90' 
                : 'text-gray-600 dark:text-gray-300'
            }`}
            layoutId={`category-${idea.id}`}
          >
            {idea.category}
          </motion.div>
          <div className="absolute bottom-0 right-0 w-20 h-20 opacity-10">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <path
                d="M 100 100 L 300 100 L 200 300 z"
                fill="currentColor"
                className="animate-pulse"
              />
            </svg>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
} 