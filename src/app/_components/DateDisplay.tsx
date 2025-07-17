import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface PrettyDateCardProps {
	isoDate: Date;
}

const PrettyDateCard: React.FC<PrettyDateCardProps> = ({ isoDate }) => {
	if (!isoDate) {
		return "";
	}
	const localDate = dayjs(isoDate).tz(dayjs.tz.guess());
	const formatted = localDate.format("dddd, MMMM D, YYYY h:mm A");

	return formatted;
};

export default PrettyDateCard;
