interface HelpLinkProps {
  href: string;
  text: string;
}

export function HelpLink({ href, text }: HelpLinkProps) {
  return (
    <div className="help-link">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="link"
      >
        {text}
      </a>
    </div>
  );
}
