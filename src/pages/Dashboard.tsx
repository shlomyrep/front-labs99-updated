import Sidebar from '../components/layout/Sidebar';
import PromptBox from '../components/dashboard/PromptBox';
import RecentAppsList from '../components/dashboard/RecentAppsList';

export default function Dashboard() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="ml-16 p-8 w-full">
                <PromptBox />
                <h2 className="text-lg font-semibold mb-4">My Recent Apps</h2>
                <RecentAppsList />
            </main>
        </div>
    );
}
