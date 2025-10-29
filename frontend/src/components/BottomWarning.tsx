import { Link } from "react-router-dom";

export const BottomWarning = ({ label, link, to }: { label: string, link: string, to: string}) => {
    return (
        <div className="py-2 text-sm flex justify-center">
            <div>
                {label}
            </div>
            <Link to={to} className="pointer underline pl-1">
            {link}
            </Link>
        </div>
    );
}