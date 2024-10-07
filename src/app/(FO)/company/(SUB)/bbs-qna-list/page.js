'use client';
import { Button, Checkbox, MenuItem, Pagination, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import '@/app/style/css/board.css';
import axios from 'axios';
import SideMenu from '@/components/sidemenu/SideMenu';
import { getToken } from '@/app/util/token/token';

// QnA 게시판 리스트
export default function page(props) {
	// 초기화
	const router = useRouter();
	const [ar, setAr] = useState([]);
	const API_URL = '/api/bbs/qna/my';
	const [token, setToken] = useState(null);

	useEffect(() => {
		getToken().then((res) => {
			setToken(res);
		});
	}, []);

	// 페이징
	const [cPage, setCPage] = useState(Number(props.searchParams.cPage));
	const [page, setPage] = useState(cPage ? cPage : 0);
	const [totalPage, setTotalPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	function changePage(event, value) {
		setPage(value - 1);
		router.replace(`/company/bbs/bbs-qna-list?cPage=${value - 1}`, { shallow: true }); // 뒤로가기에도 원래 페이지로 갈 수 있게 URL수정
	}

	useEffect(() => {
		setPage(cPage ? Math.max(0, Math.min(cPage, totalPage)) : 0);
	}, [cPage, totalPage]);
	//========================

	// 함수
	function getData() {
		axios
			.get(API_URL, {
				params: {
					page: page,
					size: pageSize,
					usIdx: token.USIDX,
				},
			})
			.then((res) => {
				setAr(res.data.content);
				setTotalPage(res.data.totalPages);
			});
	}

	useEffect(() => {
		getData();
	}, [page]);
	//=========================

	// 페이지
	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-3xl font-bold text-gray-800'>Q & A</h1>
				<div className='bbs_search'>
					<Button
						className='search_btn'
						variant='contained'
						onClick={() => {
							router.push('bbs-qna-write');
						}}
					>
						1:1 문의
					</Button>
					<Button
						className='search_btn'
						variant='outlined'
						onClick={() => {
							router.push('clovaChat');
						}}
					>
						Ai 상담
					</Button>
				</div>
			</div>
			<Table className='bbs_table'>
				<TableHead>
					<TableRow>
						<TableCell sx={{ width: '80px' }} align='center'>
							번호
						</TableCell>
						<TableCell sx={{ width: '*' }} align='center'>
							제목
						</TableCell>
						<TableCell sx={{ width: '150px' }} align='center'>
							작성일
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{ar.map((row) => (
						<TableRow key={row.id} className={styles.tableRow} onClick={() => router.push(`bbs-qna-view/${row.id}?cPage=${page}`)} hover>
							<TableCell align='center'>{row.id}</TableCell>
							<TableCell>
								{row.boTitle} &nbsp;&nbsp;| <strong> {row.boAnswer != 1 ? '답변대기' : '답변완료'}</strong>
							</TableCell>
							<TableCell align='center'>{row.boWritedate}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Pagination className='pagination' count={totalPage} page={page + 1} color='primary' onChange={changePage} />
		</div>
	);
}
