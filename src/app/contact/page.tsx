import { Column, Heading, Text } from "@/once-ui/components";

export default function Contact() {
  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Heading variant="display-strong-l">Contact Me</Heading>
      <Text variant="body-default-m" onBackground="neutral-weak">
        Feel free to reach out using the form below.
      </Text>
      {/* <ContactForm contact={{ title: "Get in Touch", description: "Send me a message!" }} /> */}
    </Column>
  );
} 