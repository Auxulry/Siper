import {FC} from 'react';
import {PaperDeclaration} from '@/types/components/paper';

export const Paper: FC<PaperDeclaration.PaperProps> = ({
  className,
  children,
  ...rest
}) => {
  const classes = className ? `shadow-lg border-md ${className}` : 'shadow-lg border-md';

  return (
    <div
      className={classes}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Paper;
