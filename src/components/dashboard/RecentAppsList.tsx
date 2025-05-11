import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from '../../api/axios'; // Assuming this path is correct
import { CubeIcon } from '@heroicons/react/24/outline';

interface AppSummary {
    id: string;
    name: string;
    createdAt: string;
    // icon?: string;
}

interface AppCardProps {
    id: string;
    name: string;
    createdAt: string;
    onClick: (id: string) => void;
    // icon?: string;
}

interface RecentAppsListProps {
    count?: number;
}


export default function RecentAppsList({ count = 5 }: RecentAppsListProps) {
    const [apps, setApps] = useState<AppSummary[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        Axios.get('/apps')
            .then((res) => {
                const appData: AppSummary[] = res.data;
                setApps(appData.slice(0, count));
            })
            .catch((err) => {
                console.error('Failed to fetch recent apps:', err);
                setApps([]);
            });
    }, [count]);

    const openApp = (id: string) => {
        navigate(`/app/${id}`);
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 ">
            <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800">
                My Recent Apps
            </h2>
            {apps.length > 0 ? (
                // ADDED WRAPPER: Flex container to center the grid block
                <div className="flex justify-center">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
                                    gap-2 sm:gap-3
                                    justify-items-center
                                    {/* 'justify-center' on the grid itself is less critical if the wrapper is centering it */}
                                   ">
                        {apps.map((app) => (
                            <AppCard
                                key={app.id}
                                id={app.id}
                                name={app.name}
                                createdAt={app.createdAt}
                                onClick={openApp}
                                // icon={app.icon}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-gray-600 mt-4 text-center">
                    {count === 0 ? "No apps will be displayed based on current settings." : "No recent apps found."}
                </p>
            )}
        </div>
    );
}

// AppCard component (same as your last version)
function AppCard({ id, name, createdAt, onClick }: AppCardProps) {
    const formattedDate = new Date(createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <div
            className="bg-white shadow-md rounded-lg p-4
                       w-32 h-36 sm:w-36 sm:h-40
                       flex flex-col justify-between items-center text-center
                       hover:shadow-xl transition-shadow duration-200 cursor-pointer overflow-hidden
                       border border-gray-200
                       "
            onClick={() => onClick(id)}
            title={name}
        >
            <div className="flex flex-col items-center justify-center flex-grow pt-2">
                <CubeIcon className="w-10 h-10 text-indigo-500 mb-2" />
                <h3
                    className="text-sm font-semibold text-gray-700 leading-tight px-1
                               break-words"
                >
                    {name}
                </h3>
            </div>
            <p className="text-xs text-gray-500 mt-2 self-end w-full">
                {formattedDate}
            </p>
        </div>
    );
}