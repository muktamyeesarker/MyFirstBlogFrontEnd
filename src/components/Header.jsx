import { Fragment, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';

import { Container } from '@/components/Container';
import LoginLogoutLink from '@/components/LoginLogoutLink';
import CreatePostForm from './CreatePostForm';
import avatarImage from '@/images/avatar.jpg';

// Icons
const CloseIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronDownIcon = (props) => (
  <svg viewBox="0 0 8 6" aria-hidden="true" {...props}>
    <path
      d="M1.75 1.75 4 4.25l2.25-2.5"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Mobile Navigation Item
const MobileNavItem = ({ href, children }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <li>
      <Popover.Button
        as={Link}
        href={href}
        onClick={(e) => isActive && e.preventDefault()}
        className="block py-2"
      >
        {children}
      </Popover.Button>
    </li>
  );
};

// Mobile Navigation
const MobileNavigation = (props) => (
  <Popover {...props}>
    <Popover.Button className="group flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur">
      Menu
      <ChevronDownIcon className="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700" />
    </Popover.Button>
    <Transition.Root>
      <Transition.Child
        as={Fragment}
        enter="duration-150 ease-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="duration-150 ease-in"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Popover.Overlay className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-sm" />
      </Transition.Child>
      <Transition.Child
        as={Fragment}
        enter="duration-150 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-150 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5"
        >
          <div className="flex flex-row-reverse items-center justify-between">
            <Popover.Button aria-label="Close menu" className="-m-1 p-1">
              <CloseIcon className="h-6 w-6 text-zinc-500" />
            </Popover.Button>
            <h2 className="text-sm font-medium text-zinc-600">Navigation</h2>
          </div>
          <nav className="mt-6">
            <ul className="-my-2 divide-y divide-zinc-100 text-base text-zinc-800">
              <MobileNavItem href="/about">About</MobileNavItem>
              <MobileNavItem href="/posts">Posts</MobileNavItem>
              <MobileNavItem href="/projects">Projects</MobileNavItem>
              <MobileNavItem href="/speaking">Speaking</MobileNavItem>
              <MobileNavItem href="/uses">Uses</MobileNavItem>
              <Popover.Button as = {Link } href="/posts/new">New Post</Popover.Button>
              <LoginLogoutLink />
            </ul>
          </nav>
        </Popover.Panel>
      </Transition.Child>
    </Transition.Root>
  </Popover>
);

// Desktop Navigation Item
const NavItem = ({ href, children }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <li>
      <Link
        href={href}
        onClick={(e) => isActive && e.preventDefault()}
        className={clsx(
          'relative block px-3 py-2 transition',
          isActive ? 'text-teal-500' : 'hover:text-teal-500'
        )}
      >
        {children}
        {isActive && (
          <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0" />
        )}
      </Link>
    </li>
  );
};

// Desktop Navigation
const DesktopNavigation = (props) => (
  <nav {...props}>
    <ul className="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur">
      <NavItem href="/about">About</NavItem>
      <NavItem href="/posts">Posts</NavItem>
      <NavItem href="/projects">Projects</NavItem>
      <NavItem href="/speaking">Speaking</NavItem>
      <NavItem href="/uses">Uses</NavItem>
      <NavItem href="/posts/new">New Post</NavItem>
      <LoginLogoutLink />
    </ul>
  </nav>
);

// Avatar Container
const AvatarContainer = ({ className, ...props }) => (
  <div
    className={clsx(
      className,
      'h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur'
    )}
    {...props}
  />
);

// Avatar
const Avatar = ({ large = false, className, ...props }) => (
  <Link
    href="/"
    aria-label="Home"
    className={clsx(className, 'pointer-events-auto')}
    {...props}
  >
    <Image
      src={avatarImage}
      alt="Avatar"
      sizes={large ? '4rem' : '2.25rem'}
      className={clsx(
        'rounded-full bg-zinc-100 object-cover',
        large ? 'h-16 w-16' : 'h-9 w-9'
      )}
      priority
    />
  </Link>
);

// Utility function for clamping values
const clamp = (number, min, max) => Math.min(Math.max(number, min), max);

