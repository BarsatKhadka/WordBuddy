import { motion } from 'framer-motion';

const AchievementBadges = () => {
  return (
<div className="flex justify-center gap-8 mt-16">
{['🏆', '🌟', '🎨', '🎯'].map((emoji, i) => (

<motion.div

key={i}
className="bg-white/30 p-4 rounded-full backdrop-blur-sm"
animate={{ y: [0, -10, 0] }}
transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
>

<span className="text-4xl">{emoji}</span>
</motion.div>
))}

</div>

  );
};

export default AchievementBadges; 