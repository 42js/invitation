import type { NextPage } from "next";
import Image from "next/image";
import { useRef, useState } from "react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";

const Home: NextPage = () => {
  const { width, height } = useWindowSize();
  const [login, setLogin] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [isConfetti, setIsConfetti] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!isSubmit) {
      setMessage(null);
      setIsSubmit(true);
      try {
        const res = await fetch("/api/send-invitation", {
          method: "POST",
          body: JSON.stringify({
            login: login,
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (res.status === 200) {
          setMessage("초대장 전송 성공!");
          setIsConfetti(true);
        } else {
          setMessage((await res.json()).message);
        }
      } catch (error) {
        if (error instanceof Error) {
          setMessage(error.message);
        } else {
          setMessage("에러 발생...");
        }
      }
      setIsSubmit(false);
    }
  };

  return (
    <div className="bg-yellow-400">
      {isConfetti && <ReactConfetti width={width} height={height} />}
      <div className="flex flex-col justify-center min-h-screen mx-auto max-w-sm p-2 sm:p-0">
        <div className="flex flex-col gap-4 bg-white p-4 rounded border border-neutral-100">
          <div className="flex justify-center">
            <Image
              width={"128px"}
              height={"128px"}
              src="https://avatars.githubusercontent.com/u/66766298?s=200&v=4"
              alt="42js"
            />
          </div>
          <h1 className="text-2xl font-bold"># 42JS</h1>
          <hr />
          <div className="flex w-full">
            <input
              disabled={isSubmit}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full border border-neutral-500 p-2 rounded-tl rounded-bl"
              placeholder="intraId"
            ></input>
            <div className="w-full border border-l-0 border-neutral-500 bg-neutral-100 p-2 rounded-tr rounded-br">
              @student.42seoul.kr
            </div>
          </div>
          <p>
            GitHub 계정에{" "}
            <b>student.42seoul.kr 이메일이 포함되어 있는지 확인</b>해 주세요!
          </p>
          <div className="flex justify-center">
            <button
              disabled={isSubmit || !login.length}
              className="transition-colors bg-neutral-700 hover:bg-neutral-500 disabled:bg-neutral-300 text-white p-3 rounded"
              onClick={handleSubmit}
            >
              초대장 신청하기
            </button>
          </div>
          {message && (
            <>
              <hr />
              <p className="text-red-600">{message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
