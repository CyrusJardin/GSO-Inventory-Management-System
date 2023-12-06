export default function SelectMonth ({ className, onHandleChange }) {
    return (
        <select 
            className={className}
            onChange={onHandleChange}
        >
            <option className="bg-slate-900" >-- Select Month --</option>
            <option className="bg-slate-900" value={'01'}>January</option>
            <option className="bg-slate-900" value={'02'}>February</option>
            <option className="bg-slate-900" value={'03'}>March</option>
            <option className="bg-slate-900" value={'04'}>April</option>
            <option className="bg-slate-900" value={'05'}>May</option>
            <option className="bg-slate-900" value={'06'}>June</option>
            <option className="bg-slate-900" value={'07'}>July</option>
            <option className="bg-slate-900" value={'08'}>August</option>
            <option className="bg-slate-900" value={'09'}>September</option>
            <option className="bg-slate-900" value={'10'}>October</option>
            <option className="bg-slate-900" value={'11'}>November</option>
            <option className="bg-slate-900" value={'12'}>December</option>
        </select>
    )
}