import { Button } from '@mantine/core';
import Link from 'next/link';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="flex grow flex-col px-4">
        <Welcome />
        <div className="mt-10 flex justify-center">
          <Button
            component={Link}
            href="/boards"
            size="lg"
            variant="gradient"
            gradient={{ from: 'primary', to: 'blue' }}
          >
            Get Started 🚀
          </Button>
        </div>
      </section>

      <footer className="just flex justify-end p-4">
        <ColorSchemeToggle />
      </footer>
    </main>
  );
}
