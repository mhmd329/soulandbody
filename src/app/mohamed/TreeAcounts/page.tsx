"use client";

import ReusableManyTable from "@/components/ReusableTableWithManyData";
import type { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import {
	useOrderProducts,
	type OrderProductType,
} from "./HooksTree/useOrderProducts";
import { Button } from "@/components/ui/button";
import { useTypedTranslation } from "@/hooks/useTypedTranslation";
import CustomInput from "@/components/customInput";
import CustomSelect from "@/components/customSelect";
import CustomPopUp from "@/components/popups";
function EyeIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M8.00521 10.3334C9.29387 10.3334 10.3385 9.28875 10.3385 8.00008C10.3385 6.71142 9.29387 5.66675 8.00521 5.66675C6.71654 5.66675 5.67188 6.71142 5.67188 8.00008C5.67188 9.28875 6.71654 10.3334 8.00521 10.3334Z"
				stroke="#16C47F"
			/>
			<path
				d="M13.4616 7.28933C13.7202 7.604 13.8496 7.76067 13.8496 8C13.8496 8.23933 13.7202 8.396 13.4616 8.71067C12.5149 9.86 10.4269 12 8.00292 12C5.57892 12 3.49092 9.86 2.54425 8.71067C2.28558 8.396 2.15625 8.23933 2.15625 8C2.15625 7.76067 2.28558 7.604 2.54425 7.28933C3.49092 6.14 5.57892 4 8.00292 4C10.4269 4 12.5149 6.14 13.4616 7.28933Z"
				stroke="#16C47F"
			/>
		</svg>
	);
}

export default function page() {
	const { t } = useTypedTranslation();
	const { data: orderProductsData, isLoading: orderProductsLoading } =
		useOrderProducts();

	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

	const toggleOption = (option: string) => {
		if (selectedOptions.includes(option)) {
			setSelectedOptions(selectedOptions.filter((item) => item !== option));
		} else {
			setSelectedOptions([...selectedOptions, option]);
		}
	};
	const orderProductColumns: ColumnDef<OrderProductType>[] = [
		{
			header: t("treeAcounts.employee"),
			accessorKey: "date",
		},
		{
			header: t("treeAcounts.credit"),
			accessorKey: "account",
		},
		{
			header: t("treeAcounts.referenceNumber"),
			accessorKey: "referenceNumber",
		},
		{
			header: t("treeAcounts.referenceNumber"),
			accessorKey: "transactionType",
		},
		{
			header: t("treeAcounts.debit"),
			accessorKey: "debit",
		},
		{
			header: t("treeAcounts.credit"),
			accessorKey: "credit",
		},
		{
			header: t("treeAcounts.transactionType"),
			accessorKey: "transactionType",
		},
		{
			header: t("treeAcounts.employee"),
			accessorKey: "employee",
		},
	];


	return (
		<div>
			<ReusableManyTable
				dataSets={[
					{
						columns: orderProductColumns,
						data: orderProductsData || [],
						loading: orderProductsLoading,
						UserComponent: () => (
							<div className="w-full p-6">
								<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
									<CustomInput
										label="من"
										type="date"
										className="w-full"
									/>
									<CustomInput
										label="إلى"
										type="date"
										className="w-full"
									/>
									<CustomSelect
										label="الحساب"
										options={["نقاط البيع", "كاش", "تحويل بنكي"]}
										triggerClassName="!h-[48px] w-full bg-white border border-gray-300 rounded-lg shadow-sm"
									/>
									<div className="flex items-end">
										<CustomPopUp
											DialogTriggerComponent={() => (
												<Button className="w-full h-[48px] bg-[#16C47F] hover:bg-[#13A66C] text-white rounded-lg">
													تنفيذ
												</Button>
											)}
											DialogContentComponent={({ closePopup }) => (
												<div className="p-6 bg-white rounded-md w-full max-w-[600px]">
													<h2 className="text-xl font-bold mb-4">ادخل البيانات لاضافة حساب جديد</h2>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<div>
															<CustomInput
																label="اسم الحساب"
																type="text"
																className="w-full"
															/>
														</div>

														<div>
															<CustomInput
																label="وصف الحساب"
																type="text"
																className="w-full"
															/>
														</div>

														<div>
															<CustomSelect
																label="وصف الحساب ١"
																options={["نقاط البيع", "كاش", "تحويل بنكي"]}
																triggerClassName="!h-[48px] w-full bg-white border border-gray-300 rounded-lg shadow-sm"
															/>
														</div>
														<div>
															<CustomSelect
																label="وصف الحساب ٢"
																options={["نقاط البيع", "كاش", "تحويل بنكي"]}
																triggerClassName="!h-[48px] w-full bg-white border border-gray-300 rounded-lg shadow-sm"
															/>
														</div>
														<div className="col-span-2 text-right">
															<p className="text-[rgba(22,196,127,1)] font-semibold text-sm mb-1 underline">ربط حسابات</p>
														</div>

														<div>
															<CustomSelect
																label="طبيعة الحساب"
																options={["نقاط البيع", "كاش", "تحويل بنكي"]}
																triggerClassName="!h-[48px] w-full bg-white border border-gray-300 rounded-lg shadow-sm"
															/>
														</div>
														<div>
															<CustomInput
																label="رصيد افتتاحي"
																type="text"
																className="w-full"
															/>
														</div>
													</div>
													<div className="grid grid-cols-2 gap-4 mt-4">
														{["ميزان مراجعة", "قائمة الدخل"].map((option) => (
															<div className="flex items-center gap-2" key={option}>
																<input
																	type="checkbox"
																	id={`option-${option}`}
																	checked={selectedOptions.includes(option)}
																	onChange={() => toggleOption(option)}
																	className="accent-[#13A66C] w-4 h-4 cursor-pointer"
																/>
																<label
																	htmlFor={`option-${option}`}
																	className="cursor-pointer text-sm font-semibold text-[#13A66C]"
																>
																	{option}
																</label>
															</div>
														))}
													</div>


													<div className="flex justify-start gap-4 mt-6">

														<Button className="bg-[#16C47F] hover:bg-[#13A66C]">اضافة حساب جديد</Button>
													</div>
												</div>
											)}
										/>

									</div>
								</div>
							</div>

						),
						label: t("ordersInUser.ordersList"),
						withPrinter: true
					},

				]}
				withTopPrinter={false}
			/>
		</div>
	);
}
