export default function Avatar({ username, avatarUrl, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-xl',
    lg: 'w-24 h-24 text-3xl',
    xl: 'w-32 h-32 text-4xl',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const getColorFromName = (name) => {
    if (!name) return 'bg-gray-500';
    
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-green-500',
      'bg-emerald-500',
      'bg-teal-500',
      'bg-cyan-500',
      'bg-sky-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-violet-500',
      'bg-purple-500',
      'bg-fuchsia-500',
      'bg-pink-500',
      'bg-rose-500',
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (avatarUrl) {
    return (
      <div className="relative">
        <img
          src={avatarUrl}
          alt={username}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-md`}
          onError={(e) => {
            e.target.style.display = 'none';
            if (e.target.nextSibling) {
              e.target.nextSibling.style.display = 'flex';
            }
          }}
        />
        <div
          className={`${sizeClasses[size]} ${getColorFromName(username)} rounded-full hidden items-center justify-center text-white font-bold shadow-md border-2 border-white`}
        >
          {getInitials(username)}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${getColorFromName(username)} rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white`}
    >
      {getInitials(username)}
    </div>
  );
}
