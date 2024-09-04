"use client";
import React, { useEffect, useState } from "react";
import Input from "@/components/form/Input";
import SideMenu from "@/components/sidemenu/SideMenu";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page(props) {
	const router = useRouter();

	const [coIdx, setCoIdx] = useState(""); // 초기 선택 상태를 빈 문자열로 설정
	const [company, setCompany] = useState([]);
	const [reTitle, setReTitle] = useState("");
	const [reContent, setReContent] = useState("");
	const [selectedStars, setSelectedStars] = useState(0); // 별점 상태 추가

	function getCompany() {
		axios.get("/api/companyList").then((res) => {
			setCompany(res.data); // 받아온 데이터를 상태에 저장
		});
	}

	useEffect(() => {
		getCompany();
	}, []);

	function send() {
		if (!coIdx) {
			alert("회사명을 선택해 주세요.");
			return;
		}
		axios({
			url: "/api/addReview",
			method: "get",
			params: {
				joIdx: props.params.id,
				coIdx: coIdx,
				reTitle: reTitle,
				reContent: reContent,
				reScore: selectedStars, // 선택된 별점 값을 보냄
			},
		}).then((res) => {
			console.log(res);
			if (res.status == 200) {
				alert("저장완료");
				router.push(`/user/company-review-list/${props.params.id}`);
			}
		});
	}

	function handleStarClick(index) {
		setSelectedStars(index === selectedStars ? 0 : index);
	}

	return (
		<div className='flex gap-2'>
			<SideMenu />
			<div className='bg-gray-100 flex-1 ml-2 '>
				<div className='bg-white p-8 rounded-lg '>
					<h2 className='text-2xl font-bold text-center mb-6'>회사후기 작성하기</h2>

					<div className='mb-4'>
						<label htmlFor='coIdx' className='block text-sm font-medium text-gray-700'>
							회사명
						</label>
						<select
							value={coIdx}
							onChange={(e) => setCoIdx(e.target.value)}
							className='w-full rounded py-3 px-[14px] text-body-color text-base border border-[f0f0f0] outline-none focus-visible:shadow-none focus:border-primary'
						>
							<option value=''>회사선택</option> {/* 기본 옵션 추가 */}
							{company.map((companyItem) => (
								<option key={companyItem.id} value={companyItem.id}>
									{companyItem.coName}
								</option>
							))}
						</select>
					</div>
					<div className='mb-4'>
						<label htmlFor='reTitle' className='block text-sm font-medium text-gray-700'>
							후기 제목
						</label>
						<Input
							type='text'
							id='reTitle'
							name='reTitle'
							placeholder='제목을 입력하세요'
							className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							value={reTitle}
							onChange={(e) => setReTitle(e.target.value)}
						/>
					</div>

					<div className='mb-4'>
						<label htmlFor='reContent' className='block text-sm font-medium text-gray-700'>
							리뷰 내용
						</label>
						<textarea
							id='reContent'
							name='reContent'
							rows='4'
							placeholder='내용을 입력하세요'
							className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							value={reContent}
							onChange={(e) => setReContent(e.target.value)}
						></textarea>
					</div>

					<div className='mb-6'>
						<label className='block text-sm font-medium text-gray-700'>별점 선택</label>
						<div className='flex items-center justify-center mt-2 space-x-1'>
							{[1, 2, 3, 4, 5].map((star) => (
								<svg
									key={star}
									className={`w-8 h-8 cursor-pointer ${selectedStars >= star ? "text-yellow-500" : "text-gray-300"}`}
									fill='currentColor'
									viewBox='0 0 24 24'
									onClick={() => handleStarClick(star)}
								>
									<path d='M12 .587l3.668 7.431 8.167 1.184-5.894 5.741 1.389 8.091L12 18.897l-7.33 3.853 1.389-8.091L.167 9.202l8.167-1.184z' />
								</svg>
							))}
						</div>
					</div>

					<div className='flex justify-center'>
						<button className='w-full px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600' onClick={send}>
							리뷰 제출하기
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
