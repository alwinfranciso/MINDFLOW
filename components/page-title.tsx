import type { ReactNode } from 'react';
import React from 'react';

interface PageTitleProps {
  title: string;
  description?: string | ReactNode;
  actions?: ReactNode;
}

const PageTitle = React.memo(function PageTitle({ title, description, actions }: PageTitleProps) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">{title}</h1>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
      {description && (
        <p className="mt-2 text-base text-foreground/80 max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
});

export default PageTitle;