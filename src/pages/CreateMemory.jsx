import MemoryEditorHeader from "../components/CreateMemory/MemoryEditorHeader";
import MediaGallery from '../components/CreateMemory/MediaGallery'
import MemoryCalendar from "../components/CreateMemory/MemoryCalendar";
import MemoryDetails from "../components/CreateMemory/MemoryDetails";
import VisibilitySelector from "../components/CreateMemory/VisibilitySelector";

export default function CreateMemoryPage() {

    return (

        <div className="fixed inset-0 bg-background-dark/70 backdrop-blur-md flex items-center justify-center p-6">

            <div className="w-full max-w-6xl h-[780px] bg-[#182234] border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">

                <MemoryEditorHeader />

                <div className="flex flex-1 overflow-hidden">

                    {/* LEFT MEDIA */}

                    <MediaGallery />

                    {/* RIGHT PANEL */}

                    <div className="w-96 flex flex-col gap-6 p-6 overflow-y-auto">

                        <MemoryCalendar />

                        <MemoryDetails />

                        <VisibilitySelector />

                    </div>

                </div>

            </div>

        </div>

    );

}