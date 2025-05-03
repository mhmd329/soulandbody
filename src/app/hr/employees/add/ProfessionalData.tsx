"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import CustomSelect from "@/components/customSelect";
import CustomInput from "@/components/customInput";
import LoadingIndicator from "@/components/loadingIndicator";
import {
	useEmployee,
	useGetAllFacilaties,
	useGetAlldepartments,
} from "../useEmployee";
import CustomPopUp from "@/components/popups";
import EmployeeManagement from "../../work-hours";
import {
	SickLeave,
	TotalLeave,
	RegularLeave,
	ContinuousAbsence,
	SeparateAbsence,
	EmergencyLeave,
} from "./popUps";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useDispatch } from "react-redux";
import { setEmployeeData } from "./createNewEmployee.slice";
import CustomPasswordInput from "@/components/custom-password-input";

interface ProfessionalDataFormProps {
	employeeId?: string;
	withTitle?: boolean;
	withEmployeeManagement?: boolean;
	CardStyle?: string;
	ButtonSubmit?: React.ComponentType<any>;
}

export default function ProfessionalDataForm({
	employeeId,
	withTitle = true,
	withEmployeeManagement = true,
	CardStyle,
	ButtonSubmit,
}: ProfessionalDataFormProps) {
	const dispatch = useDispatch();
	const employeeQuery = useEmployee(employeeId || "");
	const employee = useTypedSelector((state) => state.employee.employee);
	const t = useTranslations();
	const [selectedWorkNature, setSelectedWorkNature] = useState("");
	const buttonRef = useRef(null);

	const { data: allFacilaties, isLoading: facilatiesLoading } =
		useGetAllFacilaties();
	const { data: alldepartments, isLoading: departmentsLoading } =
		useGetAlldepartments();

	// Memoize facility options
	const facilityOptions = useMemo(
		() =>
			allFacilaties?.map((el: { name: any; id: any }) => ({
				label: el?.name,
				value: el?.id,
			})) || [],
		[allFacilaties]
	);

	// Memoize department options
	const departmentOptions = useMemo(
		() =>
			alldepartments?.map((el: { name: any; id: any }) => ({
				label: el?.name,
				value: el?.id,
			})) || [],
		[alldepartments]
	);

	// Memoize input change handler
	const handleInputChange = useCallback(
		(field: keyof typeof employee) =>
			(e: React.ChangeEvent<HTMLInputElement>) => {
				dispatch(setEmployeeData({ [field]: e.target.value }));
			},
		[dispatch]
	);

	// Memoize select change handler
	const handleSelectChange = useCallback(
		(field: keyof typeof employee) =>
			(value: string | number | { label: string; value: string }) => {
				dispatch(
					setEmployeeData({
						[field]:
							typeof value === "string" || typeof value === "number"
								? value
								: value?.value,
					})
				);
			},
		[dispatch]
	);

	// Update employee data when query data changes
	useEffect(() => {
		if (employeeId && employeeQuery?.data) {
			dispatch(setEmployeeData(employeeQuery.data));
		}
	}, [employeeQuery?.data, dispatch, employeeId]);

	return (
		<div className="space-y-2">
			<Card
				className={cn(
					"border-none bg-transparent shadow-none rounded-md p-6",
					CardStyle
				)}
			>
				{facilatiesLoading || departmentsLoading ? (
					<LoadingIndicator />
				) : (
					<CardContent className="p-0">
						<form className="space-y-6 flex flex-col">
							<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
								{/* First Row */}
								<CustomInput
									label={t("professionalData.form.fields.email")}
									name="email"
									value={employee.email}
									type="text"
									className="md:min-w-[200px] min-w-full rounded-[8px] py-3 pr-3 pl-4 bg-white border-[#D9D9D9] text-start"
									onChange={handleInputChange("email")}
								/>
								<CustomPasswordInput
									label={t("professionalData.form.fields.password")}
									name="password"
									value={employee.password}
									className="md:min-w-[200px] min-w-full rounded-[8px] py-3 pr-3 pl-4 bg-white border-[#D9D9D9] text-start"
									onChange={handleInputChange("password")}
								/>
								<CustomInput
									label={t("professionalData.form.fields.total_salary")}
									name="totalsalary"
									value={employee.net_salary}
									type="number"
									className="md:min-w-[200px] min-w-full rounded-[8px] py-3 pr-3 pl-4 bg-white border-[#D9D9D9] text-start"
									onChange={handleInputChange("net_salary")}
								/>
								<div></div>

								{/* Second Row */}
								<CustomSelect
									label={t("professionalData.form.fields.facility")}
									name="facility"
									options={facilityOptions}
									onValueChange={(e) => {
										handleSelectChange("facility_id")(e.toString());
									}}
									value={
										typeof employee.facility_id === "string"
											? employee.facility_id
											: typeof employee.facility_id === "number"
											? (employee.facility_id as number).toString()
											: ""
									}
									className="text-start"
								/>
								<CustomSelect
									label={t("professionalData.form.fields.department")}
									name="department"
									options={departmentOptions}
									loading={departmentsLoading}
									value={
										typeof employee.department_id === "string"
											? employee.department_id
											: typeof employee.department_id === "number"
											? (employee.department_id as number).toString()
											: ""
									}
									className="text-start"
									onValueChange={(e) => handleSelectChange("department_id")(e)}
								/>
								<CustomSelect
									label={t("professionalData.form.fields.user_type")}
									name="userType"
									options={["user", "admin"]}
									value={employee.role}
									className="text-start"
									onValueChange={(e) => handleSelectChange("role")(e)}
								/>
								<div></div>

								{/* Third Row */}
								<CustomSelect
									label={t("professionalData.form.fields.work_nature")}
									name="workNature"
									options={["full_time", "various"]}
									className="text-start"
									value={employee.job_nature}
									onValueChange={(value) => {
										setSelectedWorkNature(value);
										handleSelectChange("job_nature")(value);
									}}
								/>
								<CustomInput
									label={t("professionalData.form.fields.net_salary")}
									name="netSalary"
									value={employee.net_salary_after_deduction}
									type="string"
									className="md:min-w-[200px] min-w-full rounded-[8px] py-3 pr-3 pl-4 bg-white border-[#D9D9D9] text-start"
									onChange={handleInputChange("net_salary_after_deduction")}
								/>
								<CustomInput
									label={t("professionalData.form.fields.allowances")}
									name="allowance"
									value={employee.allowance}
									type="number"
									className="md:min-w-[200px] min-w-full rounded-[8px] py-3 pr-3 pl-4 bg-white border-[#D9D9D9] text-start"
									onChange={handleInputChange("allowance")}
								/>
								<div></div>
							</div>

							{ButtonSubmit && <ButtonSubmit ref={buttonRef} />}
						</form>
					</CardContent>
				)}
			</Card>

			{/* {withEmployeeManagement && selectedWorkNature === "various" && (
				<div className="mt-8 p-6">
					<EmployeeManagement
						saveHandler={() => {
							if (buttonRef?.current) {
								(buttonRef?.current as any)?.click();
							}
						}}
					/>
				</div>
			)} */}

			<ul className="p-6 text-[18px] flex flex-col md:gap-1 gap-1">
				<li className="flex flex-wrap">
					{t("employeeForm.leave.policy.intro")}
					<CustomPopUp
						DialogTriggerComponent={() => (
							<Button
								type="button"
								variant={"link"}
								className="px-1 text-[#129D66] text-[18px] py-0 h-fit font-semibold"
							>
								{parseFloat(employee.vacation_balance || "0") +
									" " +
									t("employeeForm.leave.policy.total_days")}
							</Button>
						)}
						DialogContentComponent={({ closePopup }) => (
							<TotalLeave ButtonSubmit={ButtonSubmit} closePopup={closePopup} />
						)}
					/>
					{t("employeeForm.leave.policy.divided_into")}
					<CustomPopUp
						DialogTriggerComponent={() => (
							<Button
								type="button"
								variant={"link"}
								className="px-1 text-[#129D66] text-[18px] py-0 h-fit font-semibold"
							>
								{parseFloat(employee.regular_leave_balance || "0") +
									" " +
									t("employeeForm.leave.policy.regular_days")}
							</Button>
						)}
						DialogContentComponent={({ closePopup }) => (
							<RegularLeave
								ButtonSubmit={ButtonSubmit}
								closePopup={closePopup}
							/>
						)}
					/>
					{t("employeeForm.leave.policy.and")}
					<CustomPopUp
						DialogTriggerComponent={() => (
							<Button
								type="button"
								variant={"link"}
								className="px-1 text-[#129D66] text-[18px] py-0 h-fit font-semibold"
							>
								{parseFloat(employee.casual_leave_balance || "0") +
									" " +
									t("employeeForm.leave.policy.emergency_days")}
							</Button>
						)}
						DialogContentComponent={({ closePopup }) => (
							<EmergencyLeave
								ButtonSubmit={ButtonSubmit}
								closePopup={closePopup}
							/>
						)}
					/>
					{t("employeeForm.leave.policy.and")}
					<CustomPopUp
						DialogTriggerComponent={() => (
							<Button
								type="button"
								variant={"link"}
								className="px-1 text-[#129D66] text-[18px] py-0 h-fit font-semibold"
							>
								{parseFloat(employee.sick_leave_balance || "0") +
									" " +
									t("employeeForm.leave.policy.sick_days")}
							</Button>
						)}
						DialogContentComponent={({ closePopup }) => (
							<SickLeave ButtonSubmit={ButtonSubmit} closePopup={closePopup} />
						)}
					/>
				</li>
				<li>{t("employeeForm.leave.policy.exceed_notice")}</li>
				<li className="flex flex-wrap">
					{t("employeeForm.leave.policy.absence_intro")}
					<CustomPopUp
						DialogTriggerComponent={() => (
							<Button
								type="button"
								variant={"link"}
								className="px-1 text-[#129D66] text-[18px] py-0 h-fit font-semibold"
							>
								{parseFloat(employee.sick_leave_balance || "0") +
									" " +
									t("employeeForm.leave.policy.continuous_absence")}
							</Button>
						)}
						DialogContentComponent={({ closePopup }) => (
							<ContinuousAbsence
								ButtonSubmit={ButtonSubmit}
								closePopup={closePopup}
							/>
						)}
					/>
					{t("employeeForm.leave.policy.or")}
					<CustomPopUp
						DialogTriggerComponent={() => (
							<Button
								type="button"
								variant={"link"}
								className="px-1 text-[#129D66] text-[18px] py-0 h-fit font-semibold"
							>
								{parseFloat(employee.sick_leave_balance || "0") +
									" " +
									t("employeeForm.leave.policy.separate_absence")}
							</Button>
						)}
						DialogContentComponent={({ closePopup }) => (
							<SeparateAbsence
								ButtonSubmit={ButtonSubmit}
								closePopup={closePopup}
							/>
						)}
					/>
					{parseFloat(employee.sick_leave_balance || "0") +
						" " +
						t("employeeForm.leave.policy.termination_notice")}
				</li>
			</ul>
		</div>
	);
}
