export default function Breadcrumb({ items }) {
    return (
        <nav className="flex items-center w-full py-2 border-b border-muted-foreground/5 px-8 text-sm font-medium text-muted-foreground">
        {items.map((item, index) => (
            <div key={index} className="flex items-center">
                <div className="flex px-3 py-2 hover:bg-muted-foreground/5 rounded-md cursor-pointer transition-all duration-300 ease-in-out">
                    <a href={item.href} className="text-white hover:text-primary">
                        {item.label}
                    </a>
                </div>
            {index < items.length - 1 && (
                <span className="mx-2 text-foreground">/</span>
            )}
            </div>
        ))}
        </nav>
    );
}
