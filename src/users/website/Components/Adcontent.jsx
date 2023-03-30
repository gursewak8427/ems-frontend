import React, { Component } from "react";
import { Accordion, Icon } from "semantic-ui-react";
import Formaccordian from "./Formaccordian";

export default class AccordionExampleStandard extends Component {
  state = { activeIndex: 0 };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex } = this.state;

    return (
      <Accordion>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
          className="flex items-center pb-0"
        >
          <Icon name="dropdown" />
          <h2 className="px-4 py-4   m-0 w-full">Request Info</h2>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <div className="lg:flex gap-4">
            <div className="w-full px-8">
              <p className="text-black text-2xl">
                We will send you a confirmation email with login, password. So,
                you can apply anywhere in the world. Fill up your application
                according to your requirement.
              </p>
              <button class="bg-red-500 hover:bg-black text-white font-bold py-4 px-6 rounded-full">
                Request Info
              </button>
            </div>
          </div>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={this.handleClick}
          className="flex items-center pb-0"
        >
          <Icon name="dropdown" />
          <h2 className="px-4 py-4   m-0 w-full">Apply</h2>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <div className="w-full px-8">
            <p className="text-black text-2xl">
              We bestow you a guidance from our best experts so that you have
              the best chances of getting your student visa. All you need is to
              relax and keep tracking your application status.
            </p>
            <button class="bg-red-500 hover:bg-black text-white font-bold py-4 px-6 rounded-full">
              Apply Online
            </button>
          </div>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={this.handleClick}
          className="flex items-center pb-0"
        >
          <Icon name="dropdown" />
          <h2 className="px-4 py-4   m-0 w-full">Registration</h2>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <div className="w-full px-8">
            <p className="text-black text-2xl">
              Firstly, complete your profile, pay the application fee and submit
              all necessary documents online. Our specialists are always
              available and you can talk to them anytime.
            </p>
            <button class="bg-red-500 hover:bg-black text-white font-bold py-4 px-6 rounded-full">
              Registration Form
            </button>
          </div>
        </Accordion.Content>
      </Accordion>
    );
  }
}
