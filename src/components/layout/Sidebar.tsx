import {
    HomeIcon,
    Squares2X2Icon,
    Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { HiOutlineBookOpen } from 'react-icons/hi2';

export default function Sidebar() {
    return (
        <div className="w-16 bg-gray-900 text-white flex flex-col items-center py-4 justify-between h-screen fixed left-0 top-0">
            <div className="space-y-6">
                <IconButton icon={<HomeIcon className="w-6 h-6" />} />
                <IconButton icon={<Squares2X2Icon className="w-6 h-6" />} />
                <IconButton icon={<Cog6ToothIcon className="w-6 h-6" />} />
            </div>

            <div className="space-y-6 mb-4">
                <IconButton icon={<FaDiscord className="w-5 h-5" />} />
                <IconButton icon={<FaTwitter className="w-5 h-5" />} />
                <IconButton icon={<HiOutlineBookOpen className="w-5 h-5" />} />
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
                    S
                </div>
            </div>
        </div>
    );
}

function IconButton({ icon }: { icon: React.ReactNode }) {
    return (
        <div className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-700 cursor-pointer transition">
            {icon}
        </div>
    );
}
