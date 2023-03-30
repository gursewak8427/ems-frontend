import React from "react";
import { Accordion, AccordionItem } from "@szhsin/react-accordion";

export default function Faq() {
  return (
    <div className="py-10 terms">
      <Accordion>
        <AccordionItem header="What do you do with my personal information?">
          We will share your information only with those programs from which you
          have requested information. Learn Global may contact you via email or
          additional methods to inform you about other programs or
          opportunities. For additional information read our full privacy
          policy. You should read and understand our this policy before
          submitting any personal information to us.
        </AccordionItem>

        <AccordionItem header="Why Should I Study Abroad?">
          Everyone has dissimilar experiences and reasons for studying overcome.
          Some students will study abroad to find a new career path or to look
          good in job interviews, while other might want to grow interpersonal
          skills.
        </AccordionItem>

        <AccordionItem header="How do I get started?">
          So you think you want to study overcome, great! Getting start may look
          like a big process. Don't worry we're here to help you. Let's start
          with these steps.
          <ul>
            <li>Decide if study overcome is right for you</li>
            <li>Decide when and where to study abroad</li>
            <li>Find study abroad programs</li>
            <li>Talk to your advisors and parents</li>
            <li>Line up financial resources</li>
          </ul>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
