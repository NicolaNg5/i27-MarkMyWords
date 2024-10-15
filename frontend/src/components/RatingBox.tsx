
interface RatingBoxProps {
    title: string;
    rating: number;
    color: string;
  }

const RatingBox: React.FC<RatingBoxProps> = ({ title, rating, color }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg ${color} text-white`}>
      <span className="font-semibold">{title}</span>
      <span className="text-2xl font-bold">{rating}</span>
    </div>
);

  export default RatingBox;