interface AnalysisBoxProps {
    title: string;
    content: string;
  }

const AnalysisBox: React.FC<AnalysisBoxProps> = ({ title, content }) => (
    <div className="bg-gray-100 rounded-lg p-3">
      <h3 className="font-semibold mb-2 flex items-center">
        {title}
      </h3>
      <p>{content}</p>
    </div>
);

  export default AnalysisBox;
