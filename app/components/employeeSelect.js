export default function EmployeeSelect ({ employees, className, onEmployeeChange }) {

    const handleSelectEmployee = e => {
        onEmployeeChange(e.target.value)
    }

    return (
        <select 
            className={className}
            onChange={handleSelectEmployee}
        >
            <option>-- Select Employee --</option>
            {
                employees.map((item,id)=>{
                    return (
                        <option key={id} value={item?._id}>{item?.first_name} {item?.last_name}</option>
                    )
                })
            }
        </select>
    )
}