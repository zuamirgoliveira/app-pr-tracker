interface HelpLinkProps {
  href: string;
  text: string;
}

export function HelpLink({ href, text }: HelpLinkProps) {
  return (
    <div className="mt-2">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline text-sm transition-colors duration-300 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        {text}
      </a>
    </div>
  );
}