import Welcome from "../components/landing/Welcome";
import MockCalender from "../components/landing/MockCalender";

export default function Landing() {
    return (
        <div className="flex flex-col md:flex-row h-full w-full justify-center items-center gap-0 md:gap-12 lg:gap-20 p-2 sm:p-4 md:p-6 lg:p-8">
            <Welcome />
            <MockCalender />
        </div>
    );
}