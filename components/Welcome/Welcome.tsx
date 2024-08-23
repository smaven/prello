import { Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          Prello
        </Text>
      </Title>

      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        Prello is here to help you manage your tasks without the stress.
        <br />
        Create boards, organize your to-dos, and keep track of everything effortlessly.
        <br />
        Whether you&apos;re planning a project or just making sure you don&apos;t forget to feed the
        cat, Prello&apos;s got your back!
      </Text>
    </>
  );
}
