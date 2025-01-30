import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import LockedSidebar from "../src/components/sidebar/sidebar";
import React from "react";


const mockUser = {
  uid: "123",
  displayName: "Test User",
  photoURL: "test-url.jpg",
};

describe("LockedSidebar Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  test("renders sidebar with user details", () => {
    render(<LockedSidebar user={mockUser} />);
    
    const userElements = screen.getAllByText("Test User");
    expect(userElements.length).toBeGreaterThan(0);
    expect(userElements[0]).toBeInTheDocument(); 
  });
});

