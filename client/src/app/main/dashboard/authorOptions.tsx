import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import authors from "../../../data/authors.json";

interface MultipleSelectCheckmarksProps {
    value: string[];
    onChange: (value: string[]) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
            backgroundColor: "#2a2a2a",
        },
    },
};

const names = authors;

export default function MultipleSelectCheckmarks({
    value,
    onChange,
}: MultipleSelectCheckmarksProps) {
    const handleChange = (event: SelectChangeEvent<typeof value>) => {
        const {
            target: { value: newValue },
        } = event;
        // Convert to array if it's a string
        const selectedValues =
            typeof newValue === "string" ? newValue.split(",") : newValue;
        // Take only the last selected value
        const lastSelected = selectedValues[selectedValues.length - 1];
        // Update with an array containing only the last selected value
        onChange(lastSelected ? [lastSelected] : []);
    };

    return (
        <FormControl sx={{ m: 1, width: 300 }} className="bg-[#14121F]">
            <InputLabel
                id="author-select-label"
                sx={{ color: "white", "&.Mui-focused": { color: "white" } }}
            >
                Select Author
            </InputLabel>
            <Select
                labelId="author-select-label"
                id="author-select"
                // multiple
                value={value}
                onChange={handleChange}
                input={
                    <OutlinedInput
                        label="Select Author"
                        sx={{
                            color: "white",
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(255, 255, 255, 0.23)",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(255, 255, 255, 0.87)",
                            },
                        }}
                    />
                }
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
                sx={{
                    color: "white",
                    "& .MuiSelect-icon": {
                        color: "white",
                    },
                }}
            >
                {names.map((name: { author: string }, i) => (
                    <MenuItem
                        key={name.author + `${i}`}
                        value={name.author}
                        sx={{
                            color: "white",
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                            },
                        }}
                    >
                        <Checkbox
                            checked={value.includes(name.author)}
                            sx={{
                                color: "white",
                                "&.Mui-checked": {
                                    color: "white",
                                },
                            }}
                        />
                        <ListItemText primary={name.author} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
