import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Stack,
  SelectChangeEvent,
  styled,
} from "@mui/material";
import { ClearAll, FilterAlt } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { EOrderStatusSort, EPriceSort } from "../../types/interfaces";

const DatePicker = styled(TextField)({
  m: 1,
  minWidth: 120,
  "& .MuiOutlinedInput-input": {
    padding: "8px",
  },
});

const StyledSelect = styled(Select<HTMLInputElement>)({
  m: 1,
  minWidth: 120,
  "& .MuiOutlinedInput-input": {
    padding: "8px",
  },
});

export default function OrderFilter() {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<EOrderStatusSort | null>(
    EOrderStatusSort.ORDER_PLACED
  );
  const [priceSort, setPriceSort] = useState<EPriceSort | null>(
    EPriceSort.LOW_TO_HIGH
  );
  const navigate = useNavigate();
  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFromDate(new Date(event.target.value)); // Parse to Date object
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(new Date(event.target.value)); // Parse to Date object
  };

  const handleDeliveryStatusChange = (
    event: SelectChangeEvent<HTMLInputElement>
  ) => {
    if (
      event.target.value === EOrderStatusSort.ORDER_PLACED ||
      event.target.value === EOrderStatusSort.OUT_FOR_DELIVERY ||
      event.target.value === EOrderStatusSort.DELIVERED || event.target.value === EOrderStatusSort.ALL
    ) {
      setStatus(event.target.value as EOrderStatusSort);
    }
  };

  const handlePriceChange = (event: SelectChangeEvent<HTMLInputElement>) => {
    if (
      event.target.value === EPriceSort.LOW_TO_HIGH ||
      event.target.value === EPriceSort.HIGHT_TO_LOW
    ) {
      setPriceSort(event.target.value as EPriceSort);
    }
  };

  const handleFilter = () => {
    const searchParams = new URLSearchParams();
    if (fromDate) {
      searchParams.set("fromDate", new Date(fromDate).toISOString().split('T')[0].replace(/-/g, '/'));
    }
    if (toDate) {
      searchParams.set("toDate", new Date(toDate).toISOString().split('T')[0].replace(/-/g, '/'));
    }
    if (status && status !== EOrderStatusSort.ALL) {
      searchParams.set("status", status);
    }
    if (priceSort) {
      searchParams.set("priceSort", priceSort);
    }
    navigate({ search: searchParams.toString() });
  };

  const handleClear = () => {
    setFromDate(null);
    setToDate(null);
    setStatus(EOrderStatusSort.ALL);
    setPriceSort(EPriceSort.LOW_TO_HIGH);
    navigate({ search: "" });
  };

  return (
    <Stack
      spacing={1}
      direction="row"
      flexWrap="wrap"
      gap={2}
      sx={{ border: 1, p: 1, borderRadius: 2, borderColor: grey[300], mb: 2 }}
    >
      <DatePicker
        id="start-date"
        label="Start Date"
        type="date"
        value={fromDate?.toISOString().split("T")[0] || ""}
        onChange={handleStartDateChange}
        InputLabelProps={{ shrink: true }} // Adjust label behavior
      />
      <DatePicker
        label="End Date"
        id="end-date"
        type="date"
        value={toDate?.toISOString().split("T")[0] || ""}
        onChange={handleEndDateChange}
        InputLabelProps={{ shrink: true }} // Adjust label behavior
      />
      <FormControl sx={{ m: 1, minWidth: 160 }}>
        <InputLabel id="delivery-status-label">Delivery Status</InputLabel>
        <StyledSelect
          labelId="delivery-status-label"
          id="delivery-status"
          value={status?.toString() as HTMLInputElement | undefined}
          label="Delivery Status"
          onChange={handleDeliveryStatusChange}
          MenuProps={{ MenuListProps: { disablePadding: true } }}
        >
          <MenuItem value={EOrderStatusSort.ALL}>
            All
          </MenuItem>
          <MenuItem value={EOrderStatusSort.ORDER_PLACED}>
            Order Placed
          </MenuItem>
          <MenuItem value={EOrderStatusSort.OUT_FOR_DELIVERY}>
            Out for Delivery
          </MenuItem>
          <MenuItem value={EOrderStatusSort.DELIVERED}>Delivered</MenuItem>
        </StyledSelect>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="priceSort-label">Price</InputLabel>
        <StyledSelect
          labelId="priceSort-label"
          id="priceSort"
          value={priceSort?.toString() as "" | HTMLInputElement | undefined}
          label="priceSort"
          onChange={handlePriceChange}
        >
          <MenuItem value={EPriceSort.LOW_TO_HIGH}>Low to High</MenuItem>
          <MenuItem value={EPriceSort.HIGHT_TO_LOW}>High to Low</MenuItem>
        </StyledSelect>
      </FormControl>
      <IconButton color="primary" size="small" onClick={handleFilter}>
        <FilterAlt />
        Filter
      </IconButton>
      <IconButton color="primary" size="small" onClick={handleClear}>
        <ClearAll />
        Clear
      </IconButton>
    </Stack>
  );
}
