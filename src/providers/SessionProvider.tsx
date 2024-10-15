'use client';

import {FC, ReactNode} from 'react';
import PropTypes from 'prop-types';
import {SessionProvider as NextAuthProvider} from 'next-auth/react';

interface SessionProviderProps {
  children: ReactNode;
}

const SessionProvider: FC<SessionProviderProps> = ({
  children
}) => {
  return (
    <NextAuthProvider>
      {children}
    </NextAuthProvider>
  );
};

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default SessionProvider;
