import {useState} from "react";
//same as generalinfo

function Experience(){
    const [company, setCompany]=useState("");
    const [position, setPosition]=useState("");
    const [fromDate, setFromDate] = useState("");
    const [untilDate, setUntilDate] = useState("");

    const [isEditing, setIsEditing]=useState(true);

    return(
        <section>
            <h2>Practical Experience</h2>

            {
                isEditing ? (
                    <>
                    <input type="text" placeholder="Company Name" value={company} onChange={(e)=>setCompany(e.target.value)}/>
                    <input type="text" placeholder="Position Title" value={position} onChange={(e)=>setPosition(e.target.value)}/>
                    <input type="text" placeholder="From" value={fromDate} onChange={(e)=>setFromDate(e.target.value)}/>
                    <input type="text" placeholder="Until" value={untilDate} onChange={(e)=>setUntilDate(e.target.value)}/>
                    <button onClick={()=>setIsEditing(false)}>Submit</button>
                    
                    </>
                ):(
                    <>
                        <p><strong>Company:</strong>{company}</p>
                        <p><strong>Position:</strong>{position}</p>
                        <p><strong>Period:</strong>{" "}{fromDate}-{untilDate}</p>
                        <button onClick={()=>setIsEditing(true)}>Edit</button>
                    </>
                )
            }
        </section>
    );
}

export default Experience;