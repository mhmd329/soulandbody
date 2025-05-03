"use client";

import { useQuery } from "@tanstack/react-query";

export type OrderProductType = {
	employee: string;
	credit: number;
	debit: number;
	transactionType: string;
	referenceNumber: string;
	account: string;
	date: string;
};

const generateRandomProduct = (index: number): OrderProductType => {
	const quantity = 30 + Math.floor(Math.random() * 5); // vary quantity
	const unitPrice = 1400 + Math.floor(Math.random() * 200); // vary price
	const date = 1400 + Math.floor(Math.random() * 200); // vary price
	return {
		employee: "أحمد حسين",
		credit: 0.0,
		debit: 0.0,
		transactionType: "غير متوفر",
		referenceNumber: "غير متوفر",
		account: "غير متوفر",
		date: "17/12/2024",
	};
};

const orderProductsData: OrderProductType[] = Array.from(
	{ length: 100 },
	(_, i) => generateRandomProduct(i + 1)
);

export function useOrderProducts() {
	return useQuery({
		queryKey: ["order-products"],
		queryFn: async () => {
			// Simulate network delay
			// await new Promise((res) => setTimeout(res, 300));
			return orderProductsData;
		},
	});
}
