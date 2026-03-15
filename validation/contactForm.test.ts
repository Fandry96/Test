import { describe, it, expect } from "vitest";
import { contactFormSchema } from "../../lib/validation/contact";

describe("contactFormSchema", () => {
  it("should accept valid data", () => {
    const validData = {
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      message: "Hello, this is a valid message.",
    };

    const result = contactFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject data with a short name", () => {
    const invalidData = {
      name: "J",
      email: "john@example.com",
      message: "Hello, this is a valid message.",
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name must be at least 2 characters.");
    }
  });

  it("should reject data with an invalid email", () => {
    const invalidData = {
      name: "John Doe",
      email: "invalid-email",
      message: "Hello, this is a valid message.",
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Please enter a valid email address.");
    }
  });

  it("should reject data with a short message", () => {
    const invalidData = {
      name: "John Doe",
      email: "john@example.com",
      message: "Short",
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Message must be at least 10 characters.");
    }
  });
});
