import {
    HomeIcon,
    Squares2X2Icon,
    Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { HiOutlineBookOpen } from 'react-icons/hi2';
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation

// Define navigation items with their paths
const mainNavigation = [
    { name: 'Home', href: '/', icon: HomeIcon, current: false }, // current will be set dynamically
    { name: 'Dashboard', href: '/dashboard', icon: Squares2X2Icon, current: false },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, current: false },
];

// Define social/utility links (can be external or internal)
const utilityLinks = [
    { name: 'Discord', href: '#', icon: FaDiscord, external: true }, // Example external link
    { name: 'Twitter', href: '#', icon: FaTwitter, external: true }, // Example external link
    { name: 'Docs', href: '/docs', icon: HiOutlineBookOpen, external: false }, // Example internal link
];

export default function Sidebar() {
    const location = useLocation(); // Get current location object

    return (
        <div className="w-16 bg-gray-900 text-white flex flex-col items-center py-4 justify-between h-screen fixed left-0 top-0">
            <div className="space-y-6">
                {mainNavigation.map((item) => (
                    <IconButton
                        key={item.name}
                        icon={<item.icon className="w-6 h-6" aria-hidden="true" />}
                        href={item.href}
                        label={item.name} // For accessibility and tooltips
                        isActive={location.pathname === item.href} // Check if current path matches item's href
                    />
                ))}
            </div>

            <div className="space-y-6 mb-4">
                {utilityLinks.map((item) => (
                    <IconButton
                        key={item.name}
                        icon={<item.icon className="w-5 h-5" aria-hidden="true" />}
                        href={item.href}
                        label={item.name}
                        isExternal={item.external}
                        // No isActive needed here unless they are also part of main navigation
                    />
                ))}
                <div
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="User Profile" // Tooltip for accessibility
                >
                    S
                </div>
            </div>
        </div>
    );
}

// Modified IconButton to handle active state and navigation
function IconButton({
                        icon,
                        href,
                        label,
                        isActive,
                        isExternal = false, // New prop for external links
                    }: {
    icon: React.ReactNode;
    href: string;
    label: string;
    isActive?: boolean; // Make isActive optional
    isExternal?: boolean;
}) {
    const baseClasses =
        'w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition';
    const activeClasses = isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-400 hover:text-white'; // Active has a distinct background

    const content = (
        <div className={`${baseClasses} ${activeClasses}`} title={label}>
            {icon}
            <span className="sr-only">{label}</span> {/* For screen readers */}
        </div>
    );

    if (isExternal) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer">
                {content}
            </a>
        );
    }

    // Use Link for internal navigation
    return <Link to={href}>{content}</Link>;
}