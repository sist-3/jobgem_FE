"use client";
import React, { useEffect, useState } from "react";
import Input from "@/components/form/Input";
import SideMenu from "@/components/sidemenu/SideMenu";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page(props) {
	const router = useRouter();

	const [coIdx, setCoIdx] = useState("");
	const [joIdx, setJoIdx] = useState("");
	const [company, setCompany] = useState([]);
	const [inContent, setInContent] = useState("");

	const interviewId = props.params.id; // 리뷰 ID를 props에서 가져옴

	function getCompany() {
		axios.get("/api/companyList").then((res) => {
			setCompany(res.data); // 받아온 데이터를 상태에 저장
		});
	}

	function getInterview() {
		axios.get(`/api/getInterview?id=${interviewId}`).then((res) => {
			const data = res.data;
			setCoIdx(data.coIdx); // 회사 ID 설정
			setJoIdx(data.joIdx); // 유저 ID 설정
			setInContent(data.inContent); // 리뷰 내용 설정
			setCompany(res.data.companyList); // 회사 목록을 상태에 설정
		});
	}

	useEffect(() => {
		getCompany();
		getInterview(); // 컴포넌트가 마운트될 때 한 번만 실행
	}, []);

	function send() {
		if (!coIdx) {
			alert("회사명을 선택해 주세요.");
			return;
		}
		axios({
			url: "/api/updateInterview",
			method: "get", // 업데이트를 위한 PUT 요청
			params: {
				id: interviewId,
				joIdx: joIdx,
				coIdx: coIdx,
				inContent: inContent,
			},
		}).then((res) => {
			console.log(res);
			if (res.status === 200) {
				alert("수정 완료");
				router.push(`/user/interview-list/${joIdx}`);
			}
		});
	}

	return (
		<div className='flex gap-2'>
			<SideMenu />
			<div className='bg-gray-100 flex-1 ml-2 '>
				<div className='bg-white p-8 rounded-lg '>
					<h2 className='text-2xl font-bold text-center mb-6'>면접후기 수정하기</h2>

					<div className='mb-4'>
						<label htmlFor='coIdx' className='block text-sm font-medium text-gray-700'>
							회사명
						</label>
						<select
							value={coIdx}
							onChange={(e) => setCoIdx(e.target.value)}
							className='w-full rounded py-3 px-[14px] text-body-color text-base border border-[f0f0f0] outline-none focus-visible:shadow-none focus:border-primary'
						>
							<option value=''>회사선택</option>
							{company && company.length > 0 ? (
								company.map((companyItem) => (
									<option key={companyItem.id} value={companyItem.id}>
										{companyItem.coName}
									</option>
								))
							) : (
								<option value=''>회사 정보가 없습니다</option>
							)}
						</select>
					</div>

					<div className='mb-4'>
						<label htmlFor='inContent' className='block text-sm font-medium text-gray-700'>
							리뷰 내용
						</label>
						<textarea
							id='inContent'
							name='inContent'
							rows='4'
							placeholder='내용을 입력하세요'
							className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							value={inContent}
							onChange={(e) => setInContent(e.target.value)}
						></textarea>
					</div>

					<div className='flex justify-center'>
						<button className='w-full px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600' onClick={send}>
							수정하기
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
