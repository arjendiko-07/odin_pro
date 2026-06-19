import {useState} from "react";
//same built as generalinfo

function Education(){
    const [school, setSchool] = useState("");
    const [study, setStudy]= useState("");
    const [date, setDate]=useState("");

    const [isEditing, setIsEditing]=useState(true);

    return(
        <section>
            <h2>Eductation</h2>

            {
                isEditing ? (
                    <>
                    <input type="text" placeholder="School Name" value={school} onChange={(e)=>setSchool(e.target.value)}/>
                    <input type="text" placeholder="Title of Study" value={study} onChange={(e)=>setStudy(e.target.value)}/>
                    <input type="text" placeholder="Date of Study" value={date} onChange={(e)=>setDate(e.target.value)}/>
                    <button onClick={()=>setIsEditing(false)}>Submit</button>

                    </>
                ) : (
                    <>
                        <p><strong>School:</strong>{school}</p>
                        <p><strong>Study:</strong>{study}</p>
                        <p><strong>Date:</strong>{date}</p>
                        <button onClick={()=>setIsEditing(true)}>Edit</button>
                    </>
                )
            }
        </section>
    );
}

export default Education;