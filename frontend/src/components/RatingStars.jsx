import { useState } from 'react';

export default function RatingStars({ rating = 0, size = 'md', interactive = false, onChange }) {
  const [hovered, setHovered] = useState(0);

  const sizes = { sm: '1rem', md: '1.4rem', lg: '2rem', xl: '2.5rem' };
  const fontSize = sizes[size] || sizes.md;

  const display = interactive && hovered ? hovered : rating;

  return (
    <div
      className={`stars ${interactive ? 'interactive' : ''}`}
      style={{ fontSize }}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={`Rating: ${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map(i => {
        const filled = i <= Math.floor(display);
        const half = !filled && i - 0.5 <= display;
        return (
          <span
            key={i}
            className={`star ${filled ? 'filled' : half ? 'half' : ''} ${hovered >= i && interactive ? 'hovered' : ''}`}
            onClick={interactive ? () => onChange?.(i) : undefined}
            onMouseEnter={interactive ? () => setHovered(i) : undefined}
            onMouseLeave={interactive ? () => setHovered(0) : undefined}
            role={interactive ? 'radio' : undefined}
            aria-checked={interactive ? i === rating : undefined}
            style={{ cursor: interactive ? 'pointer' : 'default', lineHeight: 1 }}
          >
            {filled || (interactive && hovered >= i) ? '★' : half ? '⯨' : '☆'}
          </span>
        );
      })}
    </div>
  );
}