// Header Component
export function Header() {
  const isHomePage = useRouter().pathname === '/';
  const headerRef = useRef();
  const avatarRef = useRef();
  const isInitial = useRef(true);

  useEffect(() => {
    const downDelay = avatarRef.current?.offsetTop ?? 0;
    const upDelay = 64;

    const setProperty = (property, value) => {
      document.documentElement.style.setProperty(property, value);
    };

    const removeProperty = (property) => {
      document.documentElement.style.removeProperty(property);
    };

    const updateHeaderStyles = () => {
      const { top, height } = headerRef.current.getBoundingClientRect();
      const scrollY = clamp(window.scrollY, 0, document.body.scrollHeight - window.innerHeight);

      if (isInitial.current) {
        setProperty('--header-position', 'sticky');
      }

      setProperty('--content-offset', `${downDelay}px`);

      if (isInitial.current || scrollY < downDelay) {
        setProperty('--header-height', `${downDelay + height}px`);
        setProperty('--header-mb', `${-downDelay}px`);
      } else if (top + height < -upDelay) {
        const offset = Math.max(height, scrollY - upDelay);
        setProperty('--header-height', `${offset}px`);
        setProperty('--header-mb', `${height - offset}px`);
      } else if (top === 0) {
        setProperty('--header-height', `${scrollY + height}px`);
        setProperty('--header-mb', `${-scrollY}px`);
      }

      if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
        setProperty('--header-inner-position', 'fixed');
        removeProperty('--header-top');
        removeProperty('--avatar-top');
      } else {
        removeProperty('--header-inner-position');
        setProperty('--header-top', '0px');
        setProperty('--avatar-top', '0px');
      }
    };

    const updateAvatarStyles = () => {
      if (!isHomePage) return;

      const fromScale = 1;
      const toScale = 36 / 64;
      const fromX = 0;
      const toX = 2 / 16;

      const scrollY = downDelay - window.scrollY;
      let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale;
      scale = clamp(scale, fromScale, toScale);

      let x = (scrollY * (fromX - toX)) / downDelay + toX;
      x = clamp(x, fromX, toX);

      setProperty(
        '--avatar-image-transform',
        `translate3d(${x}rem, 0, 0) scale(${scale})`
      );

      const borderScale = 1 / (toScale / scale);
      const borderX = (-toX + x) * borderScale;
      const borderTransform = `translate3d(${borderX}rem, 0, 0) scale(${borderScale})`;

      setProperty('--avatar-border-transform', borderTransform);
      setProperty('--avatar-border-opacity', scale === toScale ? 1 : 0);
    };

    const updateStyles = () => {
      updateHeaderStyles();
      updateAvatarStyles();
      isInitial.current = false;
    };

    updateStyles();
    window.addEventListener('scroll', updateStyles, { passive: true });
    window.addEventListener('resize', updateStyles);

    return () => {
      window.removeEventListener('scroll', updateStyles, { passive: true });
      window.removeEventListener('resize', updateStyles);
    };
  }, [isHomePage]);

  return (
    <>
      <header
        className="pointer-events-none relative z-50 flex flex-col"
        style={{
          height: 'var(--header-height)',
          marginBottom: 'var(--header-mb)',
        }}
      >
        {isHomePage && (
          <>
            <div
              ref={avatarRef}
              className="order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]"
            />
            <Container
              className="top-0 order-last -mb-3 pt-3"
              style={{ position: 'var(--header-position)' }}
            >
              <div
                className="top-[var(--avatar-top,theme(spacing.3))] w-full"
                style={{ position: 'var(--header-inner-position)' }}
              >
                <div className="relative">
                  <AvatarContainer
                    className="absolute left-0 top-3 origin-left transition-opacity"
                    style={{
                      opacity: 'var(--avatar-border-opacity, 0)',
                      transform: 'var(--avatar-border-transform)',
                    }}
                  />
                  <Avatar
                    large
                    className="block h-16 w-16 origin-left"
                    style={{ transform: 'var(--avatar-image-transform)' }}
                  />
                </div>
              </div>
            </Container>
          </>
        )}
        <div
          ref={headerRef}
          className="top-0 z-10 h-16 pt-6"
          style={{ position: 'var(--header-position)' }}
        >
          <Container
            className="top-[var(--header-top,theme(spacing.6))] w-full"
            style={{ position: 'var(--header-inner-position)' }}
          >
            <div className="relative flex gap-4">
              <div className="flex flex-1">
                {!isHomePage && (
                  <AvatarContainer>
                    <Avatar />
                  </AvatarContainer>
                )}
              </div>
              <div className="flex flex-1 justify-end md:justify-center">
                <MobileNavigation className="pointer-events-auto md:hidden" />
                <DesktopNavigation className="pointer-events-auto hidden md:block" />
              </div>
              <div className="flex justify-end md:flex-1"></div>
            </div>
          </Container>
        </div>
      </header>

      {/* Insert the CreatePostForm component here */}
      {isHomePage && <CreatePostForm />}

      {isHomePage && <div style={{ height: 'var(--content-offset)' }} />}
    </>
  );
}
