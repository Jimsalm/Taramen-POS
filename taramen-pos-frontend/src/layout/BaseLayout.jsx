export default function BaseLayout({ children, className }) {
    return (
        <main className={`flex items-start justify-start w-full min-h-screen p-4 bg-background ${className}`}>{children}</main>

    );

}