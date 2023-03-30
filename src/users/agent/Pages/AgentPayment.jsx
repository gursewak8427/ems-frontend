import axios from "axios";
import { useCallback } from "react";
import useRazorpay from "react-razorpay";
import ButtonPrimary from "../../../common/Buttons/ButtonPrimary";
import { getToken } from "../../../helper/auth";

export default function AgentPayment({ enrollId, index, state, setState }) {
    const Razorpay = useRazorpay();


    const payNow = (enrollId, index, res) => {
        let { razorpay_payment_id } = res;

        // validation
        let selectedIntake = document.getElementById("selectedIntake_" + index).value
        if (selectedIntake == "") {
            alert("please select an intake")
            return;
        }

        // intakes
        let intakesArr = selectedIntake.split("-")
        let intakeData = {
            year: intakesArr[0],
            month: parseInt(intakesArr[1]) + 1,
        }

        // set loading button active
        document.getElementsByClassName(`payBtn_${index}`)[0].classList.add("active")

        let body = {
            fileId: enrollId,
            status: "IN_PROCESSING",
            intake: intakeData,
            razorpay_payment_id: razorpay_payment_id,
        }

        // handlePayment API
        axios.post(process.env.REACT_APP_NODE_URL + "/student/handlePayment", body, {
            headers: {
                Authorization: `Bearer ${getToken("agent")}`
            }
        }).then((res) => {
            console.log({paymentResponse: res});
            document.getElementsByClassName(`payBtn_${index}`)[0].classList.remove("active")
            alert("Payment Successful")

            let oldEnrolledPrograms = state.enrolledPrograms;
            oldEnrolledPrograms[index].enroll_status = "IN_PROCESSING"
            oldEnrolledPrograms[index].intake = {
                year: parseInt(intakeData.year),
                month: parseInt(intakeData.month),
            }
            oldEnrolledPrograms[index].fees_status = "PAID"
            setState({
                ...state,
                enrolledPrograms: oldEnrolledPrograms,
            })

        }).catch((err) => {
            console.log(err);
            document.getElementsByClassName(`payBtn_${index}`)[0].classList.remove("active")
            alert("Payment Failed")
        });


    }

    const createOrder = async (data) => {
        // api
        const config = {
            headers: {
                Authorization: `Bearer ${getToken("agent")}`
            }
        };

        let response = await axios.post(process.env.REACT_APP_NODE_URL + "/student/createOrder", data, config)
        return response.data;
    }

    const handlePayment = useCallback(async () => {
        // validation
        let selectedIntake = document.getElementById("selectedIntake_" + index).value
        if (selectedIntake == "") {
            alert("please select an intake")
            return;
        }

        const order = await createOrder({ enrollId });
        console.log({ order })
        let { userDetails } = order;

        const options = {
            key: "rzp_test_jMGvOqaZ2bLIC0",
            amount: parseFloat(order.amount),
            currency: order.currency,
            name: "Learn Global",
            description: "Test Transaction",
            image: "https://example.com/your_logo",
            order_id: order.order_id,
            handler: (res) => {
                payNow(enrollId, index, res)
            },
            prefill: {
                name: userDetails.firstName,
                email: userDetails.email,
                contact: userDetails.phone,
            },
            notes: {
                address: "Razorpay Corporate Office",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const rzpay = new Razorpay(options);
        rzpay.open();
    }, [Razorpay]);

    return (
        <div className="App">
            <ButtonPrimary title={"Pay"} onclick={handlePayment} loading={false} />
        </div>
    );
}
