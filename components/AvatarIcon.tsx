import React from 'react';

interface AvatarIconProps {
  name: string;
  size?: number;
}

const AvatarIcon: React.FC<AvatarIconProps> = ({ name, size = 40 }) => {
  // Get initials (first letter of first and last name)
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Generate consistent color based on name hash
  const getBackgroundColor = (fullName: string): string => {
    const colors = [
      '#EF4444', // red
      '#F59E0B', // amber
      '#10B981', // green
      '#3B82F6', // blue
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#14B8A6', // teal
      '#F97316', // orange
      '#06B6D4', // cyan
      '#6366F1', // indigo
    ];
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials(name);
  const backgroundColor = getBackgroundColor(name);

  return (
    <div
      className="flex items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor,
        fontSize: `${size * 0.4}px`,
      }}
    >
      {initials}
    </div>
  );
};

export default AvatarIcon;
