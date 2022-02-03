import { useCallback, useState } from "react"

export default (initValue = null) => {
    const [value, setValue] = useState(initValue);
    const onChangeValue = useCallback((e) => {
        setValue(e.target.value);
    }, []);
    return [value, onChangeValue, setValue];
}