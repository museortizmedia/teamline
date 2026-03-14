import MemoryEditorHeader from "../components/CreateMemory/MemoryEditorHeader";
import MediaGallery from "../components/CreateMemory/MediaGallery";
import MemoryCalendar from "../components/CreateMemory/MemoryCalendar";
import MemoryDetails from "../components/CreateMemory/MemoryDetails";
import VisibilitySelector from "../components/CreateMemory/VisibilitySelector";

export default function CreateMemoryPage({ isOpen, onClose }) {

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 z-50 bg-background-dark/70 backdrop-blur-md flex items-center justify-center p-0 md:p-6">

            <div className="w-full h-full md:h-[90vh] md:max-w-6xl bg-[#182234] border border-slate-800 md:rounded-xl shadow-2xl flex flex-col overflow-hidden">

                <MemoryEditorHeader onClose={onClose} />

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

                    <MediaGallery />

                    <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col gap-6 p-5 overflow-y-auto">

                        <MemoryCalendar />
                        <MemoryDetails />
                        <VisibilitySelector />

                    </div>

                </div>

            </div>

        </div>

    );

}