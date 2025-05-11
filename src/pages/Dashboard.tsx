import Sidebar from '../components/layout/Sidebar';
import PromptBox from '../components/dashboard/PromptBox';
import RecentAppsList from '../components/dashboard/RecentAppsList';

export default function Dashboard() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="ml-16 p-8 w-full">
                <PromptBox />
                <RecentAppsList count={8} />
            </main>
        </div>
    );
}
