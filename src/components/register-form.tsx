import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import SubmitButton from "./ui/submit-button";
import { Textarea } from "./ui/textarea";
import Command from "./register-form/command";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const SESSIONS = [
  { label: "❄ Winter", value: "winter" },
  { label: "🌷 Spring", value: "spring" },
  { label: "☀ Summer", value: "summer" },
  { label: "🍂 Fall", value: "fall" },
];

type Props = {};

function RegisterForm({}: Props) {
  return (
    <form className="w-full max-w-sm space-y-8 px-5 py-7 bg-slate-50/80 rounded-lg border border-zinc-300">
      <div className="space-y-2">
        <Label className="">My name is: </Label>
        <Input placeholder="Enter your name" />
      </div>
      <div className="space-y-2">
        <Label className="">About my characteristics: </Label>
        <Textarea
          rows={5}
          wrap="hard"
          className="max-h-32"
          placeholder="I'm a introverse person"
        />
      </div>
      <div className="space-y-2">
        <Label>I want to find:</Label>
        <RadioGroup defaultValue="male" className="flex justify-between">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="make" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unisex" id="unisex" />
            <Label htmlFor="unisex">Unisex</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <Label className="">My name is: </Label>
        <Command items={SESSIONS} />
      </div>
      <div>
        <SubmitButton>Find my smell</SubmitButton>
      </div>
    </form>
  );
}

export default RegisterForm;
