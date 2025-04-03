"use client";

import { useState } from "react";
import {
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Background,
  Column,
} from "@/once-ui/components";

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  }) as T;
}

type ContactProps = {
  title: string | JSX.Element;
  description: string | JSX.Element;
  backgroundEffects: {
    mask: {
      cursor: boolean;
      x: number;
      y: number;
      radius: number;
    };
    gradient: {
      display: boolean;
      x: number;
      y: number;
      width: number;
      height: number;
      tilt: number;
      colorStart: string;
      colorEnd: string;
      opacity: number;
    };
    // Include other effect types with proper number/boolean types
  };
};

export const ContactForm = ({ contact }: { contact: ContactProps }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    name: "",
    message: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    name: false,
    message: false,
  });

  const validateEmail = (email: string): boolean => {
    if (email === "") return true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email" && !validateEmail(value)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const debouncedHandleChange = debounce(handleChange, 500);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === "email" && !validateEmail(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      console.log("Form submitted:", formData);
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <Column
      overflow="hidden"
      position="relative"
      fillWidth
      padding="xl"
      radius="l"
      marginBottom="m"
      horizontal="center"
      align="center"
      background="surface"
      border="neutral-medium"
    >
      <Background
        mask={{
          cursor: contact.backgroundEffects.mask.cursor,
          x: contact.backgroundEffects.mask.x,
          y: contact.backgroundEffects.mask.y,
          radius: contact.backgroundEffects.mask.radius,
        }}
        gradient={{
          display: contact.backgroundEffects.gradient.display,
          x: contact.backgroundEffects.gradient.x,
          y: contact.backgroundEffects.gradient.y,
          width: contact.backgroundEffects.gradient.width,
          height: contact.backgroundEffects.gradient.height,
          tilt: contact.backgroundEffects.gradient.tilt,
          colorStart: contact.backgroundEffects.gradient.colorStart,
          colorEnd: contact.backgroundEffects.gradient.colorEnd,
          opacity: Math.min(
            Math.max(
              Math.round(contact.backgroundEffects.gradient.opacity / 10) * 10,
              0
            ),
            100
          ) as 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100,
        }}
      />

      <Heading
        style={{ position: "relative" }}
        marginBottom="s"
        variant="display-strong-xs"
      >
        {contact.title}
      </Heading>

      <Text
        style={{ position: "relative", maxWidth: "var(--responsive-width-xs)" }}
        wrap="balance"
        marginBottom="l"
        onBackground="neutral-medium"
      >
        {contact.description}
      </Text>

      <form
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
        onSubmit={handleSubmit}
      >
        <Flex direction="column" fillWidth maxWidth={24} gap="m">
          <Input
            id="name"
            labelAsPlaceholder
            name="name"
            type="text"
            label="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur("name")}
            errorMessage={touched.name ? errors.name : ""}
          />

          <Input
            id="email"
            labelAsPlaceholder
            name="email"
            type="email"
            label="Email Address"
            required
            value={formData.email}
            onChange={(e) => {
              if (errors.email) {
                handleChange(e);
              } else {
                debouncedHandleChange(e);
              }
            }}
            onBlur={() => handleBlur("email")}
            errorMessage={touched.email ? errors.email : ""}
          />

          {/* Replace with a proper textarea component if Input doesn't support it */}
          <div style={{ width: "100%" }}>
            <textarea
              name="message"
              placeholder="Your Message"
              required
              value={formData.message}
              onChange={handleChange}
              onBlur={() => handleBlur("message")}
              rows={4}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border:
                  errors.message && touched.message
                    ? "1px solid red"
                    : "1px solid #ccc",
                minHeight: "120px",
              }}
            />
            {touched.message && errors.message && (
              <div
                style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}
              >
                {errors.message}
              </div>
            )}
          </div>

          <Button type="submit" size="m" fillWidth>
            Send Message
          </Button>
        </Flex>
      </form>
    </Column>
  );
};
