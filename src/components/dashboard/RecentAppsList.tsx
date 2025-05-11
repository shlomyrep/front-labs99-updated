interface AppCardProps {
    title: string;
    description: string;
    created: string;
    updated: string;
}

const mockApps: AppCardProps[] = [
    {
        title: 'GoalSync',
        description: 'GoalSync is your personal goal tracking companion...',
        created: '2 days ago',
        updated: '2 days ago',
    },
    {
        title: 'SnakeBattle',
        description: 'Multiplayer snake game where players compete in real-time...',
        created: 'a month ago',
        updated: 'a month ago',
    },
];

export default function RecentAppsList() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockApps.map((app) => (
                <AppCard key={app.title} {...app} />
            ))}
        </div>
    );
}

function AppCard({ title, description, created, updated }: AppCardProps) {
    return (
        <div className="bg-white shadow-md rounded-md p-5 hover:shadow-lg transition-all">
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-sm text-gray-600 mb-3">{description}</p>
            <div className="text-xs text-gray-400">
                <p>created: {created}</p>
                <p>last updated: {updated}</p>
            </div>
        </div>
    );
}
