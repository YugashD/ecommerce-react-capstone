interface MessageProps {
  type: 'success' | 'error' | 'info';
  text: string;
  onClose: () => void;
}

const Message = ({ type, text, onClose }: MessageProps) => {
  const typeClass =
    type === 'success'
      ? 'bg-green-100 text-green-800 border border-green-300'
      : type === 'error'
        ? 'bg-red-100 text-red-800 border border-red-300'
        : 'bg-gray-100 text-gray-800 border border-gray-300';

  return (
    <div className={`flex justify-between items-center px-4 py-3 rounded-md mb-4 ${typeClass}`}>
      <span>{text}</span>
      <button onClick={onClose} className="ml-4 text-lg cursor-pointer bg-transparent border-none leading-none">✕</button>
    </div>
  );
};

export default Message;
