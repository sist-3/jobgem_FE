import { useFormContext } from "react-hook-form";
import Input from "../Input";

export default function UserForm() {
    const { getFieldState, getValues } = useFormContext({name: "email"});
    const email_validation = {
        required: "이메일을 입력해주세요.",
        pattern: {
            value: /\S+@\S+\.\S+/,
            message: "올바른 이메일 형태가 아닙니다.",
        }
    }
    const password_validation = {
        required: "비밀번호를 입력해주세요.",
    }

    const handleEmailCheck = () => {
        const emailState = getFieldState("email");
        const email = getValues("email");
        if(!emailState.error && email) {
            console.log("이메일 인증 가능")
        }
    }

    return (
        <div>
            <div className="flex">
                <div className="flex-2 w-4/5 mr-2">
                    <Input label="이메일" name="email" validation={email_validation} />
                </div>
                <div className="flex-1 w-1/5">
                    <button type="button" className="w-full h-10 bg-blue-500 text-white rounded-md border hover:bg-blue-600"
                    onClick={handleEmailCheck}
                    >인증받기</button>
                </div>
            </div>
            <Input type="password" label="비밀번호" name="password" validation={password_validation} />
        </div>
    )
}
