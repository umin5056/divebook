export default function AuthFooterLink({ text, linkText, onClick }) {
  return (
    <div className="text-center">
      {text && `${text} `}
      <span className="text-[#008080] font-bold cursor-pointer" onClick={onClick}>
        {linkText}
      </span>
    </div>
  );
}
