"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import axios from "axios";
import { useState } from "react";

export default function AssistantPage() {
  const [query, setQuery] = useState("");

  const sendQuery = async () => {
    console.log("Sending query:", query);
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/assistant/`,
      { query }
    );
  };

  return (
    <>
      <div className="w-screen h-screen bg-background border border-white flex flex-col justify-end p-24 items-center gap-4">
        <div className="w-full">
          <Input
            placeholder="type your query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div>
          <Button variant="primary" onClick={sendQuery}>
            Ask
          </Button>
        </div>
      </div>
    </>
  );
}
