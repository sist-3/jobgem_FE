"use client";
import Button from "@/components/button/Button";
import IconButton from "@/components/button/IconButton";
import SideMenu from "@/components/sidemenu/SideMenu";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

export default function Page(props) {
	const router = useRouter();
	const [page, setPage] = useState(0);
	const [review, setReview] = useState([]);
	const API_URL = `/api/reviewList?id=${props.params.id}&page=${page}&size=5`;

	function getData() {
		axios.get(API_URL).then((res) => {
			setReview(res.data.content); // 데이터를 상태에 저장
			console.log(res);
		});
	}

	function remove() {
		// axios({
		// 	url: "/api/reviewDelete",
		// 	method: "post",
		// 	params: {
		// 		subject: subject,
		// 		writer: writer,
		// 		content: content,
		// 	},
		// }).then((res) => {
		// 	if (res.data.cnt == 1) {
		// 		alert("삭제완료: " + res.data.vo.b_idx);
		// 	}
		// });
	}

	useEffect(() => {
		getData();
	}, [page]);

	return (
		<div className='flex gap-2'>
			<SideMenu />
			<div className='bg-gray-100 flex-1 ml-2'>
				<div className='bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto'>
					<div className='flex justify-between items-center'>
						<h1 className='text-2xl font-bold'>회사후기</h1>
						<Button type='submit' text='작성하기' onClick={() => router.push(`/user/company-review-write/${props.params.id}`)} />
					</div>

					{/* 테이블 헤더 */}
					<div className='flex justify-between items-center mt-5 px-5 py-2 font-bold bg-gray-200'>
						<p className='flex-1 text-center'>회사명</p>
						<p className='flex-1 text-center'>제목</p>
						<p className='flex-1 text-center'>작성일</p>
						<div className='w-16'></div> {/* 버튼 공간 */}
					</div>

					{review.length > 0 ? (
						review.map((review, index) => (
							<div key={index} className='flex justify-between items-center mb-6 mt-5 px-5 py-1'>
								<p className='flex-1 text-center'>{review.coName}</p>
								<p className='flex-1 text-center'>{review.reTitle}</p>
								<p className='flex-1 text-center'>{review.reWriteDate}</p>
								<div className='flex gap-2 border-l border-l-gray-300 px-3'>
									<IconButton>
										<FiEdit2 onClick={() => router.push(`/user/company-review-update/${review.id}`)} />
									</IconButton>
									<IconButton>
										<FiTrash2 onClick={remove} />
									</IconButton>
								</div>
							</div>
						))
					) : (
						<p>회사후기가 없습니다.</p>
					)}
				</div>
			</div>
		</div>
	);
}
