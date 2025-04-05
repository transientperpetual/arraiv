"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import axios from "axios";
import { useState } from "react";

export default function AssistantPage() {
  const [query, setQuery] = useState("");
  const [infModel, setInfModel] = useState("llama3.2");
  const [inference, setInference] = useState("");
  const [convHistory, setConvHistory] = useState<string[]>([]);
  const [recievedAt, setRecievedAt] = useState<any>();
  const [thinking, setThinking] = useState(false);

  const sendQuery = async () => {
    convHistory.push(query);
    console.log("Q _ ", query, "mode", infModel)
    setThinking(true);
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/assistant/`,
      { query, infModel }
    );

    const inference = res.data.Inference;

    convHistory.push(inference);

    setThinking(false);
    setInference(inference);
    setQuery("");
  };

  const setModel = (model: any) => {
    setInfModel(model);
  };

  return (
    <>
      <div className="w-screen h-screen bg-slate-700 flex flex-col justify-end p-24 items-between gap-4">
        <div className="w-full overflow-y-auto p-4">
        {convHistory &&
          convHistory.map((item, index) => (
            <div
            key={index}
            className="border border-black-secondary mt-6 bg-blue-200 p-4 rounded-lg bg-gradient-to-r from-green-300 to-blue-300 text-black"
            >
              {item}
              <p className="text-xs italic text-slate-600 text-right pt-2 " >inference to / from from {infModel}</p>
            </div>
          ))}
          </div>

        {thinking && <div className="text-md">Thinking....</div>}
        <div className="w-full flex flex-row rounded-sm bg-white">
          <Input
            placeholder="type your query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

          <div>

        <Button variant="primary" onClick={sendQuery}>
          <div className="text-sm">Ask ARRAIV</div>
        </Button>
          </div>

        <div className="text-sm text-white-secondary">Choose model :</div>

        <div className="w-full flex flex-row gap-4 justify-end items-end px-12 bg-white-secondary py-4 rounded-lg">
          <Button
            variant={infModel === "mistral" ? "primary" : "secondary"}
            onClick={() => {
              setModel("mistral");
            }}
          >
            MISTRAL
          </Button>

          <Button
            variant={infModel === "llama3.2" ? "primary" : "secondary"}
            onClick={() => {
              setModel("llama3.2");
            }}
          >
            LLAMA
          </Button>

          <Button
           variant={infModel === "deepseek-r1" ? "primary" : "secondary"}
            onClick={() => {
              setModel("deepseek-r1");
            }}
          >
            DeepSeek
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setModel("llama3.2");
            }}
          >
            IBM
          </Button>
        </div>
      </div>
    </>
  );
}
